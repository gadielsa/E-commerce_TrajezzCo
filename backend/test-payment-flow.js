import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

// Simular um usuário logado
const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  token: 'mock_token_for_testing'
};

// Configurar headers com autenticação
const headers = {
  'Authorization': `Bearer ${mockUser.token}`,
  'Content-Type': 'application/json'
};

/**
 * Script de teste do fluxo de pagamento
 * 
 * Simula:
 * 1. Criação de pedido
 * 2. Criação de PaymentIntent
 * 3. Atualização de status de pagamento
 */

async function testPaymentFlow() {
  console.log('🧪 INICIANDO TESTES DO FLUXO DE PAGAMENTO\n');

  try {
    // 1. Criar pedido
    console.log('📝 Passo 1: Criando pedido...');
    const orderResponse = await axios.post(`${API_BASE}/orders`, {
      items: [
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Camiseta Premium',
          price: 89.90,
          quantity: 1,
          image: 'image.jpg'
        }
      ],
      deliveryInfo: {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@test.com',
        address: 'Rua Teste, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        country: 'Brasil',
        phone: '(11) 98765-4321',
        method: 'cc'
      },
      paymentMethod: 'cc',
      subtotal: 89.90,
      shippingCost: 15.00,
      discount: 0,
      totalAmount: 104.90
    }, { headers });

    const order = orderResponse.data.order;
    console.log(`✅ Pedido criado: ${order.orderNumber}`);
    console.log(`   ID: ${order._id}`);
    console.log(`   Total: R$ ${order.totalAmount.toFixed(2)}\n`);

    // 2. Criar PaymentIntent
    console.log('💳 Passo 2: Criando PaymentIntent...');
    const paymentResponse = await axios.post(`${API_BASE}/payments/create-intent`, {
      amount: Math.round(order.totalAmount * 100), // em centavos
      currency: 'brl',
      description: `Pedido ${order.orderNumber}`,
      orderId: order._id,
      paymentMethodTypes: ['card']
    }, { headers });

    const paymentIntent = paymentResponse.data;
    console.log(`✅ PaymentIntent criado: ${paymentIntent.id}`);
    console.log(`   Metadata: ${JSON.stringify(paymentIntent.metadata)}`);
    console.log(`   ClientSecret: ${paymentIntent.clientSecret.substring(0, 20)}...\n`);

    // 3. Simular confirmação de pagamento
    console.log('🔄 Passo 3: Simulando confirmação de pagamento...');
    const updateResponse = await axios.put(
      `${API_BASE}/orders/${order._id}/payment`,
      {
        paymentDetails: {
          transactionId: paymentIntent.id,
          cardBrand: 'Visa',
          lastDigits: '4242',
          installments: 1
        },
        paymentStatus: 'pending',
        status: 'Aguardando confirmação de pagamento'
      },
      { headers }
    );

    console.log(`✅ Pedido atualizado`);
    console.log(`   Status: ${updateResponse.data.order.status}`);
    console.log(`   PaymentStatus: ${updateResponse.data.order.paymentStatus}\n`);

    // 4. Simular webhook (o que Stripe faria)
    console.log('🔔 Passo 4: Simulando webhook de pagamento confirmado...');
    console.log('   (Em produção, Stripe enviaria este evento)\n');
    
    console.log(`   Evento: payment_intent.succeeded`);
    console.log(`   Metadata: { orderId: "${order._id}", userId: "${mockUser._id}" }`);
    console.log(`   Ação: Order.findByIdAndUpdate(${order._id}, { paymentStatus: "paid" })\n`);

    // 5. Buscar pedido atualizado
    console.log('📋 Passo 5: Verificando pedido final...');
    const finalResponse = await axios.get(`${API_BASE}/orders/${order._id}`, { headers });
    const finalOrder = finalResponse.data.order;

    console.log(`✅ Pedido: ${finalOrder.orderNumber}`);
    console.log(`   Status: ${finalOrder.status}`);
    console.log(`   PaymentStatus: ${finalOrder.paymentStatus}`);
    console.log(`   Total: R$ ${finalOrder.totalAmount.toFixed(2)}`);
    console.log(`   Criado em: ${new Date(finalOrder.createdAt).toLocaleString('pt-BR')}\n`);

    // 6. Resumo
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ FLUXO DE PAGAMENTO TESTADO COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📊 RESUMO:');
    console.log(`   • Pedido criado: ${order.orderNumber}`);
    console.log(`   • PaymentIntent: ${paymentIntent.id}`);
    console.log(`   • Valor total: R$ ${finalOrder.totalAmount.toFixed(2)}`);
    console.log(`   • Status final: ${finalOrder.status}`);
    console.log(`   • Pagamento: ${finalOrder.paymentStatus}\n`);

    console.log('🚀 PRÓXIMAS ETAPAS:');
    console.log('   1. Iniciar Stripe CLI: stripe listen --forward-to localhost:4000/api/payments/webhook');
    console.log('   2. Disparar evento: stripe trigger payment_intent.succeeded');
    console.log('   3. Verificar webhook nos logs do servidor');
    console.log('   4. Validar Order.paymentStatus = "paid" no MongoDB\n');

  } catch (error) {
    console.error('❌ ERRO DURANTE TESTE:');
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

// Executar testes
testPaymentFlow().then(() => {
  console.log('✨ Testes concluídos!\n');
  process.exit(0);
});
