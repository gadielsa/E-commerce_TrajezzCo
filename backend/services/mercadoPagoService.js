const axios = require('axios');

const mercadoPago = axios.create({
  baseURL: 'https://api.mercadopago.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
  }
});

exports.createPayment = async (amount, description, email) => {
  try {
    const response = await mercadoPago.post('/payments', {
      transaction_amount: amount,
      description,
      payment_method_id: 'pix',
      payer: {
        email
      }
    });

    return {
      success: true,
      payment: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

exports.getPayment = async (paymentId) => {
  try {
    const response = await mercadoPago.get(`/payments/${paymentId}`);

    return {
      success: true,
      payment: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

exports.createPreference = async (items, email) => {
  try {
    const response = await mercadoPago.post('/checkout/preferences', {
      items,
      payer: {
        email
      },
      payment_methods: {
        excluded_payment_types: [{ id: 'ticket' }]
      },
      back_urls: {
        success: process.env.FRONTEND_URL + '/orders',
        failure: process.env.FRONTEND_URL + '/checkout',
        pending: process.env.FRONTEND_URL + '/checkout'
      }
    });

    return {
      success: true,
      preferenceId: response.data.id,
      initPoint: response.data.init_point
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

exports.verifyWebhookSignature = (req) => {
  // TODO: Implementar verificação de assinatura do Mercado Pago
  // Ref: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
  const xSignature = req.headers['x-signature'];
  const xRequestId = req.headers['x-request-id'];
  
  if (!xSignature || !xRequestId) {
    console.warn('⚠️  Webhook sem assinatura válida');
    return false;
  }
  
  // Por enquanto, aceita todos para desenvolvimento
  // Em produção, validar: HMAC-SHA256 do body com secret
  return true;
};

exports.cancelPayment = async (paymentId) => {
  try {
    const response = await mercadoPago.put(`/payments/${paymentId}`, {
      status: 'cancelled'
    });

    return {
      success: true,
      payment: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
