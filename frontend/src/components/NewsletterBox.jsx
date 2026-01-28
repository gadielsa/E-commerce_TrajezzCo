import React, { useState } from 'react'
import { toast } from 'react-toastify'

const NewsletterBox = () => {

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = (event) => {
    event.preventDefault()
    setLoading(true)

    // Simular envio
    setTimeout(() => {
      toast.success('Inscrição realizada! Verifique seu email.')
      setEmail('')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className='bg-gradient-to-r from-gray-800 to-black text-white py-16 px-8 rounded-lg my-16'>
      <div className='text-center max-w-2xl mx-auto'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>Receba Ofertas Exclusivas</h2>
        <p className='text-gray-300 text-lg mb-8'>
          Inscreva-se em nossa newsletter e ganhe <strong>20% de desconto</strong> no seu primeiro pedido. Além disso, fique por dentro dos lançamentos e promoções especiais.
        </p>
        
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row gap-3 mt-8 max-w-lg mx-auto'>
          <input 
            className='flex-1 px-4 py-3 rounded-lg text-white outline-none placeholder-gray-500 focus:ring-2 focus:ring-yellow-500' 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Seu melhor email' 
            required
          />
          <button 
            type='submit' 
            disabled={loading}
            className='bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition-all disabled:opacity-50'
          >
            {loading ? 'Enviando...' : 'Inscrever'}
          </button>
        </form>

        <p className='text-gray-400 text-xs mt-6'>
          Não compartilhamos seu email. Você pode desinscrever-se a qualquer momento.
        </p>
      </div>
    </div>
  )
}

export default NewsletterBox
