import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

const SearchBar = () => {

  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowSearch(false)
      setIsClosing(false)
    }, 300)
  }

  return showSearch ? (
    <div className={`bg-white border-b border-gray-200 ${isClosing ? 'animate-out slide-out-to-top duration-300' : 'animate-in slide-in-from-top duration-300'}`}>
      <div className='flex items-center justify-center gap-4 px-4 py-4 sm:py-6'>
        <div className='w-full max-w-4xl flex items-center gap-3 border border-gray-300 px-4 py-3 sm:py-4 rounded-xl shadow-md bg-white focus-within:ring-2 focus-within:ring-black focus-within:shadow-lg focus-within:border-gray-400 transition-all duration-300 hover:shadow-lg'>
          <img className='w-5 text-gray-500 opacity-70 cursor-pointer hover:scale-120 hover:opacity-100 transition-all duration-200' src={assets.search_icon} alt="search" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className='flex-1 outline-none text-base bg-transparent placeholder-gray-400 text-gray-800 font-medium' 
            type="text" 
            placeholder='Procurar por produtos, marcas...'
            autoFocus
          />
          <button onClick={() => setSearch('')} className='text-gray-400 hover:text-red-500 transition-colors duration-200 px-2 font-medium'>
            Limpar
          </button>
        </div>
        <button 
          onClick={handleClose} 
          className='text-gray-500 hover:text-black transition-colors duration-200 p-2 hover:scale-110'
          aria-label='Fechar pesquisa'
        >
          <img className='w-5' src={assets.cross_icon} alt="fechar" />
        </button>
      </div>
    </div>
  ) : null
}

export default SearchBar
