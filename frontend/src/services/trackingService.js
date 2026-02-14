import axios from 'axios'

const API_URL = typeof window !== 'undefined' ? (window.location.origin.includes('localhost') 
  ? 'http://localhost:5000'
  : window.location.protocol + '//' + window.location.host.replace(':5173', ':5000'))
  : 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Adicionar token de autentificação se disponível
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const trackingService = {
  // Rastrear pedido autenticado (usuário logado)
  trackOrderAuthenticated: async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}/track`)
      return response.data
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Erro ao rastrear pedido' }
    }
  },

  // Rastrear pedido publicamente (sem login)
  trackOrderPublic: async (orderNumber, trackingCode) => {
    try {
      const response = await api.post('/api/orders/public/track', {
        orderNumber,
        trackingCode
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Erro ao rastrear pedido' }
    }
  },

  // Formatar dados de rastreamento para exibição
  formatTrackingInfo: (tracking) => {
    if (!tracking || !tracking.historico) {
      return null
    }

    return {
      status: tracking.status,
      statusPT: getStatusPT(tracking.status),
      mensagem: tracking.mensagem,
      atualizacao: tracking.atualizacao,
      historico: tracking.historico.map(item => ({
        evento: item.evento || item.status || 'Atualização',
        data: formatDate(item.data || item.date),
        local: item.local || item.location || 'Não informado',
        detalhes: item.detalhes || item.details || ''
      }))
    }
  }
}

// Mapear status Melhor Envio para português
const getStatusPT = (status) => {
  const statusMap = {
    'received': 'Recebido',
    'forwarded': 'Encaminhado',
    'in_transit': 'Em trânsito',
    'on_delivery': 'Saiu para entrega',
    'delivered': 'Entregue',
    'returned': 'Devolvido',
    'exception': 'Exceção',
    'cancelled': 'Cancelado',
    'sro_returned': 'Devolvido ao remetente',
    'pending': 'Pendente',
    'em_transito': 'Em trânsito',
    'entregue': 'Entregue'
  }
  
  return statusMap[status] || status
}

// Formatar data para exibição
const formatDate = (date) => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default trackingService
