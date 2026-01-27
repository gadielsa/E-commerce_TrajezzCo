import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='py-16'>
      {/* Hero Section */}
      <div className='mb-16'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>Sobre Trajezz</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>Somos apaixonados por sneakers e dedicados em trazer os melhores modelos do mundo para você.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div>
            <img src={assets.sneaker_example} className='w-full rounded-lg' alt="Sneaker" />
          </div>
          <div className='space-y-6'>
            <h2 className='text-3xl font-bold text-gray-900'>Nossa Missão</h2>
            <p className='text-gray-600 leading-relaxed'>
              A Trajezz nasceu com uma missão simples mas poderosa: democratizar o acesso aos melhores sneakers do mundo. Acreditamos que todo entusiasta merece ter acesso a produtos autênticos, com qualidade premium e ao melhor preço.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              Desde nossa fundação, trabalhamos para estabelecer parcerias diretas com as maiores marcas e fabricantes, eliminando intermediários e oferecendo os melhores preços para nossos clientes.
            </p>
          </div>
        </div>
      </div>

      {/* Valores Section */}
      <div className='my-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>Nossos Valores</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='p-8 bg-gray-50 rounded-lg text-center'>
            <div className='text-4xl mb-4'>🎯</div>
            <h3 className='text-xl font-bold text-gray-900 mb-3'>Qualidade</h3>
            <p className='text-gray-600'>Apenas produtos autênticos e de qualidade premium</p>
          </div>
          <div className='p-8 bg-gray-50 rounded-lg text-center'>
            <div className='text-4xl mb-4'>💪</div>
            <h3 className='text-xl font-bold text-gray-900 mb-3'>Confiança</h3>
            <p className='text-gray-600'>Transparência total com nossos clientes em tudo o que fazemos</p>
          </div>
          <div className='p-8 bg-gray-50 rounded-lg text-center'>
            <div className='text-4xl mb-4'>🚀</div>
            <h3 className='text-xl font-bold text-gray-900 mb-3'>Inovação</h3>
            <p className='text-gray-600'>Sempre trazendo as últimas tendências e lançamentos</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='my-20 bg-black text-white py-16 px-8 rounded-lg'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          <div>
            <div className='text-4xl font-bold mb-2'>50K+</div>
            <p className='text-gray-400'>Clientes Satisfeitos</p>
          </div>
          <div>
            <div className='text-4xl font-bold mb-2'>1K+</div>
            <p className='text-gray-400'>Produtos</p>
          </div>
          <div>
            <div className='text-4xl font-bold mb-2'>100+</div>
            <p className='text-gray-400'>Marcas</p>
          </div>
          <div>
            <div className='text-4xl font-bold mb-2'>5★</div>
            <p className='text-gray-400'>Avaliação Média</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className='my-20'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>Nosso Time</h2>
          <p className='text-gray-600 mt-4 max-w-2xl mx-auto'>Uma equipe apaixonada por sneakers, dedicada a oferecer a melhor experiência de compra.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='text-center'>
              <div className='bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4'></div>
              <h3 className='text-xl font-bold text-gray-900'>Team Member</h3>
              <p className='text-gray-600 text-sm'>Especialista em Sneakers</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
