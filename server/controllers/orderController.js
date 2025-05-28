const db = require('../config/database');
const mailService = require('../services/mailService');

exports.createOrder = async (req, res) => {
  const {
    productId,
    variant,
    quantity,
    customerInfo,
    cardNumber,
    expiryDate,
    cvv,
    simulationType
  } = req.body;

  if (!productId || !quantity || !customerInfo || !cardNumber || !expiryDate || !cvv) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const connection = await db.connect();
    await connection.beginTransaction();

    try {
      const [product] = await connection.query('SELECT * FROM products WHERE id = ? FOR UPDATE', [productId]);
      if (!product[0]) {
        throw new Error('Product not found');
      }

      let variantDetails = null;
      if (variant) {
        const [variantResult] = await connection.query(
          'SELECT * FROM variants WHERE product_id = ? AND value = ?', 
          [productId, variant]
        );
        variantDetails = variantResult[0];
      }

      const subtotal = product[0].price * quantity;
      const total = subtotal;
      const orderNumber = 'ORD-' + Date.now();

      let transactionStatus;
      switch (simulationType) {
        case '1': transactionStatus = 'approved'; break;
        case '2': transactionStatus = 'declined'; break;
        case '3': transactionStatus = 'failed'; break;
        default: transactionStatus = 'approved';
      }

      const [order] = await connection.query(
        `INSERT INTO orders (
          order_number, product_id, variant_id, quantity, subtotal, total,
          full_name, email, phone, address, city, state, zip_code, transaction_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderNumber, productId, variantDetails?.id || null, quantity, subtotal, total,
          customerInfo.fullName, customerInfo.email, customerInfo.phone, customerInfo.address,
          customerInfo.city, customerInfo.state, customerInfo.zipCode, transactionStatus
        ]
      );

      if (transactionStatus === 'approved') {
        await connection.query(
          'UPDATE products SET inventory = inventory - ? WHERE id = ?',
          [quantity, productId]
        );
      }

      await connection.commit();
      connection.release();

      await mailService.sendOrderEmail(
        orderNumber, 
        product[0], 
        variantDetails, 
        quantity, 
        total, 
        customerInfo, 
        transactionStatus
      );

      res.json({
        orderNumber,
        status: transactionStatus,
        message: transactionStatus === 'approved' ? 'Order placed successfully' : `Transaction ${transactionStatus}`
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Order processing error:', error);
    res.status(500).json({ error: error.message || 'Order processing failed' });
  }
};

exports.getOrderByNumber = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, p.name as product_name, p.price as product_price, p.image_url as product_image,
             v.value as variant_value
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      LEFT JOIN variants v ON o.variant_id = v.id
      WHERE o.order_number = ?
    `, [req.params.orderNumber]);

    if (!orders[0]) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(orders[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};