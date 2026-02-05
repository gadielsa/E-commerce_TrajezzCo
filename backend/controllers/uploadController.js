import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado' });
    }

    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'trajezz/products',
      resource_type: 'image'
    });

    return res.status(201).json({
      success: true,
      message: 'Imagem enviada com sucesso',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao enviar imagem'
    });
  }
};
