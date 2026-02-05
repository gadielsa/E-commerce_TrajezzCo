import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContextContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Favorites = () => {
  const { getFavorites } = useContext(ShopContext)
  const favorites = getFavorites()

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'MEUS'} text2={'FAVORITOS'} />
      </div>

      {favorites.length === 0 ? (
        <div className='text-center py-20 text-gray-600'>Nenhum produto nos favoritos</div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {favorites.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} bestseller={item.bestseller} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
