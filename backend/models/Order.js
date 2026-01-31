const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      size: String,
      image: String
    }
  ],
  deliveryInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    number: String,
    complement: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  subtotal: Number,
  shippingCost: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: String,
  totalAmount: Number,
  paymentMethod: { type: String, enum: ['card', 'pix', 'boleto'] },
  paymentStatus: { type: String, enum: ['pending', 'confirmed', 'failed', 'refunded'], default: 'pending' },
  paymentDetails: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  trackingNumber: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `TRZ${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
