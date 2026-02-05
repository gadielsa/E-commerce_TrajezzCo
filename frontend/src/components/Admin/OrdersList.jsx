import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { orderAPI } from '../../config/api'

const OrdersList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderAPI.getAll()
      setOrders(data.orders || [])
    } catch (error) {
      toast.error('Erro ao carregar pedidos')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (order) => {
    setEditingId(order._id)
    setEditData({ status: order.status })
  }

  const handleSaveStatus = async () => {
    try {
      await orderAPI.updateStatus(editingId, editData.status)
      toast.success('Status atualizado com sucesso!')
      setEditingId(null)
      fetchOrders()
    } catch (error) {
      toast.error(error.message || 'Erro ao atualizar status')
      console.error('Erro:', error)
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  if (loading) {
    return <div className='text-center py-10'>Carregando pedidos...</div>
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>Gerenciar Pedidos</h2>

      {/* Filtros */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Filtrar por Status</label>
        <div className='relative'>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='appearance-none w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white'
          >
            <option value='all'>Todos os Pedidos</option>
            <option value='Aguardando pagamento'>Aguardando pagamento</option>
            <option value='Pagamento aprovado'>Pagamento aprovado</option>
            <option value='Em preparação'>Em preparação</option>
            <option value='Enviado'>Enviado</option>
            <option value='Em trânsito'>Em trânsito</option>
            <option value='Saiu para entrega'>Saiu para entrega</option>
            <option value='Entregue'>Entregue</option>
            <option value='Cancelado'>Cancelado</option>
            <option value='Devolvido'>Devolvido</option>
          </select>
          <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
            <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
            </svg>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>ID do Pedido</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Cliente</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Total</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Status</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Data</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id} className='border-b border-gray-200 hover:bg-gray-50'>
                <td className='py-4 px-4 font-mono text-sm text-gray-900'>{order._id?.substring(0, 8)}...</td>
                <td className='py-4 px-4 text-gray-700'>{order.deliveryInfo?.email || 'N/A'}</td>
                <td className='py-4 px-4 text-gray-700 font-semibold'>R$ {order.totalAmount?.toFixed(2) || '0.00'}</td>
                <td className='py-4 px-4'>
                  {editingId === order._id ? (
                    <div className='relative inline-block w-full'>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                        className='appearance-none w-full px-2 py-1 pr-6 border border-gray-300 rounded bg-white'
                      >
                        <option value='Aguardando pagamento'>Aguardando pagamento</option>
                        <option value='Pagamento aprovado'>Pagamento aprovado</option>
                        <option value='Em preparação'>Em preparação</option>
                        <option value='Enviado'>Enviado</option>
                        <option value='Em trânsito'>Em trânsito</option>
                        <option value='Saiu para entrega'>Saiu para entrega</option>
                        <option value='Entregue'>Entregue</option>
                        <option value='Cancelado'>Cancelado</option>
                        <option value='Devolvido'>Devolvido</option>
                      </select>
                      <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
                        <svg className='w-3 h-3 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'Entregue' ? 'bg-green-100 text-green-800' :
                      order.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Pagamento aprovado' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Cancelado' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status || 'N/A'}
                    </span>
                  )}
                </td>
                <td className='py-4 px-4 text-gray-700 text-sm'>
                  {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className='py-4 px-4 space-x-2'>
                  {editingId === order._id ? (
                    <>
                      <button
                        onClick={handleSaveStatus}
                        className='px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm'
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className='px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition text-sm'
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(order)}
                      className='px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm'
                    >
                      Alterar Status
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className='text-center py-10 text-gray-500'>
          Nenhum pedido encontrado com este status
        </div>
      )}
    </div>
  )
}

export default OrdersList
