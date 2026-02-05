import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContextContext';
import CepInput from '../components/CepInput';
import FreteCalculator from '../components/FreteCalculator';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentService from '../services/paymentService';
import orderService from '../services/orderService';
import { toast } from 'react-toastify';

/**
 * Exemplo de Checkout com integração completa:
 * - Busca de CEP
 * - Cálculo de Frete
 * - Pagamento com Stripe
 */
const CheckoutExample = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, getCartAmount, clearCart } = useContext(ShopContext);

  // Dados do cliente
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  // Frete
  const [freteSelecionado, setFreteSelecionado] = useState(null);
  const [enderecoPreenchido, setEnderecoPreenchido] = useState(false);

  // Totais
  const subtotal = getCartAmount();
  const frete = freteSelecionado?.preco || 0;
  const total = subtotal + frete;

  // Estados
  const [loading, setLoading] = useState(false);

  /**
   * 1. Quando CEP é encontrado, preencher campos
   */
  const handleCepFound = (addressData) => {
    setFormData(prev => ({
      ...prev,
      endereco: addressData.logradouro,
      bairro: addressData.bairro,
      cidade: addressData.cidade,
      estado: addressData.estado,
      cep: addressData.cep
    }));
    setEnderecoPreenchido(true);
    toast.success('Endereço encontrado!');
  };

  /**
   * 2. Quando frete é selecionado
   */
  const handleFreteSelected = (frete) => {
    setFreteSelecionado(frete);
    toast.success(`${frete.servicoCompleto} selecionado!`);
  };

  /**
   * 3. Processar pagamento
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (!formData.nome || !formData.email || !formData.cep) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!freteSelecionado) {
      toast.error('Selecione uma opção de frete');
      return;
    }

    if (!stripe || !elements) {
      toast.error('Stripe não inicializado');
      return;
    }

    setLoading(true);

    try {
      // Passo 1: Criar pedido no backend
      const orderData = {
        items: Object.keys(cartItems).map(id => ({
          productId: id,
          quantity: cartItems[id]
        })),
        deliveryInfo: formData,
        shipping: {
          service: freteSelecionado.servicoCompleto,
          cost: freteSelecionado.preco,
          estimatedDays: freteSelecionado.prazoEntrega
        },
        paymentMethod: 'card',
        amount: total
      };

      const order = await orderService.createOrder(orderData);

      // Passo 2: Criar Payment Intent
      const { clientSecret } = await paymentService.createPaymentIntent(
        total,
        `Pedido #${order._id}`,
        order._id
      );

      // Passo 3: Confirmar pagamento com Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.nome,
              email: formData.email,
              phone: formData.telefone,
              address: {
                line1: formData.endereco,
                line2: formData.numero,
                city: formData.cidade,
                state: formData.estado,
                postal_code: formData.cep,
                country: 'BR'
              }
            }
          }
        }
      );

      if (error) {
        toast.error(`Erro no pagamento: ${error.message}`);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        toast.success('Pagamento aprovado! 🎉');
        clearCart();
        
        // Redirecionar para página de sucesso
        setTimeout(() => {
          window.location.href = `/order-success/${order._id}`;
        }, 2000);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error(error.message || 'Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualizar campo do formulário
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Coluna Esquerda - Formulário */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome Completo *"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />

                <input
                  type="tel"
                  name="telefone"
                  placeholder="Telefone *"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="cpf"
                  placeholder="CPF *"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    CEP *
                  </label>
                  <CepInput 
                    onAddressFound={handleCepFound}
                    initialValue={formData.cep}
                  />
                </div>

                {enderecoPreenchido && (
                  <>
                    <input
                      type="text"
                      name="endereco"
                      placeholder="Rua *"
                      value={formData.endereco}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="numero"
                        placeholder="Número *"
                        value={formData.numero}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />

                      <input
                        type="text"
                        name="complemento"
                        placeholder="Complemento"
                        value={formData.complemento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <input
                      type="text"
                      name="bairro"
                      placeholder="Bairro *"
                      value={formData.bairro}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="cidade"
                        placeholder="Cidade *"
                        value={formData.cidade}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />

                      <input
                        type="text"
                        name="estado"
                        placeholder="Estado *"
                        value={formData.estado}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        maxLength="2"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Frete */}
            {enderecoPreenchido && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Frete</h2>
                <FreteCalculator 
                  produtos={Object.keys(cartItems).map(id => ({
                    name: cartItems[id].name,
                    price: cartItems[id].price,
                    quantity: cartItems[id].quantity || 1
                  }))}
                  onFreteSelected={handleFreteSelected}
                />
              </div>
            )}

            {/* Pagamento */}
            {freteSelecionado && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Pagamento</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Dados do Cartão
                  </label>
                  <div className="border rounded-lg p-4">
                    <CardElement 
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#9e2146',
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !stripe}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {loading ? 'Processando...' : `Pagar R$ ${total.toFixed(2)}`}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Coluna Direita - Resumo */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>

              {freteSelecionado && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete:</span>
                  <div className="text-right">
                    <div className="font-medium">R$ {frete.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {freteSelecionado.servicoCompleto}
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-blue-600">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Items do carrinho */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Itens ({Object.keys(cartItems).length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(cartItems).map(([id, item]) => (
                  <div key={id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutExample;
