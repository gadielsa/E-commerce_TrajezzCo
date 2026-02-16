const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper para fazer requisições com token JWT
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

export const fetchWithAuth = (endpoint, options = {}) => apiRequest(endpoint, options);
export default API_URL;

// ==================== PRODUCT API ====================
export const productAPI = {
  // Obter todos os produtos
  getAll: () => apiRequest('/products'),

  // Obter um produto por ID
  getById: (id) => apiRequest(`/products/${id}`),

  // Criar novo produto (admin)
  create: (productData) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  // Atualizar produto (admin)
  update: (id, productData) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  // Deletar produto (admin)
  delete: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Filtrar produtos
  filter: (filters) =>
    apiRequest('/products/filter', {
      method: 'POST',
      body: JSON.stringify(filters),
    }),
};

// ==================== ORDER API ====================
export const orderAPI = {
  // Criar novo pedido
  create: (orderData) =>
    apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // Obter pedidos do usuário
  getUserOrders: () => apiRequest('/orders/my'),

  // Obter um pedido por ID
  getById: (id) => apiRequest(`/orders/${id}`),

  // Obter todos os pedidos (admin)
  getAll: () => apiRequest('/orders'),

  // Atualizar status do pedido (admin)
  updateStatus: (id, status) =>
    apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Cancelar pedido
  cancel: (id) =>
    apiRequest(`/orders/${id}/cancel`, {
      method: 'POST',
    }),
};

// ==================== COUPON API ====================
export const couponAPI = {
  // Validar cupom
  validate: (code) =>
    apiRequest('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  // Obter todos os cupons (admin)
  getAll: () => apiRequest('/coupons'),

  // Criar novo cupom (admin)
  create: (couponData) =>
    apiRequest('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    }),

  // Atualizar cupom (admin)
  update: (id, couponData) =>
    apiRequest(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(couponData),
    }),

  // Deletar cupom (admin)
  delete: (id) =>
    apiRequest(`/coupons/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== USER API ====================
export const userAPI = {
  // Obter perfil do usuário
  getProfile: () => apiRequest('/users/profile'),

  // Atualizar perfil do usuário
  updateProfile: (userData) =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Obter todos os usuários (admin)
  getAll: () => apiRequest('/users'),

  // Deletar usuário (admin)
  delete: (id) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== AUTH API ====================
export const authAPI = {
  // Registrar novo usuário
  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Login
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
  },

  // Verificar token
  verifyToken: (token) =>
    apiRequest('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};

// ==================== PAYMENT API ====================
export const paymentAPI = {
  // Criar pagamento com Stripe
  createStripePayment: (paymentData) =>
    apiRequest('/payments/stripe', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  // Confirmar pagamento com Stripe
  confirmStripePayment: (paymentIntentId) =>
    apiRequest('/payments/stripe/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    }),

  // Criar pagamento com MercadoPago
  createMercadoPagoPayment: (paymentData) =>
    apiRequest('/payments/mercado-pago', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),
};

// ==================== DELIVERY API ====================
export const deliveryAPI = {
  // Calcular frete
  calculateShipping: (cep, weight) =>
    apiRequest('/delivery/calculate', {
      method: 'POST',
      body: JSON.stringify({ cep, weight }),
    }),

  // Rastrear pedido
  track: (orderId) => apiRequest(`/delivery/track/${orderId}`),
};
