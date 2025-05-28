const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

const sendOrderEmail = async (orderNumber, product, variant, quantity, total, customerInfo, status) => {
  let subject, html;

  if (status === 'approved') {
    subject = `Your Order Confirmation (#${orderNumber})`;
    html = `
      <h1>Thank you for your order!</h1>
      <p>Your order #${orderNumber} has been confirmed.</p>
      <h2>Order Details</h2>
      <p><strong>Product:</strong> ${product.name} (${variant ? variant.value : 'N/A'})</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <h2>Customer Information</h2>
      <p><strong>Name:</strong> ${customerInfo.fullName}</p>
      <p><strong>Email:</strong> ${customerInfo.email}</p>
      <p><strong>Address:</strong> ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}</p>
    `;
  } else {
    subject = `Order Failed (#${orderNumber})`;
    html = `
      <h1>Your order could not be processed</h1>
      <p>We're sorry, but your order #${orderNumber} could not be completed because the transaction was ${status}.</p>
      <p>Please try again or contact support if you need assistance.</p>
      <p>Error: Transaction ${status}</p>
    `;
  }

  const mailOptions = {
    from: '"eCommerce Store" <store@example.com>',
    to: customerInfo.email,
    subject: subject,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendOrderEmail
};