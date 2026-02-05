import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Código do cupom é obrigatório'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Código deve ter no mínimo 3 caracteres'],
    maxlength: [20, 'Código deve ter no máximo 20 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [200, 'Descrição deve ter no máximo 200 caracteres']
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: [true, 'Valor do desconto é obrigatório'],
    min: [0, 'Valor do desconto não pode ser negativo']
  },
  minPurchaseAmount: {
    type: Number,
    default: 0,
    min: [0, 'Valor mínimo não pode ser negativo']
  },
  maxDiscountAmount: {
    type: Number,
    default: null,
    min: [0, 'Desconto máximo não pode ser negativo']
  },
  usageLimit: {
    type: Number,
    default: null,
    min: [1, 'Limite de uso deve ser no mínimo 1']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Contador de uso não pode ser negativo']
  },
  perUserLimit: {
    type: Number,
    default: 1,
    min: [1, 'Limite por usuário deve ser no mínimo 1']
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: String,
    enum: ['Masculino', 'Feminino', 'Infantil']
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isFirstPurchaseOnly: {
    type: Boolean,
    default: false
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderNumber: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ createdAt: -1 });

// Verificar se cupom está válido
couponSchema.methods.isValid = function() {
  const now = new Date();
  
  if (!this.isActive) return false;
  if (now < this.validFrom) return false;
  if (now > this.validUntil) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  
  return true;
};

// Verificar se usuário pode usar o cupom
couponSchema.methods.canUserUse = function(userId) {
  if (!this.isValid()) return false;
  
  const userUsage = this.usedBy.filter(
    usage => usage.user.toString() === userId.toString()
  );
  
  if (userUsage.length >= this.perUserLimit) return false;
  
  return true;
};

// Calcular desconto
couponSchema.methods.calculateDiscount = function(amount) {
  if (amount < this.minPurchaseAmount) {
    return 0;
  }
  
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else {
    discount = this.discountValue;
  }
  
  return Math.min(discount, amount);
};

// Middleware para atualizar updatedAt
couponSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
