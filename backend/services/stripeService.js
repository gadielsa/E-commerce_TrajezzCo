const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (amount, currency = 'brl', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      intentId: paymentIntent.id
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.confirmPaymentIntent = async (intentId) => {
  try {
    const intent = await stripe.paymentIntents.retrieve(intentId);
    return {
      success: true,
      status: intent.status,
      intent
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.verifyWebhookSignature = (req) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhook = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return webhook;
  } catch (error) {
    return null;
  }
};

exports.refundPayment = async (intentId, amount = null) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: intentId,
      amount: amount ? Math.round(amount * 100) : undefined
    });

    return {
      success: true,
      refund
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.getPaymentIntent = async (intentId) => {
  try {
    const intent = await stripe.paymentIntents.retrieve(intentId);
    return {
      success: true,
      intent
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
