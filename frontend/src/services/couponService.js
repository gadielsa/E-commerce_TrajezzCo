import { fetchWithAuth } from '../config/api';

export const couponService = {
  // Validar cupom
  async validateCoupon(code, amount) {
    const data = await fetchWithAuth('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, amount })
    });
    return data;
  },

  // Buscar todos os cupons (admin)
  async getAllCoupons() {
    const data = await fetchWithAuth('/coupons/admin');
    return data.coupons;
  },

  // Criar cupom (admin)
  async createCoupon(couponData) {
    return await fetchWithAuth('/coupons/admin', {
      method: 'POST',
      body: JSON.stringify(couponData)
    });
  },

  // Deletar cupom (admin)
  async deleteCoupon(id) {
    return await fetchWithAuth(`/coupons/admin/${id}`, {
      method: 'DELETE'
    });
  }
};
