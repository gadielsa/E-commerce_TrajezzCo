import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import orderService from '../services/orderService'

const ConfirmarPagamento = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState(null)

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Recupera informações da intenção de pagamento
        const paymentIntentData = sessionStorage.getItem('paymentIntent')
        if (!paymentIntentData) {
          throw new Error('Dados de pagamento não encontrados')
        }

        // Busca dados do pedido
        const orderData = await orderService.getOrderById(orderId)
        setOrder(orderData)

        // TODO: Em produção, integrar com Stripe real via confirmCardPayment
        // Por enquanto simula aprovação automática em desenvolvimento
        if (import.meta.env.DEV) {
          // Simula sucesso após 2 segundos
          setTimeout(async () => {
            try {
              // Atualiza pedido com status de pagamento confirmado
              await orderService.updateOrderPayment(
                orderId,
                {
                  transactionId: `sim_${Date.now()}`,
                  cardBrand: 'Visa',
                  lastDigits: '4242',
                  installments: 1
                },
                'paid',
                'Pagamento aprovado'
              )
              
              setPaymentStatus('success')
              toast.success('Pagamento confirmado com sucesso!')
              
              // Limpa sessionStorage
              sessionStorage.removeItem('paymentIntent')
              
              // Redireciona para pedidos após 3 segundos
              setTimeout(() => {
                navigate('/pedidos')
              }, 3000)
            } catch (error) {
              setPaymentStatus('error')
              toast.error('Erro ao confirmar pagamento: ' + error.message)
            }
          }, 2000)
        }
      } catch (error) {
        setPaymentStatus('error')
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    processPayment()
  }, [orderId, navigate])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black'></div>
          <p className='mt-4 text-lg text-gray-600'>Processando pagamento...</p>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'error') {
    return (
      <div className='flex items-center justify-center min-h-screen px-4'>
        <div className='text-center max-w-md'>
          <div className='text-6xl mb-4'>❌</div>
          <h1 className='text-2xl font-bold text-red-600 mb-2'>Erro na confirmação</h1>
          <p className='text-gray-600 mb-6'>Houve um problema ao processar seu pagamento.</p>
          <div className='space-y-2'>
            <button
              onClick={() => navigate(`/checkout`)}
              className='w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all'
            >
              VOLTAR AO CHECKOUT
            </button>
            <button
              onClick={() => navigate('/pedidos')}
              className='w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-500 transition-all'
            >
              VER MEUS PEDIDOS
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'success') {
    return (
      <div className='flex items-center justify-center min-h-screen px-4'>
        <div className='text-center max-w-md'>
          <div className='text-6xl mb-4'>✅</div>
          <h1 className='text-2xl font-bold text-green-600 mb-2'>Pagamento confirmado!</h1>
          <p className='text-gray-600 mb-2'>Seu pedido foi criado com sucesso.</p>
          <p className='text-gray-600 text-sm mb-6'>
            Número do pedido: <span className='font-bold'>{order?.orderNumber}</span>
          </p>
          
          <div className='bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6'>
            <p className='text-sm text-green-800'>
              📧 Você receberá atualizações sobre seu pedido por email
            </p>
          </div>

          <p className='text-gray-600 text-sm mb-4'>Redirecionando para seus pedidos...</p>
          
          <button
            onClick={() => navigate('/pedidos')}
            className='w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all'
          >
            VER MEU PEDIDO
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default ConfirmarPagamento
