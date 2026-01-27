import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 py-16 mt-12 bg-gray-50 rounded-lg p-8'>
      
      <div className='flex flex-col items-center text-center group'>
        <div className='bg-white p-4 rounded-full mb-6 group-hover:bg-black group-hover:scale-110 transition-all duration-300 shadow-lg'>
          <img src={assets.exchange_icon} className='w-8 h-8 group-hover:brightness-200' alt="Devolução" />
        </div>
        <p className='font-bold text-lg text-gray-900 mb-2'>Devolução Fácil</p>
        <p className='text-gray-600 text-sm'>Devolva seu produto em até 30 dias sem perguntas</p>
      </div>

      <div className='flex flex-col items-center text-center group'>
        <div className='bg-white p-4 rounded-full mb-6 group-hover:bg-black group-hover:scale-110 transition-all duration-300 shadow-lg'>
          <img src={assets.circle_check_icon} className='w-8 h-8 group-hover:brightness-200' alt="Garantia" />
        </div>
        <p className='font-bold text-lg text-gray-900 mb-2'>Garantia Completa</p>
        <p className='text-gray-600 text-sm'>Produto com defeito? Devolvemos seu dinheiro na hora</p>
      </div>

      <div className='flex flex-col items-center text-center group'>
        <div className='bg-white p-4 rounded-full mb-6 group-hover:bg-black group-hover:scale-110 transition-all duration-300 shadow-lg'>
          <img src={assets.headset_icon} className='w-8 h-8 group-hover:brightness-200' alt="Suporte" />
        </div>
        <p className='font-bold text-lg text-gray-900 mb-2'>Suporte 24/7</p>
        <p className='text-gray-600 text-sm'>Nosso time está sempre pronto para te ajudar</p>
      </div>

    </div>
  )
}

export default OurPolicy
