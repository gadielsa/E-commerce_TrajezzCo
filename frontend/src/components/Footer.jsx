import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='bg-gray-900 text-white mt-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Footer Main Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16'>
          {/* Logo e descrição */}
          <div>
            <img src={assets.jezz_logo} className='mb-6 w-32 brightness-0 invert' alt="Trajezz" />
            <p className='text-gray-400 text-sm leading-relaxed mb-4'>
              A Trajezz é sua plataforma de referência para encontrar os melhores tênis e calçados do mercado com preços exclusivos.
            </p>
            <div className='flex gap-4'>
              <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                <i className='fab fa-instagram'></i> Instagram
              </a>
            </div>
          </div>

          {/* Empresa */}
          <div>
            <p className='text-lg font-bold mb-6'>EMPRESA</p>
            <ul className='flex flex-col gap-3 text-gray-400'>
              <li><Link to='/' className='hover:text-white transition-colors'>Página Inicial</Link></li>
              <li><Link to='/about' className='hover:text-white transition-colors'>Sobre Nós</Link></li>
              <li><Link to='/contact' className='hover:text-white transition-colors'>Fale Conosco</Link></li>
              <li><a href='#' className='hover:text-white transition-colors'>Blog</a></li>
              <li><a href='#' className='hover:text-white transition-colors'>Carreiras</a></li>
            </ul>
          </div>

          {/* Informações */}
          <div>
            <p className='text-lg font-bold mb-6'>INFORMAÇÕES</p>
            <ul className='flex flex-col gap-3 text-gray-400'>
              <li><a href='#' className='hover:text-white transition-colors'>Política de Privacidade</a></li>
              <li><a href='#' className='hover:text-white transition-colors'>Termos de Uso</a></li>
              <li><a href='#' className='hover:text-white transition-colors'>Trocas e Devoluções</a></li>
              <li><a href='#' className='hover:text-white transition-colors'>Frete</a></li>
              <li><a href='#' className='hover:text-white transition-colors'>Rastreamento</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <p className='text-lg font-bold mb-6'>CONTATO</p>
            <ul className='flex flex-col gap-3 text-gray-400'>
              <li className='flex items-center gap-2'>
                <span>📞</span>
                <a href='tel:+5511999999999' className='hover:text-white transition-colors'>(11) 99999-9999</a>
              </li>
              <li className='flex items-center gap-2'>
                <span>✉️</span>
                <a href='mailto:contact@trajezz.com' className='hover:text-white transition-colors'>contact@trajezz.com</a>
              </li>
              <li>
                <p className='text-sm mt-4 font-semibold'>Horário de Atendimento</p>
                <p className='text-xs mt-2'>Segunda a Sexta: 9h às 18h</p>
                <p className='text-xs'>Sábado: 10h às 14h</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-gray-800 py-8'>
          {/* Payment Methods */}
          <div className='mb-8'>
            <p className='text-sm font-semibold mb-4'>FORMAS DE PAGAMENTO</p>
            <div className='flex gap-4 flex-wrap text-gray-400 text-xs'>
              <span className='px-3 py-1 border border-gray-700 rounded'>💳 Cartão de Crédito</span>
              <span className='px-3 py-1 border border-gray-700 rounded'>💳 Débito</span>
              <img src={assets.pix_logo} className='h-6' alt="PIX" />
              <span className='px-3 py-1 border border-gray-700 rounded'>Boleto</span>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className='flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 pt-8 border-t border-gray-800'>
            <p>&copy; 2025 Trajezz.com - Todos os direitos reservados.</p>
            <div className='flex gap-6 mt-4 md:mt-0'>
              <a href='#' className='hover:text-white transition-colors'>Política de Privacidade</a>
              <a href='#' className='hover:text-white transition-colors'>Cookies</a>
              <a href='#' className='hover:text-white transition-colors'>Acessibilidade</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
