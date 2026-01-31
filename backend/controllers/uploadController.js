const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const image = req.files.image;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: 'trajezz-ecommerce'
    });

    // Delete temporary file
    fs.unlinkSync(image.tempFilePath);

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ success: false, message: 'Public ID is required' });
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || !req.files.images) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }

    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    const uploadedImages = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: 'trajezz-ecommerce'
      });

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id
      });

      fs.unlinkSync(image.tempFilePath);
    }

    res.json({
      success: true,
      images: uploadedImages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
