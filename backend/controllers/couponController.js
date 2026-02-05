import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
    return res.status(201).json({ success: true, message: 'Cupom criado com sucesso', coupon });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Erro ao criar cupom' });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Erro ao buscar cupons' });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Cupom inválido' });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({ success: false, message: 'Cupom expirado ou inativo' });
    }

    if (!coupon.canUserUse(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Limite de uso do cupom atingido' });
    }

    if (coupon.isFirstPurchaseOnly) {
      const userOrders = await Order.countDocuments({ user: req.user._id });
      if (userOrders > 0) {
        return res.status(400).json({ success: false, message: 'Cupom válido apenas para primeira compra' });
      }
    }

    if (amount !== undefined) {
      if (coupon.minPurchaseAmount && amount < coupon.minPurchaseAmount) {
        return res.status(400).json({ success: false, message: `Valor mínimo para usar o cupom: R$ ${coupon.minPurchaseAmount.toFixed(2)}` });
      }
      const discount = coupon.calculateDiscount(amount);
      return res.status(200).json({ success: true, coupon, discount });
    }

    return res.status(200).json({ success: true, coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Erro ao validar cupom' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Cupom não encontrado' });
    }

    return res.status(200).json({ success: true, message: 'Cupom deletado com sucesso' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Erro ao deletar cupom' });
  }
};
