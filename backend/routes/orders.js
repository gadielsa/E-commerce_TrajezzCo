const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus, updatePaymentStatus } = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, updateOrderStatus);
router.put('/:id/payment-status', auth, updatePaymentStatus);

module.exports = router;
