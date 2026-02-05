/**
 * Script de Teste das Integrações
 * Execute: node backend/test-integrations.js
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Cores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.magenta}━━━ ${msg} ━━━${colors.reset}\n`)
};

/**
 * Teste 1: Health Check
 */
async function testHealthCheck() {
  log.section('Teste 1: Health Check');
  
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    
    if (response.data.status === 'ok') {
      log.success('API está online');
      log.info(`Uptime: ${response.data.uptime}s`);
      return true;
    }
  } catch (error) {
    log.error('API não está respondendo');
    log.error(`Erro: ${error.message}`);
    return false;
  }
}

/**
 * Teste 2: Buscar CEP
 */
async function testBuscarCep() {
  log.section('Teste 2: Buscar CEP (ViaCEP)');
  
  const ceps = [
    '01310100', // Av Paulista, SP
    '20040020', // Centro, RJ
    '30130100'  // Centro, BH
  ];

  for (const cep of ceps) {
    try {
      const response = await axios.get(`${BASE_URL}/shipping/cep/${cep}`);
      
      if (response.data.success) {
        log.success(`CEP ${cep} encontrado`);
        log.info(`  → ${response.data.data.logradouro}, ${response.data.data.cidade}/${response.data.data.estado}`);
      }
    } catch (error) {
      log.error(`Erro ao buscar CEP ${cep}`);
      log.error(`  → ${error.response?.data?.message || error.message}`);
    }
  }
}

/**
 * Teste 3: Calcular Frete
 */
async function testCalcularFrete() {
  log.section('Teste 3: Calcular Frete (Melhor Envio)');
  
  const payload = {
    cepDestino: '20040020',
    produtos: [
      {
        nome: 'Camiseta',
        preco: 79.90,
        quantidade: 1,
        peso: 0.3,
        altura: 5,
        largura: 30,
        comprimento: 20
      }
    ]
  };

  try {
    const response = await axios.post(`${BASE_URL}/shipping/calcular`, payload);
    
    if (response.data.success && response.data.cotacoes) {
      log.success('Frete calculado com sucesso');
      
      response.data.cotacoes.forEach(cotacao => {
        log.info(`  → ${cotacao.servicoCompleto}: R$ ${cotacao.preco.toFixed(2)} (${cotacao.prazoEntrega} dias)`);
      });

      if (response.data.metadata?.modo === 'ficticio') {
        log.warning('  ⚠️  Usando valores fictícios - Configure MELHOR_ENVIO_API_KEY');
      }
    }
  } catch (error) {
    log.error('Erro ao calcular frete');
    log.error(`  → ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Teste 4: Login (necessário para criar pagamento)
 */
async function testLogin() {
  log.section('Teste 4: Login');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: process.env.ADMIN_EMAIL || 'admin@trajezz.com.br',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456'
    });

    if (response.data.token) {
      authToken = response.data.token;
      log.success('Login realizado com sucesso');
      return true;
    }
  } catch (error) {
    log.error('Erro ao fazer login');
    log.error(`  → ${error.response?.data?.message || error.message}`);
    log.warning('  → Alguns testes que requerem autenticação serão pulados');
    return false;
  }
}

/**
 * Teste 5: Criar Payment Intent (Stripe)
 */
async function testCreatePaymentIntent() {
  log.section('Teste 5: Criar Payment Intent (Stripe)');

  if (!authToken) {
    log.warning('Pulando teste - necessário autenticação');
    return;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/payments/create-intent`,
      {
        amount: 150.50,
        description: 'Teste de pagamento',
        orderId: 'test_' + Date.now(),
        paymentMethodTypes: ['card']
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    if (response.data.success && response.data.clientSecret) {
      log.success('Payment Intent criado com sucesso');
      log.info(`  → Intent ID: ${response.data.paymentIntentId}`);
      log.info(`  → Valor: R$ ${response.data.amount.toFixed(2)}`);
      log.info(`  → Status: ${response.data.status}`);
    }
  } catch (error) {
    log.error('Erro ao criar payment intent');
    log.error(`  → ${error.response?.data?.message || error.message}`);
    
    if (error.message.includes('STRIPE_SECRET_KEY')) {
      log.warning('  → Verifique se STRIPE_SECRET_KEY está configurada no .env');
    }
  }
}

/**
 * Teste 6: Verificar Configurações
 */
function testConfigurations() {
  log.section('Teste 6: Verificar Configurações');

  const configs = [
    { name: 'MONGODB_URI', value: process.env.MONGODB_URI, required: true },
    { name: 'JWT_SECRET', value: process.env.JWT_SECRET, required: true },
    { name: 'STRIPE_SECRET_KEY', value: process.env.STRIPE_SECRET_KEY, required: true },
    { name: 'STRIPE_WEBHOOK_SECRET', value: process.env.STRIPE_WEBHOOK_SECRET, required: true },
    { name: 'MELHOR_ENVIO_API_KEY', value: process.env.MELHOR_ENVIO_API_KEY, required: false },
    { name: 'CEP_ORIGEM', value: process.env.CEP_ORIGEM, required: false },
    { name: 'CLOUDINARY_CLOUD_NAME', value: process.env.CLOUDINARY_CLOUD_NAME, required: false }
  ];

  configs.forEach(config => {
    if (!config.value || config.value === 'seu_api_key_aqui') {
      if (config.required) {
        log.error(`${config.name}: NÃO CONFIGURADO (obrigatório)`);
      } else {
        log.warning(`${config.name}: NÃO CONFIGURADO (opcional)`);
      }
    } else {
      const preview = config.value.substring(0, 20) + '...';
      log.success(`${config.name}: ${preview}`);
    }
  });
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  console.log(`${colors.blue}
╔═══════════════════════════════════════════╗
║   Teste de Integrações - TrajezzCo        ║
║   APIs: CEP, Frete e Pagamentos          ║
╚═══════════════════════════════════════════╝
${colors.reset}`);

  log.info(`Testando: ${BASE_URL}`);
  log.info(`Hora: ${new Date().toLocaleString()}\n`);

  // Executar testes
  const healthOk = await testHealthCheck();
  
  if (!healthOk) {
    log.error('\n❌ Servidor não está rodando. Execute: npm start\n');
    process.exit(1);
  }

  await testBuscarCep();
  await testCalcularFrete();
  await testLogin();
  await testCreatePaymentIntent();
  testConfigurations();

  // Resumo
  log.section('Resumo');
  log.info('Testes concluídos!');
  log.info('\nPróximos passos:');
  log.info('  1. Configure as variáveis de ambiente faltantes no .env');
  log.info('  2. Para webhooks do Stripe, veja: WEBHOOKS_STRIPE.md');
  log.info('  3. Para integração completa, veja: GUIA_INTEGRACAO_APIS.md');
  console.log('');
}

// Executar
runAllTests().catch(error => {
  log.error('Erro ao executar testes:');
  console.error(error);
  process.exit(1);
});
