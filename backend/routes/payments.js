const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const stripeService = require('../services/stripeService');
const mercadoPagoService = require('../services/mercadoPagoService');

router.post('/create-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'brl' } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const result = await stripeService.createPaymentIntent(amount, currency, {
      userId: req.user.id
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/mercadopago-preference', auth, async (req, res) => {
  try {
    const { items, email } = req.body;

    if (!items || !email) {
      return res.status(400).json({ success: false, message: 'Items and email are required' });
    }

    const result = await mercadoPagoService.createPreference(items, email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhook = stripeService.verifyWebhookSignature(req);

    if (!webhook) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const { type, data } = webhook;
    const intent = data.object;

    if (type === 'payment_intent.succeeded') {
      await Order.findOneAndUpdate(
        { 'paymentDetails.intentId': intent.id },
        { paymentStatus: 'confirmed', status: 'processing' },
        { new: true }
      );
    } else if (type === 'payment_intent.payment_failed') {
      await Order.findOneAndUpdate(
        { 'paymentDetails.intentId': intent.id },
        { paymentStatus: 'failed' },
        { new: true }
      );
    } else if (type === 'charge.refunded') {
      await Order.findOneAndUpdate(
        { 'paymentDetails.chargeId': intent.id },
        { paymentStatus: 'refunded', status: 'cancelled' },
        { new: true }
      );
    }

    res.json({ success: true, received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/webhook-mercadopago', async (req, res) => {
  try {
    const { id, type } = req.body;

    if (type === 'payment') {
      const result = await mercadoPagoService.getPayment(id);

      if (result.success) {
        const payment = result.payment;
        
        if (payment.status === 'approved') {
          await Order.findOneAndUpdate(
            { 'paymentDetails.paymentId': payment.id },
            { paymentStatus: 'confirmed', status: 'processing' },
            { new: true }
          );
        } else if (payment.status === 'rejected') {
          await Order.findOneAndUpdate(
            { 'paymentDetails.paymentId': payment.id },
            { paymentStatus: 'failed' },
            { new: true }
          );
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Mercado Pago webhook error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/refund', auth, async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const result = await stripeService.refundPayment(
      order.paymentDetails.intentId,
      amount || order.totalAmount
    );

    if (result.success) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'refunded' }, { new: true });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
