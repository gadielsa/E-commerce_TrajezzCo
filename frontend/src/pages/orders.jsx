import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { toast } from 'react-toastify'
import { orderService } from '../services/orderService'
import { trackingService } from '../services/trackingService'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [trackingModal, setTrackingModal] = useState({ open: false, tracking: null, order: null, loadingTracking: false })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const ordersFromAPI = await orderService.getMyOrders()
      setOrders(ordersFromAPI || [])
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      toast.error('Erro ao carregar pedidos')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleTrackOrder = async (orderId, trackingCode) => {
    setTrackingModal(prev => ({ ...prev, open: true, loadingTracking: true }))
    
    try {
      const result = await trackingService.trackOrderAuthenticated(orderId)
      
      if (result.success && result.order.tracking) {
        const formattedTracking = trackingService.formatTrackingInfo(result.order.tracking)
        setTrackingModal(prev => ({ 
          ...prev, 
          tracking: formattedTracking, 
          order: result.order,
          loadingTracking: false 
        }))
      } else {
        setTrackingModal(prev => ({ 
          ...prev, 
          tracking: null,
          order: result.order,
          loadingTracking: false,
          message: result.order.message || 'Código de rastreamento ainda não disponível'
        }))
      }
    } catch (error) {
      console.error('Erro ao rastrear:', error)
      toast.error(error.message || 'Erro ao rastrear pedido')
      setTrackingModal(prev => ({ ...prev, open: false }))
    }
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'Aguardando pagamento': 'bg-yellow-500',
      'Pagamento aprovado': 'bg-blue-500',
      'Em preparação': 'bg-blue-500',
      'Enviado': 'bg-purple-500',
      'Em trânsito': 'bg-purple-500',
      'Saiu para entrega': 'bg-indigo-500',
      'Entregue': 'bg-green-500',
      'Cancelado': 'bg-red-500',
      'Devolvido': 'bg-gray-500'
    }
    return statusColors[status] || 'bg-gray-500'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <div className='border-t pt-16 min-h-screen'>
        <div className='text-2xl mb-8'>
          <Title text1={'MEUS'} text2={'PEDIDOS'}/>
        </div>
        <div className='flex justify-center items-center py-20'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto'></div>
            <p className='mt-4 text-gray-600'>Carregando pedidos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8 flex items-center justify-between'>
        <Title text1={'MEUS'} text2={'PEDIDOS'}/>
        <button
          onClick={fetchOrders}
          className='text-sm px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-500 transition'
        >
          Atualizar
        </button>
      </div>

      <div className='space-y-6'>
        {orders.length === 0 ? (
          <div className='text-center py-20 bg-gray-50 rounded-lg'>
            <p className='text-gray-600 text-lg'>Você ainda não possui nenhum pedido.</p>
            <p className='text-gray-500 text-sm mt-2'>Que tal fazer seu primeiro pedido?</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className='border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition'>
              <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 pb-4 border-b'>
                <div>
                  <p className='text-lg font-semibold text-gray-900'>Pedido #{order.orderNumber}</p>
                  <p className='text-sm text-gray-600 mt-1'>Realizado em {formatDate(order.createdAt)}</p>
                </div>
                <div className='flex flex-col items-start md:items-end gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></span>
                    <span className='text-sm font-medium text-gray-700'>{order.status}</span>
                  </div>
                {order.trackingCode && (
                    <button
                      onClick={() => handleTrackOrder(order._id, order.trackingCode)}
                      className='inline-flex items-center gap-2 rounded-full border border-blue-600 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                    >
                      <span className='h-1.5 w-1.5 rounded-full bg-blue-600'></span>
                      Rastrear Pedido
                    </button>
                  )}
                </div>
              </div>

              <div className='space-y-4 mb-6'>
                {order.items.map((item, index) => (
                  <div key={index} className='flex gap-4'>
                    <img 
                      className='w-20 h-20 object-cover rounded border' 
                      src={item.image || '/placeholder.png'} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = '/placeholder.png'
                      }}
                    />
                    <div className='flex-1'>
                      <p className='font-medium text-gray-900'>{item.name}</p>
                      <div className='flex flex-wrap gap-3 mt-1 text-sm text-gray-600'>
                        <span>Tamanho: {item.size}</span>
                        <span>Qtd: {item.quantity}</span>
                        <span className='font-semibold text-gray-900'>{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-gray-900'>
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='border-t pt-4 space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Subtotal:</span>
                  <span className='text-gray-900'>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Frete:</span>
                    <span className='text-gray-900'>{formatCurrency(order.shippingCost)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className='flex justify-between text-sm text-green-600'>
                    <span>Desconto{order.couponCode ? ` (${order.couponCode})` : ''}:</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className='flex justify-between font-semibold text-lg border-t pt-2'>
                  <span className='text-gray-900'>Total:</span>
                  <span className='text-gray-900'>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              <div className='mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                <div className='flex-1'>
                  <p className='text-sm text-gray-600'>
                    Pagamento: <span className='font-medium text-gray-900'>
                      {order.paymentMethod === 'pix' && 'PIX'}
                      {order.paymentMethod === 'creditcard' && `Cartão ${order.paymentDetails?.cardBrand || ''}`}
                      {order.paymentMethod === 'boleto' && 'Boleto'}
                    </span>
                    {order.paymentDetails?.installments > 1 && (
                      <span> - {order.paymentDetails.installments}x</span>
                    )}
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>
                    Status do pagamento: <span className={`font-medium ${
                      order.paymentStatus === 'paid' ? 'text-green-600' :
                      order.paymentStatus === 'pending' ? 'text-yellow-600' :
                      order.paymentStatus === 'failed' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {order.paymentStatus === 'paid' && 'Pago'}
                      {order.paymentStatus === 'pending' && 'Pendente'}
                      {order.paymentStatus === 'failed' && 'Falhou'}
                      {order.paymentStatus === 'refunded' && 'Reembolsado'}
                    </span>
                  </p>
                </div>
                {order.paymentStatus === 'pending' && (
                  <button
                    onClick={() => window.location.href = `/confirmar-pagamento/${order._id}`}
                    className='bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap'
                  >
                    Efetuar Pagamento
                  </button>
                )}
              </div>

              {Array.isArray(order.statusHistory) && order.statusHistory.length > 0 && (
                <div className='mt-4 pt-4 border-t'>
                  <p className='text-sm font-semibold text-gray-900 mb-2'>Histórico do Pedido</p>
                  <ul className='space-y-2 text-sm text-gray-600'>
                    {[...order.statusHistory]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 5)
                      .map((item, idx) => (
                        <li key={`${order._id}-history-${idx}`} className='flex flex-col sm:flex-row sm:items-center sm:gap-2'>
                          <span className='font-medium text-gray-800'>{item.status}</span>
                          <span className='text-xs text-gray-500'>({formatDate(item.date)})</span>
                          {item.note && <span className='text-xs text-gray-500'>- {item.note}</span>}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal de Rastreamento */}
      {trackingModal.open && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto'>
            <div className='sticky top-0 bg-white border-b p-6 flex justify-between items-center'>
              <h3 className='text-lg font-semibold text-gray-900'>Rastreamento do Pedido</h3>
              <button
                onClick={() => setTrackingModal({ ...trackingModal, open: false })}
                className='text-gray-500 hover:text-gray-700 text-2xl leading-none'
              >
                ×
              </button>
            </div>

            <div className='p-6'>
              {trackingModal.loadingTracking ? (
                <div className='flex justify-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black'></div>
                </div>
              ) : trackingModal.message ? (
                <div className='bg-blue-50 border border-blue-200 p-4 rounded-lg text-center'>
                  <p className='text-sm text-blue-800'>{trackingModal.message}</p>
                  {trackingModal.order?.trackingCode && (
                    <p className='text-xs text-blue-600 mt-2'>
                      Código: {trackingModal.order.trackingCode}
                    </p>
                  )}
                </div>
              ) : trackingModal.tracking && trackingModal.tracking.historico?.length > 0 ? (
                <div className='space-y-4'>
                  <div className='mb-4'>
                    <p className='font-semibold text-gray-900 mb-1'>Status Atual</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(trackingModal.tracking.status)}`}>
                      {trackingModal.tracking.statusPT}
                    </span>
                  </div>

                  <div>
                    <p className='font-semibold text-gray-900 mb-3'>Últimas Atualizações</p>
                    <div className='space-y-3'>
                      {trackingModal.tracking.historico.slice(0, 5).map((evento, index) => (
                        <div key={index} className='flex gap-3 pb-3 border-b border-gray-200 last:border-b-0'>
                          <div className='flex flex-col items-center'>
                            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-black' : 'bg-gray-300'}`}></div>
                          </div>
                          <div className='flex-1'>
                            <p className='font-medium text-gray-900'>{evento.evento}</p>
                            <p className='text-xs text-gray-600'>{evento.data}</p>
                            {evento.local && (
                              <p className='text-xs text-gray-700 mt-1'>📍 {evento.local}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='text-center text-gray-600'>
                  <p>Sem informações de rastreamento disponíveis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
