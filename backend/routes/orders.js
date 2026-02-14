import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, updateOrderPayment, trackOrder, trackOrderPublic } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/:id/track', protect, trackOrder);
router.post('/public/track', trackOrderPublic);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/payment', protect, updateOrderPayment);

export default router;
