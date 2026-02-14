import api from '../config/api'

const favoriteService = {
  // Obter favoritos do usuário
  getFavorites: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return { success: false, message: 'Usuário não autenticado' }
      }

      const response = await api.get('/users/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao buscar favoritos'
      }
    }
  },

  // Adicionar produto aos favoritos
  addFavorite: async (productId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return { success: false, message: 'Usuário não autenticado' }
      }

      const response = await api.post('/users/favorites', 
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao adicionar favorito'
      }
    }
  },

  // Remover produto dos favoritos
  removeFavorite: async (productId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return { success: false, message: 'Usuário não autenticado' }
      }

      const response = await api.delete(`/users/favorites/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Erro ao remover favorito:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao remover favorito'
      }
    }
  },

  // Sincronizar favoritos do localStorage para o banco
  syncFavorites: async (localFavorites) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return { success: false, message: 'Usuário não autenticado' }
      }

      const response = await api.post('/users/favorites/sync',
        { favorites: localFavorites },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Erro ao sincronizar favoritos:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao sincronizar favoritos'
      }
    }
  }
}

export default favoriteService
