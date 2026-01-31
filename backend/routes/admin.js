const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Dashboard & Stats
router.get('/stats', auth, adminController.getDashboardStats);
router.get('/analytics/products', auth, adminController.getProductAnalytics);
router.get('/analytics/users', auth, adminController.getUserAnalytics);

// Orders Management
router.get('/orders', auth, adminController.getAllOrders);
router.get('/orders/recent', auth, adminController.getRecentOrders);
router.get('/orders/pending', auth, adminController.getPendingOrders);
router.put('/orders/:orderId/status', auth, adminController.updateOrderStatus);

// Export Data
router.get('/export', auth, adminController.exportData);

module.exports = router;
