const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/:orderNumber', orderController.getOrderByNumber);

module.exports = router;