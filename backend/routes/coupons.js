import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createCoupon, getAllCoupons, validateCoupon, deleteCoupon } from '../controllers/couponController.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.get('/admin', protect, adminOnly, getAllCoupons);
router.post('/admin', protect, adminOnly, createCoupon);
router.delete('/admin/:id', protect, adminOnly, deleteCoupon);

export default router;
