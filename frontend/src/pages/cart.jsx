import React, { useEffect } from 'react'
import Title from '../components/Title'
import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContextContext'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, calculateShipping, shippingCep, applyCoupon, removeCoupon, couponCode } = useContext(ShopContext)

  const [cartData, setCartData] = useState([])
  const [cep, setCep] = useState('')
  const [couponInput, setCouponInput] = useState('')

  useEffect(() => {

    const tempData = []
    for(const items in cartItems){
      for(const item in cartItems[items]){
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })
        }
      }  
    }
    setCartData(tempData)
  },[cartItems])

  useEffect(() => {
    setCouponInput(couponCode || '')
  }, [couponCode])

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length <= 8) {
      if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5)
      }
      setCep(value)
    }
  }

  const handleCalculateShipping = () => {
    if (cep.replace(/\D/g, '').length === 8) {
      calculateShipping(cep)
    }
  }

  return (
    <div className='border-t pt-14'>

      <div className='text-2xl mb-3'>
        <Title text1={'SUA'} text2={'SACOLA'} />
      </div>

      {cartData.length === 0 ? (
        <div className='text-center py-20 text-gray-600'>Nenhum produto na sacola</div>
      ) : (
        <>
          <div>
            {
              cartData.map((item, index)=>{
            
            const productData = products.find((product)=> product._id === item._id)

            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr} items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <div className='relative overflow-hidden bg-gray-100 rounded-lg w-16 h-16 sm:w-20 sm:h-20'>
                    <img className='w-full h-full object-cover' src={productData.image[0]} alt="" />
                  </div>
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex flex-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='inline-block text-sm px-3 py-1 border border-gray-300 rounded-md bg-slate-50 text-gray-700'>{item.size}</p>
                    </div>
                  </div>
                </div>
                <input
                  onChange={(e)=>e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                  className='w-20 sm:w-24 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black'
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
                <img onClick={()=>updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
              </div>
            )

          })
        }
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal/>
          
          {/* Cálculo de Frete */}
          <div className='mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 mt-6'>
            <h3 className='font-semibold text-gray-800 mb-3'>Calcular Frete</h3>
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='00000-000'
                value={cep}
                onChange={handleCepChange}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black'
                maxLength={9}
              />
              <button
                onClick={handleCalculateShipping}
                className='bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors'
              >
                Calcular
              </button>
            </div>
            {shippingCep && (
              <p className='text-xs text-gray-600 mt-2'>
                Frete calculado para o CEP: {shippingCep}
              </p>
            )}
          </div>

          <div className='mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
            <h3 className='font-semibold text-gray-800 mb-3'>Cupom de Desconto</h3>
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Digite o cupom'
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black'
              />
              {couponCode ? (
                <button
                  onClick={removeCoupon}
                  className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors'
                >
                  Remover
                </button>
              ) : (
                <button
                  onClick={() => applyCoupon(couponInput)}
                  className='bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors'
                >
                  Aplicar
                </button>
              )}
            </div>
            {couponCode && (
              <p className='text-xs text-green-700 mt-2'>Cupom aplicado: {couponCode}</p>
            )}
          </div>

          <div className='w-full text-end'>
            <button onClick={()=>navigate('/checkout')} className='bg-black text-white text-sm my-8 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors'>Comprar</button>
          </div>
        </div>
      </div>
        </>
      )}
      
    </div>
  )
}

export default Cart
