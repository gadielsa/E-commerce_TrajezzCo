import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'

const Orders = () => {

  const { products, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(savedOrders);
  }, []);

  return (
    <div className='border-t pt-16'>

      <div className='text-2xl'>
        <Title text1={'MEUS'} text2={'PEDIDOS'}/>
      </div>

      <div>
        {orders.length === 0 ? (
          <p className='text-gray-500 py-8'>Você ainda não possui nenhum pedido.</p>
        ) : (
          orders.map((order, orderIndex) => (
            <div key={orderIndex} className='py-4 border-t border-b'>
              <p className='text-sm text-gray-600 mb-4'>Pedido ID: {order.orderId} | Data: {order.date}</p>
              {Object.keys(order.items).map((itemId, index) => {
                const product = products.find((p) => p._id === itemId);
                if (!product) return null;

                return Object.keys(order.items[itemId]).map((size, sizeIndex) => {
                  const quantity = order.items[itemId][size];
                  if (quantity <= 0) return null;

                  return (
                    <div key={`${itemId}-${size}-${sizeIndex}`} className='py-3 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                      <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20' src={product.image[0]} alt={product.name} />
                        <div>
                          <p className='sm:text-base font-medium'>{product.name}</p>
                          <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                            <p className='text-lg'>{currency}{product.price}</p>
                            <p>Quantidade: {quantity}</p>
                            <p>Tamanho: {size}</p>
                          </div>
                        </div>
                      </div>
                      <div className='md:w-1/2 flex justify-between'>
                        <div className='flex items-center gap-2'>
                          <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                          <p className='text-sm md:text-base'>{order.status}</p>
                        </div>
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
