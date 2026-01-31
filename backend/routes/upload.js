const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage, uploadMultiple } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

router.post('/image', auth, uploadImage);
router.post('/images', auth, uploadMultiple);
router.delete('/image', auth, deleteImage);

module.exports = router;
