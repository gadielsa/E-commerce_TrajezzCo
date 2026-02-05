import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    size: String,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantidade mínima é 1']
    },
    image: String
  }],
  deliveryInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: String, required: true },
    complement: String,
    neighborhood: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'Brasil' }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['pix', 'creditcard', 'boleto']
  },
  paymentDetails: {
    transactionId: String,
    cardBrand: String,
    lastDigits: String,
    installments: Number,
    pixCode: String,
    pixQrCode: String,
    boletoUrl: String,
    boletoBarcode: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal não pode ser negativo']
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Frete não pode ser negativo']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Desconto não pode ser negativo']
  },
  couponCode: {
    type: String,
    default: ''
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total não pode ser negativo']
  },
  status: {
    type: String,
    enum: [
      'Aguardando pagamento',
      'Pagamento aprovado',
      'Em preparação',
      'Enviado',
      'Em trânsito',
      'Saiu para entrega',
      'Entregue',
      'Cancelado',
      'Devolvido'
    ],
    default: 'Aguardando pagamento'
  },
  trackingCode: {
    type: String,
    default: ''
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String
  }],
  notes: {
    type: String,
    default: ''
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
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Gerar número do pedido antes de salvar
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `TRZ${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Adicionar status ao histórico quando mudar
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
      note: `Status alterado para: ${this.status}`
    });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
