import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

export const createOrder = async (req, res) => {
  try {
    const { items, deliveryInfo, paymentMethod, paymentDetails, subtotal, shippingCost, discount, couponCode, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Itens do pedido são obrigatórios' });
    }

    let appliedDiscount = discount || 0;
    let finalTotal = subtotal + shippingCost;
    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon) {
        return res.status(400).json({ success: false, message: 'Cupom inválido' });
      }

      if (!coupon.isValid() || !coupon.canUserUse(req.user._id)) {
        return res.status(400).json({ success: false, message: 'Cupom expirado ou limite atingido' });
      }

      if (coupon.isFirstPurchaseOnly) {
        const userOrders = await Order.countDocuments({ user: req.user._id });
        if (userOrders > 0) {
          return res.status(400).json({ success: false, message: 'Cupom válido apenas para primeira compra' });
        }
      }

      if (coupon.minPurchaseAmount && subtotal < coupon.minPurchaseAmount) {
        return res.status(400).json({ success: false, message: `Valor mínimo para usar o cupom: R$ ${coupon.minPurchaseAmount.toFixed(2)}` });
      }

      appliedDiscount = coupon.calculateDiscount(subtotal);
    }

    finalTotal = Math.max(0, finalTotal - appliedDiscount);

    if (paymentMethod === 'pix') {
      finalTotal = finalTotal * 0.94;
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      deliveryInfo,
      paymentMethod,
      paymentDetails,
      subtotal,
      shippingCost,
      discount: appliedDiscount,
      couponCode,
      totalAmount: finalTotal
    });

    if (coupon && appliedDiscount > 0) {
      await Coupon.findByIdAndUpdate(coupon._id, {
        $inc: { usedCount: 1 },
        $push: { usedBy: { user: req.user._id, orderNumber: order.orderNumber } }
      });
    }

    return res.status(201).json({ success: true, message: 'Pedido criado com sucesso', order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Erro ao criar pedido' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Erro ao buscar pedidos' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Erro ao buscar pedido' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Erro ao buscar pedidos' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingCode } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }

    if (status) order.status = status;
    if (trackingCode !== undefined) order.trackingCode = trackingCode;

    await order.save();

    return res.status(200).json({ success: true, message: 'Pedido atualizado', order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Erro ao atualizar pedido' });
  }
};

export const updateOrderPayment = async (req, res) => {
  try {
    const { paymentDetails, paymentStatus, status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }

    if (paymentDetails) order.paymentDetails = paymentDetails;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (status) order.status = status;

    await order.save();

    return res.status(200).json({ success: true, message: 'Pagamento atualizado', order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Erro ao atualizar pagamento' });
  }
};
