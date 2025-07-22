import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      
      <div>
        <img src={assets.exchange_icon} className='m-auto mb-5' alt="" />
        <p className='font-semibold'>Política de Devolução Fácil</p>
        <p className='text-gray-400'>Nós oferecemos devolução gratuita</p>
      </div>
      <div>
        <img src={assets.circle_check_icon} className='m-auto mb-5' alt="" />
        <p className='font-semibold'>Política de Retorno Dentro de Sete Dias</p>
        <p className='text-gray-400'>Nós devolvemos seu dinheiro</p>
      </div>
      <div>
        <img src={assets.headset_icon} className='m-auto mb-5' alt="" />
        <p className='font-semibold'>Melhor Suporte ao Cliente</p>
        <p className='text-gray-400'>Nós fornecemos suporte ao cliente 24 horas</p>
      </div>
    </div>
  )
}

export default OurPolicy
