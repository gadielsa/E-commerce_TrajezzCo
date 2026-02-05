import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContextContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {

  const { products } = useContext(ShopContext)
  const [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    console.log('BestSeller - Produtos recebidos:', products)
    if (products && Array.isArray(products)) {
      const bestProduct = products.filter((item) => (item.bestseller))
      console.log('BestSeller - Produtos bestseller:', bestProduct)
      setBestSeller(bestProduct.slice(0, 5))
    } else {
      console.warn('BestSeller - Produtos inválido ou não array:', products)
      setBestSeller([])
    }
  }, [products])

  return (
    <div className='my-16 py-12 bg-white rounded-lg'>
      <div className='text-center mb-12'>
        <div className='text-3xl md:text-4xl mb-4'>
          <Title text1={'PRODUTOS'} text2={'MAIS VENDIDOS'} />
        </div>
        <p className='w-full md:w-2/3 m-auto text-sm md:text-base text-gray-600 leading-relaxed'>
          Confira os favoritos dos nossos clientes - produtos com excelentes avaliações e alta satisfação.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8'>
        {bestSeller.map((item, index) => (
          <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} bestseller={item.bestseller} />
        ))}
      </div>

      {bestSeller.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>Nenhum produto bestseller disponível no momento.</p>
        </div>
      )}
    </div>
  )
}

export default BestSeller
