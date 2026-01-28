import React, { useContext } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {

  const { currency, shippingCost, getCartAmount } = useContext(ShopContext)

  const subtotal = getCartAmount()
  const total = subtotal === 0 ? 0 : subtotal + shippingCost
  const discountPix = (total * 0.06).toFixed(2)
  const totalWithDiscount = (total - discountPix).toFixed(2)

  return (
    <div className='w-full'>
      <div className='mb-6'>
        <h3 className='text-2xl font-bold text-gray-900'>Resumo do Carrinho</h3>
      </div>

      <div className='space-y-4'>
        <div className='flex justify-between items-center text-gray-600'>
          <p>Subtotal</p>
          <p className='font-semibold'>{currency}{subtotal.toFixed(2)}</p>
        </div>
        
        <div className='h-px bg-gray-200'></div>

        {subtotal > 0 && (
          <>
            <div className='flex justify-between items-center text-gray-600'>
              <div className='flex items-center gap-2'>
                <p>Frete</p>
                {subtotal >= 500 ? (
                  <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded'>Grátis</span>
                ) : (
                  <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>Grátis acima de R$500</span>
                )}
              </div>
              <p className='font-semibold'>{currency}{shippingCost.toFixed(2)}</p>
            </div>

            <div className='h-px bg-gray-200'></div>
          </>
        )}

        <div className='bg-blue-50 border border-blue-200 p-3 rounded-lg'>
          <div className='flex justify-between items-center text-sm text-blue-800 mb-1'>
            <p>Economize com PIX</p>
            <p className='font-bold text-green-600'>-{currency}{discountPix}</p>
          </div>
          <p className='text-xs text-blue-600'>Aproveite 6% de desconto pagando via PIX</p>
        </div>

        <div className='h-px bg-gray-300'></div>

        <div className='flex justify-between items-center pt-2'>
          <p className='text-xl font-bold text-gray-900'>Total</p>
          <div className='text-right'>
            <p className='text-2xl font-bold text-gray-900'>{currency}{total.toFixed(2)}</p>
            <p className='text-xs text-green-600'>Com PIX: {currency}{totalWithDiscount}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
