import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const ProductItem = ({id, image, name, price, bestseller}) => {

  const {currency} = useContext(ShopContext)

  return (
    <Link className='text-gray-700 cursor-pointer group' to={`/product/${id}`}>
      <div className='relative overflow-hidden bg-gray-100 rounded-lg'>
        <img
          className='w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'
          src={(image && image[0]) ? image[0] : assets.sneaker_example}
          alt={name}
          onError={(e) => { e.target.onerror = null; e.target.src = assets.sneaker_example }}
          style={{ backgroundColor: '#fff' }}
        />
        {bestseller && (
          <div className='absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded font-semibold'>BESTSELLER</div>
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
