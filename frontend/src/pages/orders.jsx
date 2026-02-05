import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { toast } from 'react-toastify'
import { orderService } from '../services/orderService'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleTrackOrder = (trackingCode) => {
    if (trackingCode) {
      toast.info(`Código de rastreamento: ${trackingCode}`)
    } else {
      toast.info('Código de rastreamento ainda não disponível')
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
                      onClick={() => handleTrackOrder(order.trackingCode)}
                      className='text-sm text-blue-600 hover:text-blue-800 underline'
                    >
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
    </div>
  )
}

export default Orders
