import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Usuário de teste
const testUser = {
  email: 'test@payment.com',
  password: 'Test12345!',
  name: 'Test User'
};

let headers = {
  'Content-Type': 'application/json'
};

async function loginOrRegister() {
  try {
    console.log('🔐 Passo 0: Autenticando usuário...\n');
    
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      console.log('✅ Login bem-sucedido\n');
      headers['Authorization'] = `Bearer ${loginResponse.data.token}`;
      return loginResponse.data.token;
    } catch (loginError) {
      if (loginError.response?.status === 401) {
        console.log('📝 Registrando novo usuário...');
        const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
          name: testUser.name,
          email: testUser.email,
          password: testUser.password
        });
        
        console.log('✅ Usuário registrado com sucesso\n');
        headers['Authorization'] = `Bearer ${registerResponse.data.token}`;
        return registerResponse.data.token;
      }
      throw loginError;
    }
  } catch (error) {
    console.error('❌ Erro na autenticação:', error.response?.data || error.message);
    throw error;
  }
}

async function testPaymentFlow() {
  console.log('🧪 INICIANDO TESTES DO FLUXO DE PAGAMENTO\n');

  try {
    // 0. Autenticar usuário
    await loginOrRegister();

    // 1. Criar pedido
    console.log('📝 Passo 1: Criando pedido...');
    const orderResponse = await axios.post(`${API_BASE}/orders`, {
      items: [
        {
          product: '507f1f77bcf86cd799439012',
          name: 'Camiseta Premium',
          price: 89.90,
          quantity: 1,
          size: 'M',
          image: 'image.jpg'
        }
      ],
      deliveryInfo: {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@test.com',
        address: 'Rua Teste',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        country: 'Brasil',
        phone: '(11) 98765-4321'
      },
      paymentMethod: 'creditcard',
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
      amount: Math.round(order.totalAmount * 100),
      currency: 'brl',
      description: `Pedido ${order.orderNumber}`,
      orderId: order._id,
      paymentMethodTypes: ['card']
    }, { headers });

    const paymentIntent = paymentResponse.data;
    console.log(`✅ PaymentIntent criado: ${paymentIntent.id}`);
    console.log(`   ClientSecret: ${paymentIntent.clientSecret.substring(0, 20)}...\n`);

    // 3. Atualizar pagamento
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
        status: 'Pagamento aprovado'
      },
      { headers }
    );

    console.log(`✅ Pedido atualizado`);
    console.log(`   Status: ${updateResponse.data.order.status}`);
    console.log(`   PaymentStatus: ${updateResponse.data.order.paymentStatus}\n`);

    // 4. Buscar pedido atualizado
    console.log('📋 Passo 4: Verificando pedido final...');
    const finalResponse = await axios.get(`${API_BASE}/orders/${order._id}`, { headers });
    const finalOrder = finalResponse.data.order;

    console.log(`✅ Pedido: ${finalOrder.orderNumber}`);
    console.log(`   Status: ${finalOrder.status}`);
    console.log(`   PaymentStatus: ${finalOrder.paymentStatus}`);
    console.log(`   Total: R$ ${finalOrder.totalAmount.toFixed(2)}\n`);

    // 5. Resumo
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ FLUXO DE PAGAMENTO TESTADO COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📊 RESUMO:');
    console.log(`   • Pedido criado: ${order.orderNumber}`);
    console.log(`   • PaymentIntent: ${paymentIntent.id}`);
    console.log(`   • Valor total: R$ ${finalOrder.totalAmount.toFixed(2)}`);
    console.log(`   • Status final: ${finalOrder.status}\n`);

  } catch (error) {
    console.error('❌ ERRO DURANTE TESTE:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);
    process.exit(1);
  }
}

testPaymentFlow().then(() => {
  console.log('✨ Testes concluídos!\n');
  process.exit(0);
});
