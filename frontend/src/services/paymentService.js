import { fetchWithAuth } from '../config/api';

/**
 * Serviço de Pagamentos - Stripe
 */
export const paymentService = {
  /**
   * Criar intenção de pagamento
   * @param {number} amount - Valor em reais
   * @param {string} description - Descrição do pagamento
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} Client secret do Stripe
   */
  async createPaymentIntent(amount, description, orderId) {
    return await fetchWithAuth('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ 
        amount, 
        description, 
        orderId, 
        paymentMethodTypes: ['card'] 
      })
    });
  },

  /**
   * Verificar status de pagamento
   * @param {string} paymentIntentId - ID do payment intent
   * @returns {Promise<Object>} Status do pagamento
   */
  async checkPaymentStatus(paymentIntentId) {
    return await fetchWithAuth(`/payments/status/${paymentIntentId}`);
  },

  /**
   * Solicitar reembolso
   * @param {string} paymentIntentId - ID do pagamento
   * @param {number} amount - Valor a reembolsar (opcional, total se não especificado)
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} Dados do reembolso
   */
  async requestRefund(paymentIntentId, amount, orderId) {
    return await fetchWithAuth('/payments/refund', {
      method: 'POST',
      body: JSON.stringify({ 
        paymentIntentId, 
        amount, 
        orderId 
      })
    });
  },

  /**
   * Criar/atualizar cliente no Stripe
   * @param {Object} customerData - Dados do cliente
   * @returns {Promise<Object>} Dados do cliente Stripe
   */
  async manageCustomer(customerData) {
    return await fetchWithAuth('/payments/customer', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
  }
};

export default paymentService;
