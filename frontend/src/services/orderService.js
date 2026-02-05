import { fetchWithAuth } from '../config/api';

export const orderService = {
  // Criar novo pedido
  async createOrder(orderData) {
    return await fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  // Buscar meus pedidos
  async getMyOrders() {
    const data = await fetchWithAuth('/orders/my');
    return data.orders;
  },

  // Buscar pedido por ID
  async getOrderById(id) {
    const data = await fetchWithAuth(`/orders/${id}`);
    return data.order;
  },

  // Buscar todos os pedidos (admin)
  async getAllOrders() {
    const data = await fetchWithAuth('/orders');
    return data.orders;
  },

  // Atualizar status do pedido (admin)
  async updateOrderStatus(id, status, trackingCode) {
    return await fetchWithAuth(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, trackingCode })
    });
  },

  // Atualizar pagamento do pedido
  async updateOrderPayment(id, paymentDetails, paymentStatus, status) {
    return await fetchWithAuth(`/orders/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify({ paymentDetails, paymentStatus, status })
    });
  }
};

export default orderService;

