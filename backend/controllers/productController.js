import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const { category, subCategory, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;

    if (search) {
      filter.$text = { $search: search };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao buscar produtos'
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao buscar produto'
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      product
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Erro ao criar produto'
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Produto atualizado com sucesso',
      product
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Erro ao atualizar produto'
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Erro ao deletar produto'
    });
  }
};
