import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border-b-2 border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-white'>
      {/* Hero - Lado esquerdo */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-20 sm:py-0 px-5 sm:px-0'>
        <div className='text-center sm:text-left'>
          <div className='flex items-center gap-3 justify-center sm:justify-start mb-4'>
            <p className='w-8 md:w-12 h-[2px] bg-gray-800'></p>
            <p className='font-semibold text-sm md:text-base text-gray-700 uppercase tracking-wider'>NOVA COLEÇÃO</p>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6'>
            LANÇAMENTOS<br/>DA SEASON
          </h1>
          <p className='text-gray-600 text-base md:text-lg mb-8 max-w-md'>
            Descubra os modelos mais esperados do ano com tecnologia de ponta e design exclusivo.
          </p>
                <Link to='/em-estoque' className='inline-block bg-black text-white px-8 py-3 rounded text-sm font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105'>
            EXPLORAR AGORA
          </Link>
        </div>
      </div>
      {/* Hero - Lado direito */}
      <div className='w-full sm:w-1/2 relative'>
        <img className='w-full h-full object-cover' src={assets.sneaker_example} alt="Nova coleção" />
        <div className='absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-20'></div>
      </div>
    </div>
  )
}

export default Hero
