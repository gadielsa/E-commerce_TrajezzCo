import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContextContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const ProductItem = ({id, image, name, price, bestseller}) => {

  const {currency, toggleFavorite, isFavorite} = useContext(ShopContext)

  return (
    <Link className='text-gray-700 cursor-pointer group relative' to={`/product/${id}`}>
      <div className='relative overflow-hidden bg-gray-100 rounded-lg'>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(id); }}
          className={`absolute top-3 left-3 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all border border-gray-200 bg-white hover:border-black`}
          aria-label='Favoritar produto'
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isFavorite(id) ? 'bg-red-200' : 'bg-white'}`}>
            <img src={assets.heart} alt="heart" className='w-4 h-4' />
          </div>
        </button>
        <img
          className='w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'
          src={(image && image[0]) ? image[0] : assets.jezz_image}
          alt={name}
          onError={(e) => { e.target.onerror = null; e.target.src = assets.jezz_image }}
          style={{ backgroundColor: '#fff' }}
        />
        {bestseller && (
          <div className='absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded font-semibold'>EM ALTA</div>
        )}
        <div className='absolute inset-0 bg-transparent group-hover:bg-black/10 transition-all duration-300 pointer-events-none'></div>
      </div>
      <div className='mt-4'>
        <p className='text-sm text-gray-600 font-medium'>{name}</p>
        <p className='text-lg font-bold text-black mt-1'>{currency}{price.toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default ProductItem
