import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
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
    // Para tênis, mostrar numéricos de 35 a 43
    if (data.category === 'Sneaker') {
      return Array.from({ length: 43 - 35 + 1 }, (_, i) => 35 + i)
    }
    // Caso contrário, usar os tamanhos já definidos no produto (P/M/G...) 
    return data.sizes || []
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
              <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
            ))
          }
        </div>
        <div className='w-full sm:w-[80%]'>
          <img className='w-full h-auto' src={image} alt="" />
        </div>
      </div>

      {/* Infos do produto */}
      <div className='flex-1'>
        <h1 className='font-bold text-2xl md:text-3xl mt-2 text-gray-900'>{productData.name}</h1>
        <div className='flex items-center gap-2 mt-2'>
          <div className='flex text-sm'>
            <span className='text-yellow-400'>★★★★★</span>
            <span className='text-gray-400'>(128 avaliações)</span>
          </div>
        </div>
        <p className='mt-3 text-lg md:text-xl font-bold text-gray-900'>{currency}{productData.price}</p>
        <div className='flex gap-2 mt-2 text-xs'>
          <span className='px-2 py-1 bg-green-100 text-green-800 rounded'>Em Estoque</span>
          <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded'>Frete Grátis</span>
        </div>
        <p className='mt-5 text-gray-700 leading-relaxed md:w-4/5'>{productData.description}</p>
        
        <div className='flex flex-col gap-4 my-8'>
          <p className='font-semibold text-gray-900'>Selecione o Tamanho</p>
          <div className='flex gap-2'>
            {getSizeOptions(productData).map((item, index) => (
              <button
                onClick={() => setSize(item)}
                className={`border-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${item == size ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}`}
                key={index}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        
        <div className='flex gap-3 mb-8'>
          <button onClick={()=>addToCart(productData._id, size)} className='flex-1 bg-black text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95'>Adicionar à Sacola</button>
          <button
            onClick={() => toggleFavorite(productData._id)}
            className={`flex items-center justify-center w-12 h-12 rounded transition-all border border-gray-300 bg-white hover:border-black`}
            aria-label='Adicionar aos Favoritos'
          >
            <div className={`${isFavorite(productData._id) ? 'bg-red-200' : 'bg-white'} w-8 h-8 rounded-full flex items-center justify-center`}>
              <img src={assets.heart} alt='heart' className='w-4 h-4' />
            </div>
          </button>
        </div>

        <hr className='my-8 md:w-4/5' />
        
        <div className='text-sm space-y-3 text-gray-600 md:w-4/5'>
          <div className='flex items-start gap-3'>
            <span className='text-lg'>✓</span>
            <p><strong>6% de desconto</strong> com pagamento via Pix</p>
          </div>
          <div className='flex items-start gap-3'>
            <span className='text-lg'>✓</span>
            <p>Use o cupom <strong>TRAJEZZ10</strong> e ganhe 10% de desconto na primeira compra</p>
          </div>
          <div className='flex items-start gap-3'>
            <span className='text-lg'>✓</span>
            <p><strong>Frete grátis</strong> para compras acima de R$ 500</p>
          </div>
          <div className='flex items-start gap-3'>
            <span className='text-lg'>✓</span>
            <p>Devolução em até 30 dias se não gostar</p>
          </div>
        </div>
      </div>
    </div>

    {/* Sessão de produtos relacionados */}

    <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
