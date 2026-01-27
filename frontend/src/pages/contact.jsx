import React, { useState } from 'react'
import Title from '../components/Title'
import { toast } from 'react-toastify'

const Contact = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className='py-16'>
      {/* Header */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>Entre em Contato</h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>Temos uma equipe pronta para ajudar. Entre em contato conosco e responderemos o mais rápido possível.</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        {/* Informações de Contato */}
        <div className='space-y-8'>
          <div className='bg-gray-50 p-8 rounded-lg'>
            <div className='flex items-start gap-4 mb-8'>
              <div className='text-3xl'>📞</div>
              <div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Telefone</h3>
                <p className='text-gray-600 mb-2'>(11) 9999-9999</p>
                <p className='text-sm text-gray-500'>Seg-Sex: 9h às 18h | Sáb: 10h às 14h</p>
              </div>
            </div>

            <div className='flex items-start gap-4 mb-8'>
              <div className='text-3xl'>✉️</div>
              <div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Email</h3>
                <p className='text-gray-600'>contact@trajezz.com</p>
                <p className='text-sm text-gray-500'>Responderemos em até 24 horas</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='text-3xl'>📍</div>
              <div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Endereço</h3>
                <p className='text-gray-600'>São Paulo, SP - Brasil</p>
                <p className='text-sm text-gray-500'>Atendimento online disponível 24/7</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className='bg-gray-50 p-8 rounded-lg'>
            <h3 className='text-xl font-bold text-gray-900 mb-6'>Redes Sociais</h3>
            <div className='grid grid-cols-2 gap-4'>
              <a href='#' className='flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg hover:border-black hover:text-black transition-all'>
                <span className='text-lg'>f</span>
                <span className='text-sm font-medium'>Facebook</span>
              </a>
              <a href='#' className='flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg hover:border-black hover:text-black transition-all'>
                <span className='text-lg'>📷</span>
                <span className='text-sm font-medium'>Instagram</span>
              </a>
              <a href='#' className='flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg hover:border-black hover:text-black transition-all'>
                <span className='text-lg'>𝕏</span>
                <span className='text-sm font-medium'>Twitter</span>
              </a>
              <a href='#' className='flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg hover:border-black hover:text-black transition-all'>
                <span className='text-lg'>▶️</span>
                <span className='text-sm font-medium'>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Formulário de Contato */}
        <div className='bg-gray-50 p-8 rounded-lg'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Envie uma Mensagem</h2>
          
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                placeholder='Seu nome'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                placeholder='seu@email.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Assunto</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
              >
                <option value="">Selecione um assunto</option>
                <option value="duvida">Dúvida sobre Produto</option>
                <option value="pedido">Informações sobre Pedido</option>
                <option value="devolucao">Devoluções</option>
                <option value="sugestao">Sugestão</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Mensagem</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows="5"
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none'
                placeholder='Sua mensagem aqui...'
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className='w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>

          <p className='text-sm text-gray-500 mt-4 text-center'>
            Responderemos seu email em até 24 horas durante dias úteis.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className='mt-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>Perguntas Frequentes</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
          <div className='bg-gray-50 p-6 rounded-lg'>
            <h3 className='text-lg font-bold text-gray-900 mb-3'>Qual é o tempo de entrega?</h3>
            <p className='text-gray-600 text-sm'>Entregamos em todo Brasil. Entrega padrão: 5-10 dias úteis. Express: 1-2 dias úteis.</p>
          </div>

          <div className='bg-gray-50 p-6 rounded-lg'>
            <h3 className='text-lg font-bold text-gray-900 mb-3'>Como faço devolução?</h3>
            <p className='text-gray-600 text-sm'>Você tem 30 dias para devolver sem motivo. Entre em contato conosco para solicitar o RMA.</p>
          </div>

          <div className='bg-gray-50 p-6 rounded-lg'>
            <h3 className='text-lg font-bold text-gray-900 mb-3'>Os produtos são originais?</h3>
            <p className='text-gray-600 text-sm'>Sim! Todos os produtos são 100% originais e certificados diretamente das marcas.</p>
          </div>

          <div className='bg-gray-50 p-6 rounded-lg'>
            <h3 className='text-lg font-bold text-gray-900 mb-3'>Como rastrear meu pedido?</h3>
            <p className='text-gray-600 text-sm'>Você receberá um código de rastreamento por email logo após o envio.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
