import React, { useState, useContext, useEffect } from 'react'
import {assets} from '../assets/assets'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()

  const {setShowSearch, getCartCount} = useContext(ShopContext)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('userName')
    setIsLoggedIn(!!token)
    setUserName(name || '')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('userPhone')
    localStorage.removeItem('userAddress')
    localStorage.removeItem('userCity')
    localStorage.removeItem('userZipCode')
    localStorage.removeItem('userCountry')
    setIsLoggedIn(false)
    setUserName('')
    toast.success('Você foi desconectado!')
    navigate('/login')
  }

  return (
    <div>
      {/* Navbar Top */}
      <div className='flex items-center justify-between py-5 font-medium border-b border-gray-200'>

        <Link to={'/'}><img src={assets.jezz_logo} className='w-36' alt=""/></Link>

        <ul className='hidden sm:flex gap-8 text-sm text-gray-700'>

          <NavLink to='/' className={({isActive}) => `pb-1 transition-all ${isActive ? 'text-black font-semibold border-b-2 border-black' : 'hover:text-black'}`}>
            <p>FEED</p>
          </NavLink>
          <NavLink to='/estoque' className={({isActive}) => `pb-1 transition-all ${isActive ? 'text-black font-semibold border-b-2 border-black' : 'hover:text-black'}`}>
            <p>EM ESTOQUE</p>
          </NavLink>
          <NavLink to='/sobre' className={({isActive}) => `pb-1 transition-all ${isActive ? 'text-black font-semibold border-b-2 border-black' : 'hover:text-black'}`}>
            <p>SOBRE</p>
          </NavLink>
          <NavLink to='/contato' className={({isActive}) => `pb-1 transition-all ${isActive ? 'text-black font-semibold border-b-2 border-black' : 'hover:text-black'}`}>
            <p>CONTATO</p>
          </NavLink>

        </ul>

        <div className='flex items-center gap-6 pr-6'>
          <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer hover:scale-110 transition-transform' alt="search" />
          <Link to='/favoritos' className='hidden sm:inline-flex items-center hover:opacity-80'>
            <img src={assets.heart} alt='favoritos' className='w-5 h-5 cursor-pointer hover:scale-110 transition-transform' />
          </Link>
          <Link to='/carrinho' className='relative group'>
            <img src={assets.shopping_bag} className='w-5 cursor-pointer hover:scale-110 transition-transform' alt="cart" />
            {getCartCount() > 0 && <p className='absolute right-[-8px] bottom-[-8px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px] font-bold'>{getCartCount()}</p>}
          </Link>
          
          <div className='relative group hidden sm:block'>
            <img src={assets.user} className='w-5 cursor-pointer hover:scale-110 transition-transform' alt="user" />
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
              <div className='flex flex-col gap-3 w-40 py-4 px-5 bg-white border border-gray-200 shadow-lg rounded'>
                {isLoggedIn ? (
                  <>
                    <p className='text-xs text-gray-500 font-semibold'>Olá, {userName}</p>
                    <Link to='/pedidos' className='cursor-pointer hover:text-black text-gray-600 text-sm'>Meus Pedidos</Link>
                    <Link to='/perfil' className='cursor-pointer hover:text-black text-gray-600 text-sm'>Perfil</Link>
                    <p onClick={handleLogout} className='cursor-pointer hover:text-black text-gray-600 text-sm'>Sair</p>
                  </>
                ) : (
                  <>
                    <Link to='/login' className='cursor-pointer hover:text-black text-gray-600 text-sm font-semibold'>Login</Link>
                    <p className='text-xs text-gray-400'>Faça login para acessar sua conta</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <img onClick={() => setIsMenuOpen(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="menu" />
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 z-40 ${isMenuOpen ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col h-full'>
          <div onClick={() => setIsMenuOpen(false)} className='flex items-center justify-between p-5 border-b'>
            <p className='text-lg font-semibold'>MENU</p>
            <img className='h-4 cursor-pointer' src={assets.cross_icon} alt="close" />
          </div>
          <div className='flex flex-col gap-5 text-gray-700 p-5 flex-1'>
            <NavLink onClick={() => setIsMenuOpen(false)} className='py-2 text-sm font-medium hover:text-black transition-all' to='/'>INÍCIO</NavLink>
            <NavLink onClick={() => setIsMenuOpen(false)} className='py-2 text-sm font-medium hover:text-black transition-all' to='/estoque'>ESTOQUE</NavLink>
            <NavLink onClick={() => setIsMenuOpen(false)} className='py-2 text-sm font-medium hover:text-black transition-all' to='/sobre'>SOBRE</NavLink>
            <NavLink onClick={() => setIsMenuOpen(false)} className='py-2 text-sm font-medium hover:text-black transition-all' to='/contato'>CONTATO</NavLink>
            <NavLink onClick={() => setIsMenuOpen(false)} className='py-2 text-sm font-medium hover:text-black transition-all' to='/pedidos'>MEUS PEDIDOS</NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar 
