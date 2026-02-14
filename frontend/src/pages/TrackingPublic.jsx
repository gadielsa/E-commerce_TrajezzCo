import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { trackingService } from '../services/trackingService'
import Title from '../components/Title'

const TrackingPublic = () => {
  const [formData, setFormData] = useState({
    orderNumber: '',
    trackingCode: ''
  })
  const [tracking, setTracking] = useState(null)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value.toUpperCase()
    }))
  }

  const handleTrack = async (e) => {
    e.preventDefault()

    if (!formData.orderNumber || !formData.trackingCode) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    try {
      const result = await trackingService.trackOrderPublic(formData.orderNumber, formData.trackingCode)
      
      if (result.success) {
        setOrder(result.order)
        if (result.order.tracking) {
          setTracking(trackingService.formatTrackingInfo(result.order.tracking))
        }
        toast.success('Pedido encontrado!')
      } else {
        toast.error(result.message || 'Erro ao rastrear pedido')
      }
    } catch (error) {
      console.error('Erro ao rastrear:', error)
      toast.error(error.message || 'Erro ao rastrear pedido')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'em_transito': 'bg-blue-100 text-blue-800',
      'entregue': 'bg-green-100 text-green-800',
      'devolvido': 'bg-red-100 text-red-800',
      'saiu_para_entrega': 'bg-purple-100 text-purple-800',
      'recebido': 'bg-gray-100 text-gray-800',
      'encaminhado': 'bg-yellow-100 text-yellow-800',
      'exception': 'bg-orange-100 text-orange-800',
      'pending': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className='pt-10 transition-opacity ease-in duration-1000 opacity-100'>
      <div className='text-2xl mb-4'>
        <Title text1={'RASTREAR'} text2={'SEU PEDIDO'} />
      </div>

      <div className='flex justify-center mb-12'>
        <form onSubmit={handleTrack} className='w-full max-w-md bg-gray-50 p-8 rounded-lg border border-gray-200'>
          <h3 className='font-semibold text-gray-800 mb-4'>Informe os dados do seu pedido</h3>
          
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Número do Pedido
            </label>
            <input
              type='text'
              name='orderNumber'
              value={formData.orderNumber}
              onChange={handleInputChange}
              placeholder='Ex: TRZ17394521234'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black'
            />
            <p className='text-xs text-gray-500 mt-1'>Encontre este número na sua confirmação de pedido</p>
          </div>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Código de Rastreamento
            </label>
            <input
              type='text'
              name='trackingCode'
              value={formData.trackingCode}
              onChange={handleInputChange}
              placeholder='Ex: AA123456789BR'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black'
            />
            <p className='text-xs text-gray-500 mt-1'>Você recebeu este código por email</p>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400'
          >
            {loading ? 'Rastreando...' : 'Rastrear Pedido'}
          </button>
        </form>
      </div>

      {order && (
        <div className='max-w-4xl mx-auto'>
          {/* Informações do Pedido */}
          <div className='bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Informações do Pedido</h3>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <p className='text-sm text-gray-600'>Número do Pedido</p>
                <p className='font-semibold text-gray-900'>{order.orderNumber}</p>
              </div>
              
              <div>
                <p className='text-sm text-gray-600'>Status Atual</p>
                <div className='flex items-center gap-2 mt-1'>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className='text-sm text-gray-600'>Endereço de Entrega</p>
              <p className='font-semibold text-gray-900'>
                {order.deliveryInfo.address}
              </p>
              <p className='text-sm text-gray-700'>
                {order.deliveryInfo.city}, {order.deliveryInfo.state}
              </p>
            </div>
          </div>

          {/* Rastreamento */}
          {tracking && tracking.historico && tracking.historico.length > 0 && (
            <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Histórico de Rastreamento</h3>

              <div className='space-y-4'>
                {tracking.historico.map((evento, index) => (
                  <div key={index} className='flex gap-4 pb-4 border-b border-gray-200 last:border-b-0'>
                    <div className='flex flex-col items-center'>
                      <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-black' : 'bg-gray-300'}`}></div>
                      {index < tracking.historico.length - 1 && (
                        <div className='w-0.5 h-12 bg-gray-300 mt-2'></div>
                      )}
                    </div>

                    <div className='pb-2'>
                      <p className='font-semibold text-gray-900'>{evento.evento}</p>
                      <p className='text-sm text-gray-600'>{evento.data}</p>
                      {evento.local && (
                        <p className='text-sm text-gray-700 mt-1'>📍 {evento.local}</p>
                      )}
                      {evento.detalhes && (
                        <p className='text-sm text-gray-600 mt-1'>{evento.detalhes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensagem quando não há rastreamento ainda */}
          {!tracking && order.trackingCode && (
            <div className='bg-blue-50 border border-blue-200 p-4 rounded-lg text-center'>
              <p className='text-sm text-blue-800'>
                Seu código de rastreamento ainda não foi atualizado na transportadora.
              </p>
              <p className='text-xs text-blue-600 mt-1'>
                Código: {order.trackingCode}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TrackingPublic
