const express = require('express');
const router = express.Router();
const { createCoupon, getCoupons, validateCoupon, applyCoupon, deleteCoupon } = require('../controllers/couponController');
const auth = require('../middleware/auth');

router.post('/', auth, createCoupon);
router.get('/', auth, getCoupons);
router.post('/validate', auth, validateCoupon);
router.post('/apply', auth, applyCoupon);
router.delete('/:id', auth, deleteCoupon);

module.exports = router;
