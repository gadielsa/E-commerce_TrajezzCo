import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    maxlength: [200, 'Nome deve ter no máximo 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [2000, 'Descrição deve ter no máximo 2000 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['Roupas', 'Tênis', 'Acessórios']
  },
  subCategory: {
    type: String,
    enum: ['Camisetas', 'Shorts', 'Calças', 'Regatas', 'Moletons', 'Jaquetas e Casacos', 'Infantil', 'Boné', 'Cinto', 'Shoulder Bag']
  },
  sizes: [{
    type: String,
    required: true
  }],
  sizeType: {
    type: String,
    enum: ['clothing', 'shoes'],
    default: 'clothing'
  },
  images: [{
    type: String,
    required: true
  }],
  isBestseller: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Estoque não pode ser negativo']
  },
  sold: {
    type: Number,
    default: 0,
    min: [0, 'Quantidade vendida não pode ser negativa']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Avaliação mínima é 0'],
    max: [5, 'Avaliação máxima é 5']
  },
  numReviews: {
    type: Number,
    default: 0,
    min: [0, 'Número de avaliações não pode ser negativo']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para melhor performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isBestseller: 1 });
productSchema.index({ isAvailable: 1 });
productSchema.index({ createdAt: -1 });

// Virtual para URL das imagens (se usar Cloudinary)
productSchema.virtual('imageUrls').get(function() {
  return this.images;
});

// Middleware para atualizar updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
