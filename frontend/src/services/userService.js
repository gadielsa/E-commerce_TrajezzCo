import { fetchWithAuth } from '../config/api';

export const userService = {
  // Atualizar perfil
  async updateProfile(userData) {
    return await fetchWithAuth('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }
};
