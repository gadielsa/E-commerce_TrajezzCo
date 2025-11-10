import React, { useState, useContext } from 'react'
import {assets} from '../assets/assets'
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const {setShowSearch, getCartCount} = useContext(ShopContext)

  return (
    <div className='flex items-center justify-between py-5 font-medium'>

      <Link to={'/'}><img src={assets.jezz_logo} className='w-36' alt=""/></Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

        <NavLink to='/' className={'flex flex-col items-center gap-1'}>
          <p>PÁGINA INICIAL</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        {/* <NavLink to='/collection' className={'flex flex-col items-center gap-1'}>
          <p>COLEÇÃO</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/about' className={'flex flex-col items-center gap-1'}>
          <p>SOBRE NÓS</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/contact' className={'flex flex-col items-center gap-1'}>
          <p>CONTATO</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink> */}

      </ul>

      <div className='flex items-center gap-6'>
          {/* <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-6 cursor-pointer' alt="" /> */}
          <div className='group relative'>
            <img src={assets.user} className='w-6 cursor-pointer' alt="" />
            <div className='group-hover:block hidden absolute dropdown-menu right-o pt-4'>
                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                  <p className='cursor-pointer hover:text-black'>Perfil</p>
                  <p className='cursor-pointer hover:text-black'>Pedidos</p>
                  <p className='cursor-pointer hover:text-black'>Sair</p>
                </div>
            </div>
          </div>
          <Link to='/cart' className='relative'>
            <img src={assets.shopping_bag} className='w-6 min-w-6' alt="" />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
          </Link>
          <img onClick={() => setIsMenuOpen(true)} src={assets.menu_icon} className='w-6 cursor-pointer sm:hidden' alt="" />
      </div>
      {/* Mobile Menu */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${isMenuOpen ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col gap-5 text-gray-700 p-5'>
          <div onClick={() => setIsMenuOpen(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4' src={assets.back_arrow} alt="" />
            <p>Voltar</p>
          </div>
          <NavLink onClick={() => setIsMenuOpen(false)} className='py-2 pl-6 border' to='/'>PÁGINA INICIAL</NavLink>
          <NavLink onClick={() => setIsMenuOpen(false)} className='py-2 pl-6 border' to='/collection'>COLEÇÃO</NavLink>
          <NavLink onClick={() => setIsMenuOpen(false)} className='py-2 pl-6 border' to='/about'>SOBRE NÓS</NavLink>
          <NavLink onClick={() => setIsMenuOpen(false)} className='py-2 pl-6 border' to='/contact'>CONTATO</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar 
