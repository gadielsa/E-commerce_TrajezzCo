import React, { useContext, useState, useEffect, useMemo } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContextContext'
import { toast } from 'react-toastify'
import paymentService from '../services/paymentService'
import orderService from '../services/orderService'
import { authService } from '../services/authService'

const Checkout = () => {
  
  const [method, setMethod] = useState('pix');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  
  // Estados para pagamento com cartão
  const [cardName, setCardName] = useState('');
  const [installments, setInstallments] = useState(1);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  const {navigate, cartItems, placeOrder, shippingCep, shippingCity, shippingState, shippingAddress, 
    generatePixPayment, calculateInstallments, getCartAmount, getEffectiveShippingCost} = useContext(ShopContext);

  // Calcula opções de parcelamento
  const installmentOptions = useMemo(() => {
    const subtotal = getCartAmount();
    const effectiveShipping = getEffectiveShippingCost(subtotal);
    const totalAmount = subtotal + effectiveShipping;
    if (!totalAmount || totalAmount <= 0) {
      return [{ number: 1, label: 'À vista', value: 0, total: 0, interest: false }];
    }
    return calculateInstallments(totalAmount);
  }, [getCartAmount, getEffectiveShippingCost, calculateInstallments]);

  // Preenche os dados automaticamente quando vem do carrinho
  useEffect(() => {
    if (shippingCep) {
      setZipCode(shippingCep);
    }
    if (shippingCity) {
      setCity(shippingCity);
    }
    if (shippingState) {
      setState(shippingState);
    }
    if (shippingAddress) {
      setAddress(shippingAddress);
    }
  }, [shippingCep, shippingCity, shippingState, shippingAddress]);

  // Preenche dados do perfil do usuário
  useEffect(() => {
    const fillFromProfile = async () => {
      try {
        if (!authService.isAuthenticated()) {
          return;
        }

        const data = await authService.getProfile();
        const userData = data.user || data.data || {};
        const name = userData.name || '';
        const [first = '', ...rest] = name.split(' ');
        const last = rest.join(' ');

        setFirstName(prev => prev || first);
        setLastName(prev => prev || last);
        setEmail(prev => prev || userData.email || '');
        setPhone(prev => prev || userData.phone || '');
        setAddress(prev => prev || userData.address?.street || '');
        setAddressNumber(prev => prev || userData.address?.number || '');
        setCity(prev => prev || userData.address?.city || '');
        setZipCode(prev => prev || userData.address?.zipCode || '');
        setCountry(prev => prev || userData.address?.country || 'Brasil');
      } catch (error) {
        console.error('Erro ao carregar perfil no checkout:', error);
      }
    };

    fillFromProfile();
  }, []);

  const normalizeCountryCode = (value) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const lower = trimmed.toLowerCase();
    if (lower === 'brasil' || lower === 'brazil' || lower === 'br') return 'BR';
    if (trimmed.length === 2) return trimmed.toUpperCase();
    return undefined;
  };

  const formatZipCode = (value) => {
    let digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    return digits;
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    if (digits.length <= 2) return `(${digits}`;

    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    if (rest.length <= 5) {
      return `(${ddd}) ${rest}`;
    }
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
  };

  const handlePlaceOrder = async () => {
    if (!firstName || !lastName || !email || !address || !addressNumber || !city || !state || !zipCode || !country || !phone) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    if (Object.keys(cartItems).length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }
    
    setIsProcessing(true);
    
    const deliveryInfo = {
      firstName,
      lastName,
      email,
      address,
      number: addressNumber,
      city,
      state,
      zipCode,
      country,
      phone,
      method
    };
    
    try {
      // Processa pagamento com PIX
      if (method === 'pix') {
        const subtotal = getCartAmount();
        const effectiveShipping = getEffectiveShippingCost(subtotal);
        const totalAmount = subtotal + effectiveShipping;
        const pixAmount = totalAmount * 0.94; // 6% de desconto
        const orderData = await placeOrder(deliveryInfo, null, { clearCart: false, toastOnSuccess: false });
        
        const pixPayment = generatePixPayment(pixAmount, orderData._id);
        setPixData(pixPayment);
        setShowPixModal(true);
        
        toast.success('Pedido realizado! Escaneie o QR Code para pagar');
        setIsProcessing(false);
        return; // Não navega ainda, mostra o modal do PIX
      }
      
      // Processa pagamento com cartão de crédito
      if (method === 'creditcard') {
        setStripeError('');
        if (!stripe || !elements) {
          toast.error('Stripe ainda não está pronto. Tente novamente.');
          setIsProcessing(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          toast.error('Não foi possível carregar o formulário do cartão.');
          setIsProcessing(false);
          return;
        }

        // 1. Cria o pedido no backend (sem limpar carrinho)
        const orderData = await placeOrder(deliveryInfo, null, { clearCart: false, toastOnSuccess: false });
        const orderId = orderData._id;
        const subtotal = getCartAmount();
        const effectiveShipping = getEffectiveShippingCost(subtotal);
        const totalAmount = subtotal + effectiveShipping;

        // 2. Cria PaymentIntent no backend (valor em reais)
        const paymentIntentData = await paymentService.createPaymentIntent(
          totalAmount,
          `Pedido ${orderData.orderNumber}`,
          orderId
        );

        if (!paymentIntentData.clientSecret) {
          throw new Error('Falha ao criar intenção de pagamento');
        }

        const billingCountry = normalizeCountryCode(country);
        const { error: stripeConfirmError, paymentIntent } = await stripe.confirmCardPayment(
          paymentIntentData.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: cardName || `${firstName} ${lastName}`.trim(),
                email,
                phone,
                address: {
                  line1: `${address}, ${addressNumber}`,
                  city,
                  state,
                  postal_code: zipCode,
                  country: billingCountry
                }
              }
            }
          }
        );

        if (stripeConfirmError) {
          setStripeError(stripeConfirmError.message || 'Pagamento nao autorizado');
          await orderService.updateOrderPayment(
            orderId,
            {
              transactionId: paymentIntentData.paymentIntentId,
              installments
            },
            'failed',
            'Pagamento nao autorizado'
          );
          toast.error(stripeConfirmError.message || 'Pagamento nao autorizado');
          return;
        }

        const paymentStatus = paymentIntent?.status || 'processing';
        const resolvedStatus = paymentStatus === 'succeeded' ? 'paid' : 'pending';
        const statusLabel = paymentStatus === 'succeeded' ? 'Pagamento aprovado' : 'Aguardando confirmacao de pagamento';

        await orderService.updateOrderPayment(
          orderId,
          {
            transactionId: paymentIntent?.id || paymentIntentData.paymentIntentId,
            installments
          },
          resolvedStatus,
          statusLabel
        );

        if (paymentStatus === 'succeeded') {
          toast.success('Pagamento confirmado com sucesso!');
          navigate('/pedidos');
        } else {
          toast.info('Pagamento em processamento. Avisaremos quando confirmar.');
          navigate('/pedidos');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao processar pagamento');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const closePixModal = () => {
    setShowPixModal(false);
    navigate('/pedidos');
  };
  
  const copyPixCode = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.pixCode);
      toast.success('Código PIX copiado!');
    }
  };
  
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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Endereço</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='Rua, avenida, complemento' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Número</label>
              <input value={addressNumber} onChange={(e) => setAddressNumber(e.target.value.replace(/\D/g, ''))} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='Número da casa' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Cidade</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='São Paulo' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Estado</label>
              <input
                value={state}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2)
                  setState(value)
                }}
                className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
                type="text"
                placeholder='SP'
                maxLength={2}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>CEP</label>
              <input
                value={zipCode}
                onChange={(e) => setZipCode(formatZipCode(e.target.value))}
                className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
                type="text"
                placeholder='00000-000'
                maxLength={9}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>País</label>
              <input value={country} onChange={(e) => setCountry(e.target.value)} className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' type="text" placeholder='Brasil' />
            </div>
          </div>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Telefone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
              type="tel"
              placeholder='(11) 99999-9999'
              maxLength={15}
            />
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
            <label className='flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all' style={{borderColor: method === 'creditcard' ? '#000' : '#ddd'}}>
              <input type="radio" name="payment" value="creditcard" checked={method === 'creditcard'} onChange={()=>setMethod('creditcard')} className='w-4 h-4' />
              <div className='ml-4'>
                <span className='font-medium'>Cartão de Crédito</span>
              </div>
            </label>
          </div>
          
          {/* Formulário do Cartão de Crédito */}
          {method === 'creditcard' && (
            <div className='mt-6 p-6 bg-white rounded-lg border-2 border-gray-200'>
              <h3 className='text-lg font-bold text-gray-900 mb-4'>Dados do Cartão</h3>
              
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Nome no Cartão</label>
                <input 
                  value={cardName} 
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black' 
                  type="text" 
                  placeholder='NOME COMO NO CARTÃO' 
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Dados do Cartão</label>
                <div className='w-full border border-gray-300 rounded-lg py-3 px-4 focus-within:ring-2 focus-within:ring-black'>
                  <CardElement
                    onChange={(event) => {
                      if (event.error) {
                        setStripeError(event.error.message || 'Dados do cartao invalidos');
                      } else if (stripeError) {
                        setStripeError('');
                      }
                    }}
                    options={{
                      hidePostalCode: true,
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#111827',
                          '::placeholder': { color: '#9ca3af' }
                        },
                        invalid: { color: '#dc2626' }
                      }
                    }}
                  />
                </div>
                {stripeError && (
                  <p className='text-sm text-red-600 mt-2'>{stripeError}</p>
                )}
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Parcelamento</label>
                <select 
                  value={installments} 
                  onChange={(e) => setInstallments(parseInt(e.target.value))}
                  className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-700 appearance-none cursor-pointer'
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  {installmentOptions.map(inst => (
                    <option key={inst.number} value={inst.number}>
                      {inst.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                <p className='text-sm text-blue-800 flex items-center gap-2'>
                  <img src={assets.shield_check} alt="Seguro" className='w-5 h-5' />
                  Pagamento seguro • Seus dados estão protegidos
                </p>
              </div>
            </div>
          )}

          {/* Informação sobre PIX */}
          {method === 'pix' && (
            <div className='mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg'>
              <h3 className='text-lg font-bold text-green-900 mb-2'>6% de desconto no PIX!</h3>
              <p className='text-sm text-green-800 mb-2'>
                Após confirmar o pedido, você receberá o QR Code para pagamento.
              </p>
              <p className='text-sm text-green-800'>
                O código expira em 30 minutos
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lado direito - Resumo do pedido */}
      <div className='w-full lg:w-1/3 h-fit sticky top-20'>
        <div className='bg-gray-50 p-8 rounded-lg'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Resumo do Pedido</h2>
          <CartTotal />
          
          <div className='my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-blue-800 flex items-center gap-2'>
              <img src={assets.lightbulb} alt="Dica" className='w-5 h-5' />
              <span><span className='font-semibold'>Dica:</span> Use o cupom <strong>TRAJEZZ10</strong> para 10% de desconto!</span>
            </p>
          </div>

          <button onClick={handlePlaceOrder} disabled={isProcessing} className='w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all mt-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed' >
            {isProcessing ? 'PROCESSANDO...' : 'FINALIZAR PEDIDO'}
          </button>
          
            <button onClick={() => navigate('/estoque')} className='w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-500 transition-all mt-3'>
              CONTINUAR COMPRANDO
            </button>
        </div>
      </div>

      {/* Modal PIX */}
      {showPixModal && pixData && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-md w-full p-8 relative'>
            <button 
              onClick={closePixModal}
              className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold'
            >
              ×
            </button>
            
            <div className='text-center'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Pagamento via PIX</h2>
              <p className='text-green-600 font-semibold mb-4'>6% de desconto aplicado!</p>
              
              <div className='bg-gray-50 p-4 rounded-lg mb-4'>
                <p className='text-sm text-gray-600 mb-1'>Valor a pagar:</p>
                <p className='text-3xl font-bold text-green-600'>R$ {pixData.amount.toFixed(2)}</p>
              </div>

              <div className='mb-4'>
                <img 
                  src={pixData.qrCode} 
                  alt="QR Code PIX" 
                  className='w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg'
                />
              </div>

              <div className='bg-gray-100 p-3 rounded-lg mb-4'>
                <p className='text-xs text-gray-600 mb-2'>Código PIX (Copiar e Colar):</p>
                <p className='text-xs text-gray-800 break-all font-mono'>
                  {pixData.pixCode}
                </p>
              </div>

              <button 
                onClick={copyPixCode}
                className='w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all mb-3'
              >
                📋 COPIAR CÓDIGO PIX
              </button>

              <button 
                onClick={closePixModal}
                className='w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-500 transition-all'
              >
                VER MEUS PEDIDOS
              </button>

              <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                <p className='text-xs text-yellow-800'>
                  ⏱️ Este código expira em {pixData.expiresIn} minutos
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
