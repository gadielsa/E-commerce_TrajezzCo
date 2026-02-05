import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContextContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {

  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    console.log('LatestCollection - Produtos recebidos:', products)
    if (products && Array.isArray(products)) {
      console.log('LatestCollection - Total de produtos:', products.length)
      setLatestProducts(products.slice(0, 10))
    } else {
      console.warn('LatestCollection - Produtos inválido ou não array:', products)
      setLatestProducts([])
    }
  }, [products])

  return (
    <div className='my-16 py-12'>
      <div className='text-center mb-12'>
        <div className='text-3xl md:text-4xl mb-4'>
          <Title text1={'ÚLTIMOS'} text2={'LANÇAMENTOS'} />
        </div>
        <p className='w-full md:w-2/3 m-auto text-sm md:text-base text-gray-600 leading-relaxed'>
          Conheça os produtos mais recentes da nossa coleção exclusiva com designs inovadores e qualidade premium.
        </p>
      </div>

      {/* Grid com produtos */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8'>
        {latestProducts.map((item, index) => (
          <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} bestseller={item.bestseller} />
        ))}
      </div>

      {/* CTA Button */}
      <div className='text-center mt-12'>
          <a href='/estoque' className='inline-block bg-black text-white px-12 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105'>
            VER EM ESTOQUE
        </a>
      </div>
    </div>
  )
}

export default LatestCollection
