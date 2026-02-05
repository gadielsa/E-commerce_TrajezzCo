import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, updateOrderPayment } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/payment', protect, updateOrderPayment);

export default router;
