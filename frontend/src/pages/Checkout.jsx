import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Checkout = () => {
  
  const [method, setMethod] = useState('pix');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');

  const {navigate, cartItems, placeOrder} = useContext(ShopContext);

  const handlePlaceOrder = () => {
    if (!firstName || !lastName || !email || !address || !city || !state || !zipCode || !country || !phone) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    if (Object.keys(cartItems).length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }
    
    const deliveryInfo = {
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      method
    };
    
    placeOrder(deliveryInfo);
    navigate('/orders');
  }
  
  return (
    <div className='flex flex-col lg:flex-row gap-8 pt-10 pb-20 border-t-2'>
      {/* Lado esquerdo - Detalhes do pedido */}
      <div className='w-full lg:w-2/3'>
        <div className='bg-gray-50 p-8 rounded-lg'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Detalhes de Entrega</h2>
            <p className='text-gray-600 text-sm'>Preencha seus dados para receber o pedido</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Nome</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='Seu nome' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Sobrenome</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='Seu sobrenome' />
            </div>
          </div>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="email" placeholder='seu@email.com' />
          </div>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Endereço</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='Rua, número, complemento' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Cidade</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='São Paulo' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Estado</label>
              <input value={state} onChange={(e) => setState(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='SP' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>CEP</label>
              <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='00000-000' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>País</label>
              <input value={country} onChange={(e) => setCountry(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='Brasil' />
            </div>
          </div>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Telefone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="tel" placeholder='(11) 9999-9999' />
          </div>
        </div>

        {/* Método de Pagamento */}
        <div className='bg-gray-50 p-8 rounded-lg mt-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Método de Pagamento</h2>
          <div className='space-y-3'>
            <label className='flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all' style={{borderColor: method === 'pix' ? '#000' : '#ddd'}}>
              <input type="radio" name="payment" value="pix" checked={method === 'pix'} onChange={()=>setMethod('pix')} className='w-4 h-4' />
              <div className='ml-4 flex items-center gap-2'>
                <img className='h-6' src={assets.pix_logo} alt="PIX" />
                <span className='font-medium'>PIX (6% de desconto)</span>
              </div>
            </label>
            <label className='flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all' style={{borderColor: method === 'cc' ? '#000' : '#ddd'}}>
              <input type="radio" name="payment" value="cc" checked={method === 'cc'} onChange={()=>setMethod('cc')} className='w-4 h-4' />
              <div className='ml-4'>
                <span className='font-medium'>Cartão de Crédito</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Lado direito - Resumo do pedido */}
      <div className='w-full lg:w-1/3 h-fit sticky top-20'>
        <div className='bg-gray-50 p-8 rounded-lg'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Resumo do Pedido</h2>
          <CartTotal />
          
          <div className='my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-blue-800'>
              <span className='font-semibold'>💡 Dica:</span> Use o cupom <strong>TRAJEZZ10</strong> para 10% de desconto!
            </p>
          </div>

          <button onClick={handlePlaceOrder} className='w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all mt-6 text-lg'>
            FINALIZAR PEDIDO
          </button>
          
            <button onClick={() => navigate('/em-estoque')} className='w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-500 transition-all mt-3'>
              CONTINUAR COMPRANDO
            </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
