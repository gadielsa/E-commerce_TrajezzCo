const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// User profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Address management routes
router.post('/address', auth, userController.addAddress);
router.put('/address/:addressId', auth, userController.updateAddress);
router.delete('/address/:addressId', auth, userController.deleteAddress);

// Admin routes (to be protected by admin middleware in future)
router.get('/', auth, userController.getAllUsers);
router.put('/:userId', auth, userController.updateUser);
router.delete('/:userId', auth, userController.deleteUser);

module.exports = router;
