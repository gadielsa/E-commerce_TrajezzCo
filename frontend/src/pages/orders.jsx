import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { toast } from 'react-toastify'
import API_URL from '../config/api'

const Orders = () => {

  const { products, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Você precisa estar logado para ver seus pedidos');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar pedidos');
        }

        const data = await response.json();
        setOrders(data.orders || data.data || []);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        // Fallback para localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        setOrders(savedOrders);
        if (savedOrders.length === 0) {
          toast.error('Erro ao carregar pedidos');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTrackOrder = (orderId) => {
    toast.info(`Rastreamento do pedido ${orderId} será implementado em breve!`);
  };

  if (loading) {
    return <div className='border-t pt-16 text-center'>Carregando pedidos...</div>;
  }

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
              <div className='flex justify-between items-center mb-4'>
                <p className='text-sm text-gray-600'>Pedido ID: {order._id || order.orderId} | Data: {new Date(order.createdAt || order.date).toLocaleDateString('pt-BR')}</p>
                <button 
                  onClick={() => handleTrackOrder(order._id || order.orderId)}
                  className='text-sm px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition'
                >
                  Rastrear Pedido
                </button>
              </div>
              {order.items && order.items.map((item, index) => {
                const product = products.find((p) => p._id === item.product);
                if (!product) return null;

                return (
                  <div key={index} className='py-3 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex items-start gap-6 text-sm'>
                      <img className='w-16 sm:w-20' src={item.image} alt={item.name} />
                      <div>
                        <p className='sm:text-base font-medium'>{item.name}</p>
                        <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                          <p className='text-lg'>{currency}{item.price}</p>
                          <p>Quantidade: {item.quantity}</p>
                          <p>Tamanho: {item.size}</p>
                        </div>
                      </div>
                    </div>
                    <div className='md:w-1/2 flex justify-between'>
                      <div className='flex items-center gap-2'>
                        <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                        <p className='text-sm md:text-base'>{order.status || 'Processando'}</p>
                      </div>
                    </div>
                  </div>
                );
      </div>
    </div>
  )
}

export default Orders
