import { fetchWithAuth } from '../config/api'

const favoriteService = {
  // Obter favoritos do usuário
  getFavorites: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return { success: false, message: 'Usuário não autenticado' }
      }

      const response = await fetchWithAuth('/users/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
      return {
        success: false,
        message: error.message || 'Erro ao buscar favoritos'
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

      const response = await fetchWithAuth('/users/favorites', 
        {
          method: 'POST',
          body: JSON.stringify({ productId }),
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return response
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error)
      return {
        success: false,
        message: error.message || 'Erro ao adicionar favorito'
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

      const response = await fetchWithAuth(`/users/favorites/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response
    } catch (error) {
      console.error('Erro ao remover favorito:', error)
      return {
        success: false,
        message: error.message || 'Erro ao remover favorito'
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

      const response = await fetchWithAuth('/users/favorites/sync',
        {
          method: 'POST',
          body: JSON.stringify({ favorites: localFavorites }),
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return response
    } catch (error) {
      console.error('Erro ao sincronizar favoritos:', error)
      return {
        success: false,
        message: error.message || 'Erro ao sincronizar favoritos'
      }
    }
  }
}

export default favoriteService
