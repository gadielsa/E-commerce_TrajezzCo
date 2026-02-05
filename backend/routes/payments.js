import express from 'express';
import Stripe from 'stripe';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Criar Payment Intent
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { amount, description, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valor inválido' 
      });
    }

    // Criar Payment Intent no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'brl',
      description: description || `Pedido ${orderId}`,
      metadata: {
        orderId: orderId || '',
        userId: req.user._id.toString()
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Erro ao criar Payment Intent:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao processar pagamento'
    });
  }
});

// Verificar status do pagamento
router.get('/status/:paymentIntentId', protect, async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      req.params.paymentIntentId
    );

    res.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status do pagamento'
    });
  }
});

// Webhook do Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Processar evento
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
        
        // Atualizar pedido
        if (paymentIntent.metadata.orderId) {
          await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
            paymentStatus: 'paid',
            status: 'Pagamento aprovado',
            'paymentDetails.transactionId': paymentIntent.id
          });
        }
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        console.log('❌ PaymentIntent failed:', failedIntent.id);
        
        if (failedIntent.metadata.orderId) {
          await Order.findByIdAndUpdate(failedIntent.metadata.orderId, {
            paymentStatus: 'failed',
            status: 'Aguardando pagamento'
          });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Solicitar reembolso
router.post('/refund', protect, async (req, res) => {
  try {
    const { paymentIntentId, amount, orderId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID é obrigatório'
      });
    }

    // Criar reembolso
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined
    });

    // Atualizar pedido
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'refunded',
        status: 'Devolvido'
      });
    }

    res.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Erro ao processar reembolso:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao processar reembolso'
    });
  }
});

export default router;
