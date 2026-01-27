import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

const SearchBar = () => {

  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)

  return showSearch ? (
    <div className='bg-white border-b-2 border-gray-200 py-6'>
      <div className='flex items-center justify-center gap-4 px-4'>
        <div className='w-full max-w-2xl flex items-center gap-3 border-2 border-gray-300 px-4 py-3 rounded-lg focus-within:border-black transition-colors'>
          <img className='w-5 text-gray-400' src={assets.search_icon} alt="search" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className='flex-1 outline-none text-base bg-transparent' 
            type="text" 
            placeholder='Procurar por produtos, marcas...'
            autoFocus
          />
        </div>
        <button 
          onClick={() => setShowSearch(false)} 
          className='text-gray-500 hover:text-black transition-colors p-2'
        >
          <img className='w-5' src={assets.cross_icon} alt="fechar" />
        </button>
      </div>
    </div>
  ) : null
}

export default SearchBar
