const db = require('../config/database');

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    const variants = await db.query('SELECT * FROM variants WHERE product_id = ?', [productId]);
    
    if (!product[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      ...product[0],
      variants: variants.reduce((acc, variant) => {
        if (!acc[variant.name]) acc[variant.name] = [];
        acc[variant.name].push(variant.value);
        return acc;
      }, {})
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};