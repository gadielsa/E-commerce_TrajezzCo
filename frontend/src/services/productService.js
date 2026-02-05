import { fetchWithAuth } from '../config/api';
import API_URL from '../config/api';

export const productService = {
  // Buscar todos os produtos
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.subCategory) params.append('subCategory', filters.subCategory);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';

    const response = await fetch(`${API_URL}${url}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar produtos');
    }

    return data.products;
  },

  // Buscar produto por ID
  async getProductById(id) {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar produto');
    }

    return data.product;
  },

  // Criar produto (admin)
  async createProduct(productData) {
    return await fetchWithAuth('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  // Atualizar produto (admin)
  async updateProduct(id, productData) {
    return await fetchWithAuth(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  // Deletar produto (admin)
  async deleteProduct(id) {
    return await fetchWithAuth(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Upload de imagem (admin)
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer upload');
    }

    return data.url;
  }
};
