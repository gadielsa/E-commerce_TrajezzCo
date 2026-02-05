import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContextContext'
import RelatedProducts from '../components/RelatedProducts'
import { assets } from '../assets/assets'

const Product = () => {

  const {productId} = useParams()
  const {products, currency, addToCart, toggleFavorite, isFavorite} = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  const getSizeOptions = (data) => {
    if (!data) return []

    const isShoes = data.sizeType === 'shoes'
    const allSizes = isShoes
      ? Array.from({ length: 43 - 35 + 1 }, (_, i) => (35 + i).toString())
      : ['P', 'M', 'G', 'GG', 'XG']

    const availableSizes = Array.isArray(data.sizes) ? data.sizes.map(String) : []

    return allSizes.map((value) => ({
      value,
      available: availableSizes.includes(String(value))
    }))
  }

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null
      }
    })
  }

  useEffect(() => {
    fetchProductData()
  }, [productId, products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>

      {/* Dados do produto */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

      {/* Imagens do produto */}
      <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
        <div className='flex sm:flex-col overflow-x-auto-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
          {
            productData.image.map((item,index)=>(
              <div key={index} className='group relative overflow-hidden bg-gray-100 rounded-lg w-[24%] sm:w-full sm:mb-3 flex-shrink-0'>
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  className='w-full h-full cursor-pointer object-cover aspect-square group-hover:scale-105 transition-transform duration-300 ease-in-out'
                  alt=""
                />
              </div>
            ))
          }
        </div>
        <div className='w-full sm:w-[80%]'>
          <div className='relative overflow-hidden bg-gray-100 rounded-lg'>
            <img className='w-full h-96 sm:h-[520px] object-cover' src={image} alt="" />
          </div>
        </div>
      </div>

      {/* Infos do produto */}
      <div className='flex-1'>
        <h1 className='font-bold text-2xl md:text-3xl mt-2 text-gray-900'>{productData.name}</h1>
        <p className='mt-3 text-lg md:text-xl font-bold text-gray-900'>{currency}{productData.price}</p>
        <div className='flex gap-2 mt-2 text-xs'>
          {productData.isAvailable !== false ? (
            <span className='px-2 py-1 bg-green-100 text-green-800 rounded'>Em Estoque</span>
          ) : (
            <span className='px-2 py-1 bg-red-100 text-red-800 rounded'>Indisponível</span>
          )}
          {productData.price >= 500 && (
            <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded'>Frete Grátis</span>
          )}
        </div>
        <p className='mt-5 text-gray-700 leading-relaxed md:w-4/5'>{productData.description}</p>
        
        <div className='flex flex-col gap-4 my-8'>
          <p className='font-semibold text-gray-900'>Selecione o Tamanho</p>
          <div className='flex gap-2'>
            {getSizeOptions(productData).map((item, index) => (
              <button
                onClick={() => item.available && setSize(item.value)}
                disabled={!item.available}
                className={`border-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${item.value == size ? 'bg-black text-white border-black' : 'border-gray-300'} ${item.available ? 'hover:border-black' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                key={index}
              >
                {item.value}
              </button>
            ))}
          </div>
        </div>
        
        <div className='flex flex-col sm:flex-row gap-3 mb-8 items-stretch'>
          <button
            onClick={()=>addToCart(productData._id, size)}
            disabled={productData.isAvailable === false}
            className={`flex-1 px-8 py-3 rounded-lg text-sm font-semibold transition-all active:scale-95 ${productData.isAvailable === false ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            {productData.isAvailable === false ? 'Indisponível' : 'Adicionar à Sacola'}
          </button>
          <button
            onClick={() => toggleFavorite(productData._id)}
            className='flex items-center justify-center w-full sm:w-12 h-12 rounded-lg border border-gray-300 hover:border-black transition-all'
            aria-label={isFavorite(productData._id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isFavorite(productData._id) ? 'bg-red-200' : 'bg-white'}`}>
              <img src={assets.heart} alt="favorito" className='w-4 h-4' />
            </div>
          </button>
        </div>

        <hr className='my-8 md:w-4/5' />
        
        <ul className='text-sm space-y-3 text-gray-600 md:w-4/5 list-disc pl-5'>
          <li><strong>6% de desconto</strong> com pagamento via Pix</li>
          <li>Use o cupom <strong>TRAJEZZ10</strong> e ganhe 10% de desconto na primeira compra</li>
          <li><strong>Frete grátis</strong> para compras acima de R$ 500</li>
          <li>Devolução em até 30 dias se não gostar</li>
        </ul>
      </div>
    </div>

    {/* Sessão de produtos relacionados */}

    <RelatedProducts category={productData.category} />

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
