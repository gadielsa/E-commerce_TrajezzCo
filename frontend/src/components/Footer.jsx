import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
          <img src={assets.jezz_logo} className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a auctor diam, non rhoncus neque.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a auctor diam, non rhoncus neque.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a auctor diam, non rhoncus neque.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a auctor diam, non rhoncus neque.
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>EMPRESA</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Página Inicial</li>
            <li>Sobre nós</li>
            <li>Entregas</li>
            <li>Política de privacidade</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>ENTRE EM CONTATO</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>(00)12345-6789</li>
            <li>contact@jezzimports.com</li>
          </ul>
        </div>
      </div>

        <div>
          <hr />
          <p className='py-5 text-sm text-center'>Copyright 2024@ jezzimports.com - Todos os direitos reservados.</p>
        </div>

    </div>
  )
}

export default Footer
