# Guia de Integração: Melhor Envio + Stripe

## � Quick Start (5 minutos)

Se você só quer começar rapidinho:

```bash
# 1. Copie suas chaves
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
MELHOR_ENVIO_API_KEY=eyJ0eXA...

# 2. Cole em backend/.env
# 3. Instale dependências
cd backend && npm install

# 4. Inicie o servidor
npm start

# ✅ Pronto! Testes básicos vão funcionar
```

**Para tudo funcionando corretamente, leia as seções abaixo em ordem! ↓**

---

## �📋 Índice
1. [Configuração do Stripe](#configuração-do-stripe)
2. [Configuração do Melhor Envio](#configuração-do-melhor-envio)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Endpoints da API](#endpoints-da-api)
5. [Uso no Frontend (Exemplos Práticos)](#uso-no-frontend)
6. [Webhooks - Como Funcionam](#como-funcionam-os-webhooks-implementação)
7. [Testes](#testes)
8. [Troubleshooting](#troubleshooting)
9. [Checklist Final](#checklist-final)

---

## 🔑 Configuração do Stripe

### 1. Criar conta no Stripe
1. Acesse [stripe.com](https://stripe.com)
2. Clique em "Começar" (Sign Up)
3. Preencha com seus dados
4. Complete o onboarding

### 2. Obter chaves de API
1. Acesse o [Dashboard do Stripe](https://dashboard.stripe.com)
2. Vá para **Developers** > **API keys**
3. Você verá duas chaves:
   - **Publishable Key** (pública) - para o frontend
   - **Secret Key** (secreta) - apenas para o backend
4. Copie ambas

### 3. Configurar Webhook (importante!)

#### ⚠️ Por que webhooks são essenciais?

Quando o cliente paga no seu app:
1. Frontend envia pagamento para Stripe
2. Stripe processa e retorna resultado
3. **MAS:** E se o cliente fechar o navegador antes de receber a resposta?

**Solução:** Webhooks! O Stripe avisa seu servidor quando algo acontece, independentemente do cliente estar conectado.

```
Cliente paga → Stripe processa → Webhook avisa seu servidor → Pedido atualizado ✅
```

#### 🔧 Passo a passo para configurar

**PASSO 1: Acessar painel Stripe**
1. Vá para https://dashboard.stripe.com
2. Se não tiver modo teste ativado, ative no canto inferior esquerdo
3. Clique em **Developers** (menu esquerdo)
4. Clique em **Webhooks**

**PASSO 2: Criar um endpoint (URL onde Stripe vai enviar eventos)**

Você tem 2 opções:

**Opção A - Se você tem um domínio publicado:**
```
URL: https://seu-dominio.com/api/payments/webhook
Exemplo: https://trajezzco.com/api/payments/webhook
```

**Opção B - Se está em desenvolvimento LOCAL (recomendado com Stripe CLI):**
```bash
# Instale Stripe CLI primeiro (veja instruções abaixo)
stripe listen --forward-to localhost:5000/api/payments/webhook
# Isso vai mostrar o signing secret automaticamente
```

**Passo prático:**

1. Clique em **Adicionar endpoint** no Stripe Dashboard
2. Cole a URL do seu webhook
3. Clique em **Selecionar eventos**

**PASSO 3: Selecionar eventos para monitorar**

Marque OBRIGATORIAMENTE:
- ✅ `payment_intent.succeeded` - Pagamento bem-sucedido
- ✅ `payment_intent.payment_failed` - Pagamento falhou
- ✅ `charge.refunded` - Reembolso processado

Opcionais:
- ⬜ `payment_intent.canceled` - Pagamento cancelado
- ⬜ `charge.dispute.created` - Disputa aberta

4. Clique em **Criar evento**

**PASSO 4: Obter o Signing Secret**

Este é o token que sua aplicação vai usar para validar que o webhook é realmente do Stripe:

1. Na lista de endpoints, clique no seu endpoint recém-criado
2. Procure por **Signing secret** (normalmente no topo)
3. Clique em **Revelar** (se não estiver visível)
4. **Copie** a chave (começa com `whsec_`)

**PASSO 5: Adicionar ao arquivo .env**

Abra `backend/.env` e adicione:
```env
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_copiada_aqui
```

Exemplo real:
```env
STRIPE_WEBHOOK_SECRET=whsec_test_49d3ca46b1e5b8c4f3d2e1a9c8b7f6g5
```

---

#### 🧪 Testando webhooks em desenvolvimento (STRIPE CLI)

Para testar sem publicar sua aplicação, use Stripe CLI:

**INSTALAR STRIPE CLI:**

Windows (PowerShell como Admin):
```powershell
choco install stripe-cli
```

Se não tiver Chocolatey:
```powershell
# Download direto
# Vá para https://github.com/stripe/stripe-cli/releases
# Baixe stripe_windows_x86_64.zip
# Extraia e adicione ao PATH
```

macOS:
```bash
brew install stripe/stripe-cli/stripe
```

Linux:
```bash
curl https://files.stripe.com/stripe-cli/releases/latest/stripe_linux_x86_64.tar.gz | tar
```

**USAR STRIPE CLI PARA TESTAR:**

```bash
# 1. Abra um terminal e faça login
stripe login
# Clique no link que aparecer para autorizar

# 2. Em outra aba do terminal, escute os webhooks
stripe listen --forward-to localhost:5000/api/payments/webhook

# Resultado esperado:
# > Ready! Your webhook signing secret is whsec_test_...
# Copie este secret para o .env!
```

**Agora em OUTRO terminal, simule eventos:**

```bash
# Simular pagamento bem-sucedido
stripe trigger payment_intent.succeeded

# Simular pagamento falhado
stripe trigger payment_intent.payment_failed

# Simular reembolso
stripe trigger charge.refunded
```

Você vai ver no terminal anterior:
```
> 2024-01-30 10:15:32   200   POST   /api/payments/webhook   payment_intent.succeeded
```

---

#### 🔌 Testando com cartões reais (apenas teste!)

Use estes cartões no formulário de pagamento:

**Teste bem-sucedido:**
- Número: `4242 4242 4242 4242`
- Data: `12/25` (qualquer futura)
- CVC: `123`
- Nome: Qualquer nome

**Teste falha:**
- Número: `4000 0000 0000 0002`
- Resto: igual

O webhook será chamado automaticamente!

---

## 🚚 Configuração do Melhor Envio

### 🎯 Resumo rápido dos passos

| Passo | O que fazer | Onde colocar |
|-------|-----------|--------------|
| 1 | Criar conta | melhorenviobeta.com.br |
| 2 | Gerar API Key | Configurações > API |
| 3 | Ativar transportadoras | Integrações |
| 4 | Adicionar ao .env | `backend/.env` |
| 5 | Testar a API | Terminal ou Postman |

---

### PASSO 1: Criar conta no Melhor Envio

1. Abra [melhorenviobeta.com.br](https://www.melhorenviobeta.com.br)
2. Clique em **Cadastre-se** (no canto superior direito)
3. Escolha tipo de conta: **Pessoa Jurídica** (recomendado para loja) ou **Pessoa Física**
4. Preencha os dados:
   - **Razão Social / Nome Completo**
   - **CNPJ / CPF**
   - **Email** (vai usar para login)
   - **Senha**
5. Clique em **Criar conta**
6. **Verifique seu email** - você vai receber um link de confirmação
7. Clique no link para ativar a conta

**Resultado:** Você está logado no Melhor Envio! 🎉

---

### PASSO 2: Gerar uma API Key

Agora você precisa gerar uma chave para sua aplicação se comunicar com o Melhor Envio.

**No painel do Melhor Envio:**

1. Clique no **seu nome/ícone** no canto superior direito
2. Clique em **Configurações**
3. No menu esquerdo, clique em **API**
4. Você verá uma seção chamada **Sua API Key**
5. Se não houver chave gerada, clique em **Gerar nova chave** (ou **Generate**)
6. Uma chave será exibida (tipo: `eyJ0eXAiOiJKV1QiLCJhbGc...`)
7. **⚠️ IMPORTANTE:** Copie esta chave AGORA! Ela só aparece uma vez!
8. Se perder, você precisa gerar uma nova

**Cole a chave em `backend/.env`:**

```env
MELHOR_ENVIO_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGc...
MELHOR_ENVIO_BASE_URL=https://www.melhorenviobeta.com.br/api/v2
```

**Pronto!** Sua aplicação pode fazer requisições agora.

---

### PASSO 3: Conectar Transportadoras (Opcional, mas recomendado)

As transportadoras são as empresas que vão entregar os produtos. Você pode usar várias!

**No painel do Melhor Envio:**

1. Clique em **Integrações** (menu esquerdo)
2. Você verá uma lista de transportadoras disponíveis:
   - 📦 **Correios** (mais comum no Brasil)
   - 🚚 **Loggi** (rápido em cidades grandes)
   - 📮 **Jadlog** (bom para nordeste)
   - 🎒 **Sedex** (rápido)
   - Etc.

3. Para cada transportadora que quer usar:
   - Clique em **Conectar** ou **Ativar**
   - Siga as instruções (você pode precisar de dados de acesso com a transportadora)
   - Após conectar, você verá um ✅ verde

**Por que conectar transportadoras?**
- Seu cliente vai ver opções de frete (Sedex em 2 dias por R$50, PAC em 5 dias por R$20, etc)
- Você pode escolher qual usar na hora de gerar a etiqueta
- Melhor Envio faz a integração para você!

**Dica:** Se não souber, comece só com **Correios**. A maioria das vendas usa Correios.

---

### PASSO 4: Validar a Configuração (Teste a API)

Depois de gerar a chave, vamos testar se funciona.

**Opção A: Usando Postman (GUI, mais fácil)**

1. Abra Postman
2. Crie um novo request:
   - **Método:** GET
   - **URL:** `https://www.melhorenviobeta.com.br/api/v2/me`
   - **Headers:**
     - Key: `Authorization`
     - Value: `Bearer SEU_API_KEY_AQUI`
     - Key: `Content-Type`
     - Value: `application/json`

3. Clique em **Send**
4. Se a resposta for assim, funcionou! ✅
   ```json
   {
     "id": 123,
     "name": "Sua Loja",
     "email": "seu@email.com",
     "status": "active"
   }
   ```

5. Se der erro 401 (Unauthorized):
   - Copie a API Key novamente (talvez expirou)
   - Verifique se está `Bearer ` + espaço + a chave

**Opção B: Usando Terminal (comando curl)**

Abra PowerShell/Terminal e rode:

```powershell
$headers = @{
    "Authorization" = "Bearer SEU_API_KEY_AQUI"
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest `
    -Uri "https://www.melhorenviobeta.com.br/api/v2/me" `
    -Headers $headers `
    -Method Get

$response.Content
```

Se funcionar, você verá os dados da sua conta.

---

### PASSO 5: Testar Cálculo de Frete (Teste Real)

Agora vamos testar se conseguimos **calcular frete** entre dois CEPs.

**No Postman:**

1. Novo request:
   - **Método:** POST
   - **URL:** `https://www.melhorenviobeta.com.br/api/v2/shipment/calculate`
   - **Headers:** (mesmos anteriores)
   - **Body (JSON):**

```json
{
  "from": {
    "postal_code": "01310100"
  },
  "to": {
    "postal_code": "12345678"
  },
  "products": [
    {
      "id": "1",
      "width": 15,
      "height": 10,
      "length": 20,
      "weight": 2.5,
      "insurance_value": 100,
      "quantity": 1
    }
  ],
  "options": {
    "insurance_value": 100,
    "use_own_hand": false,
    "receipt": false
  }
}
```

2. Clique em **Send**
3. Você vai receber algo assim:

```json
[
  {
    "id": 1,
    "name": "Sedex",
    "price": 45.50,
    "delivery_time": 3,
    "packages": 1
  },
  {
    "id": 2,
    "name": "PAC",
    "price": 25.00,
    "delivery_time": 8,
    "packages": 1
  }
]
```

**🎉 Sucesso!** Agora sua loja consegue calcular fretes!

---

### PASSO 6: Testar Integração no Backend (Node.js)

Abra `backend/server.js` e verifique se as rotas de delivery estão registradas:

```javascript
import deliveryRoutes from './routes/delivery.js';

app.use('/api/delivery', deliveryRoutes);
```

Inicie o servidor:

```bash
cd backend
npm start
```

Abra Postman novamente e teste:

- **Método:** GET
- **URL:** `http://localhost:5000/api/delivery/cep/01310100`

Resposta esperada:
```json
{
  "success": true,
  "address": {
    "street": "Avenida Paulista",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

Se funcionou, sua integração está pronta! ✅

---

## 🌍 Variáveis de Ambiente

### ✅ Checklist - Onde adicionar cada chave

| Variável | Arquivo | Descrição | Exemplo |
|----------|---------|-----------|---------|
| `STRIPE_PUBLIC_KEY` | `frontend/.env` | Chave pública Stripe (usar no frontend) | `pk_test_51J...` |
| `STRIPE_SECRET_KEY` | `backend/.env` | Chave secreta Stripe (apenas backend!) | `sk_test_51J...` |
| `STRIPE_WEBHOOK_SECRET` | `backend/.env` | Secret para validar webhooks | `whsec_test_c4c...` |
| `MELHOR_ENVIO_API_KEY` | `backend/.env` | API Key do Melhor Envio | `eyJ0eXAiOiJKV1Q...` |
| `MELHOR_ENVIO_BASE_URL` | `backend/.env` | URL base API (copie exato) | `https://www.melhorenviobeta.com.br/api/v2` |
| `VITE_API_URL` | `frontend/.env` | URL base da sua API | `http://localhost:5000/api` |

---

### 📝 backend/.env (Arquivo completo)

```env
# ========== STRIPE ==========
STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_sua_webhook_secret_aqui

# ========== MELHOR ENVIO ==========
MELHOR_ENVIO_API_KEY=sua_api_key_aqui
MELHOR_ENVIO_BASE_URL=https://www.melhorenviobeta.com.br/api/v2

# ========== BANCO DE DADOS ==========
# Adicione outras variáveis conforme necessário
```

### 📝 frontend/.env.local (Arquivo completo)

```env
# ========== STRIPE ==========
VITE_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_aqui

# ========== API ==========
VITE_API_URL=http://localhost:5000/api
```

---

### 🔍 Como validar se as chaves estão corretas

Depois de adicionar as chaves, rode este script para testar:

**Arquivo: `backend/test-env.js`**

```javascript
console.log('✅ VALIDANDO VARIÁVEIS DE AMBIENTE...\n');

const required = [
  'STRIPE_PUBLIC_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'MELHOR_ENVIO_API_KEY',
  'MELHOR_ENVIO_BASE_URL'
];

let allValid = true;

required.forEach(key => {
  const value = process.env[key];
  if (!value) {
    console.log(`❌ ${key} - NÃO CONFIGURADO!`);
    allValid = false;
  } else {
    // Mostrar apenas primeiros 10 caracteres por segurança
    const masked = value.substring(0, 10) + '...';
    console.log(`✅ ${key} - ${masked}`);
  }
});

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('✅ TODAS AS VARIÁVEIS ESTÃO CONFIGURADAS!');
  console.log('Você pode iniciar o servidor: npm start');
} else {
  console.log('❌ ERRO: Faltam variáveis. Verifique o .env!');
  process.exit(1);
}
```

**Para rodar:**

```bash
cd backend
node test-env.js
```

**Resultado esperado:**
```
✅ VALIDANDO VARIÁVEIS DE AMBIENTE...

✅ STRIPE_PUBLIC_KEY - pk_test_...
✅ STRIPE_SECRET_KEY - sk_test_...
✅ STRIPE_WEBHOOK_SECRET - whsec_...
✅ MELHOR_ENVIO_API_KEY - eyJ0eXA...
✅ MELHOR_ENVIO_BASE_URL - https://...

==================================================
✅ TODAS AS VARIÁVEIS ESTÃO CONFIGURADAS!
```

---

## 🔌 Endpoints da API

### Delivery (Entrega)

#### 1. Buscar endereço por CEP
```
GET /api/delivery/cep/:cep
```

**Resposta:**
```json
{
  "success": true,
  "address": {
    "street": "Rua Exemplo",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "complement": ""
  }
}
```

#### 2. Calcular frete
```
POST /api/delivery/calculate
```

**Body:**
```json
{
  "originZipCode": "01234567",
  "destinyZipCode": "12345678",
  "weight": 2.5,
  "height": 10,
  "width": 15,
  "length": 20,
  "insurance": 100,
  "useOwnHand": false
}
```

**Resposta:**
```json
{
  "success": true,
  "shippingOptions": [
    {
      "id": "service_id",
      "name": "Sedex",
      "price": 45.50,
      "deadline": 3
    }
  ]
}
```

#### 3. Gerar etiqueta de envio
```
POST /api/delivery/generate-label
```

**Body:**
```json
{
  "service": "service_id",
  "recipient": {
    "name": "João Silva",
    "phone": "11999999999",
    "email": "joao@email.com",
    "document": "12345678901",
    "address": "Rua Exemplo",
    "complement": "Apto 123",
    "number": "100",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234567"
  },
  "products": [
    {
      "name": "Produto 1",
      "quantity": 1,
      "value": 100
    }
  ]
}
```

#### 4. Rastrear envio
```
GET /api/delivery/track/:trackingCode
```

#### 5. Cancelar envio
```
DELETE /api/delivery/:shipmentId
```

---

### Payments (Pagamentos)

#### 1. Criar Intent de Pagamento
```
POST /api/payments/create-intent
```

**Body:**
```json
{
  "amount": 150.50,
  "orderId": "order_123",
  "description": "Pedido #123",
  "paymentMethodTypes": ["card", "br_boleto"]
}
```

**Resposta:**
```json
{
  "success": true,
  "clientSecret": "pi_1A2B3C..._secret_xyz",
  "paymentIntentId": "pi_1A2B3C...",
  "amount": 150.50,
  "status": "requires_payment_method"
}
```

#### 2. Confirmar Pagamento
```
POST /api/payments/confirm-payment
```

**Body:**
```json
{
  "paymentIntentId": "pi_1A2B3C...",
  "orderId": "order_123"
}
```

#### 3. Processar Reembolso
```
POST /api/payments/refund
```

**Body:**
```json
{
  "paymentIntentId": "pi_1A2B3C...",
  "amount": 150.50,
  "orderId": "order_123"
}
```

#### 4. Criar/Atualizar Cliente
```
POST /api/payments/customer
```

**Body:**
```json
{
  "email": "cliente@email.com",
  "name": "João Silva",
  "phone": "11999999999",
  "address": {
    "street": "Rua Exemplo",
    "complement": "Apto 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234567",
    "country": "BR"
  }
}
```

#### 5. Listar Métodos de Pagamento
```
GET /api/payments/payment-methods/:customerId
```

#### 6. Salvar Método de Pagamento
```
POST /api/payments/save-payment-method
```

**Body:**
```json
{
  "customerId": "cus_123...",
  "paymentMethodId": "pm_123..."
}
```

#### 7. Webhook do Stripe
```
POST /api/payments/webhook
```

**Eventos monitorados:**
- `payment_intent.succeeded` - Pagamento confirmado
- `payment_intent.payment_failed` - Pagamento falhou
- `charge.refunded` - Reembolso processado

---

## 💻 Uso no Frontend

### Guia Prático: Passo a passo para usar os endpoints

#### 1️⃣ Buscar endereço por CEP

Use quando o cliente digita seu CEP no checkout.

**Arquivo:** `src/services/deliveryService.js`

```javascript
import { api } from '@/config/api';

export const searchAddressByCep = async (cep) => {
  try {
    const response = await api.get(`/delivery/cep/${cep}`);
    return response.data.address;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error;
  }
};
```

**Como usar no componente:**

```javascript
import { searchAddressByCep } from '@/services/deliveryService';

export default function Checkout() {
  const handleCepChange = async (cep) => {
    try {
      const address = await searchAddressByCep(cep);
      // address = { street, neighborhood, city, state }
      setAddress(address);
    } catch (error) {
      alert('CEP não encontrado');
    }
  };

  return (
    <input 
      type="text" 
      placeholder="Seu CEP"
      onChange={(e) => handleCepChange(e.target.value)}
    />
  );
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "address": {
    "street": "Avenida Paulista",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

---

#### 2️⃣ Calcular opções de frete

Use quando o cliente está pronto para calcular o frete do seu pedido.

**Arquivo:** `src/services/deliveryService.js`

```javascript
export const calculateShipping = async (shippingData) => {
  try {
    const response = await api.post('/delivery/calculate', {
      originZipCode: '01310100',        // CEP da sua loja
      destinyZipCode: shippingData.cep, // CEP do cliente
      weight: shippingData.weight,      // em kg
      height: 10,                       // em cm
      width: 15,                        // em cm
      length: 20,                       // em cm
      insurance: shippingData.total     // valor do pedido
    });
    
    return response.data.shippingOptions;
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    throw error;
  }
};
```

**Como usar no componente:**

```javascript
import { calculateShipping } from '@/services/deliveryService';

export default function ShippingOptions() {
  const [options, setOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const handleCalculateShipping = async () => {
    try {
      const shippingOptions = await calculateShipping({
        cep: customerCep,
        weight: totalWeight,
        total: orderTotal
      });

      setOptions(shippingOptions);
      // shippingOptions = [
      //   { id: 1, name: 'Sedex', price: 45.50, deadline: 3 },
      //   { id: 2, name: 'PAC', price: 25.00, deadline: 8 }
      // ]
    } catch (error) {
      alert('Erro ao calcular frete');
    }
  };

  return (
    <div>
      <button onClick={handleCalculateShipping}>Calcular Frete</button>
      
      {options.map((option) => (
        <div key={option.id}>
          <label>
            <input
              type="radio"
              name="shipping"
              value={option.id}
              onChange={() => setSelectedShipping(option)}
            />
            {option.name} - R${option.price.toFixed(2)} 
            ({option.deadline} dias)
          </label>
        </div>
      ))}
    </div>
  );
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "shippingOptions": [
    {
      "id": 1,
      "name": "Sedex",
      "price": 45.50,
      "deadline": 3
    },
    {
      "id": 2,
      "name": "PAC",
      "price": 25.00,
      "deadline": 8
    }
  ]
}
```

---

#### 3️⃣ Gerar etiqueta de envio (Backend)

**⚠️ IMPORTANTE:** Isto é feito **NO BACKEND**, não no frontend!

Você chama esse endpoint após:
1. ✅ Pagamento confirmado
2. ✅ Pedido criado no banco de dados

**Arquivo:** `backend/controllers/orderController.js`

```javascript
import { generateShippingLabel } from '../services/melhorEnvioService.js';

export const createOrder = async (req, res) => {
  try {
    const { 
      items, 
      shippingAddress, 
      shippingService,
      orderId 
    } = req.body;

    // Passo 1: Criar pedido no banco (já feito)
    // Passo 2: Processar pagamento (já feito)
    
    // Passo 3: Gerar etiqueta de envio
    const label = await generateShippingLabel({
      service: shippingService.id,  // ID retornado do cálculo de frete
      recipient: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        document: shippingAddress.cpf,
        address: shippingAddress.street,
        complement: shippingAddress.complement,
        number: shippingAddress.number,
        neighborhood: shippingAddress.neighborhood,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode
      },
      products: items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        value: item.price
      })),
      insurance: calculateTotalValue(items)
    });

    // Salvar tracking no pedido
    await Order.updateOne(
      { _id: orderId },
      { 
        trackingCode: label.trackingCode,
        shippingStatus: 'generated'
      }
    );

    res.json({ success: true, label });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

---

#### 4️⃣ Rastrear envio

Use para o cliente acompanhar seu pedido.

**Arquivo:** `src/services/deliveryService.js`

```javascript
export const trackShipment = async (trackingCode) => {
  try {
    const response = await api.get(`/delivery/track/${trackingCode}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao rastrear:', error);
    throw error;
  }
};
```

**Como usar:**

```javascript
export default function OrderTracking() {
  const [tracking, setTracking] = useState(null);

  const handleTrack = async (trackingCode) => {
    try {
      const data = await trackShipment(trackingCode);
      setTracking(data);
      // data = { 
      //   status: 'delivered',
      //   lastUpdate: '2024-01-30 15:30',
      //   location: 'São Paulo, SP'
      // }
    } catch (error) {
      alert('Código de rastreamento inválido');
    }
  };

  return (
    <div>
      {tracking && (
        <div>
          <p>Status: {tracking.status}</p>
          <p>Última atualização: {tracking.lastUpdate}</p>
          <p>Localização: {tracking.location}</p>
        </div>
      )}
    </div>
  );
}
```

---

### Exemplo completo: Fluxo de Checkout

Aqui está o fluxo completo de um checkout:

```javascript
export default function CheckoutFlow() {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  // Passo 1: Cliente digita CEP
  const handleSearchCep = async (zipCode) => {
    try {
      const result = await searchAddressByCep(zipCode);
      setAddress(result);
    } catch (error) {
      alert('CEP não encontrado');
    }
  };

  // Passo 2: Calcular frete automaticamente
  useEffect(() => {
    if (address && cep) {
      calculateShipping({
        cep: cep,
        weight: calculateCartWeight(),
        total: calculateCartTotal()
      }).then(setShippingOptions);
    }
  }, [address, cep]);

  // Passo 3: Cliente escolhe opção de frete
  const handleSelectShipping = (option) => {
    setSelectedShipping(option);
  };

  // Passo 4: Cliente paga
  const handlePayment = async () => {
    const order = {
      items: cartItems,
      shippingAddress: { ...address, zipCode: cep },
      shippingService: selectedShipping,
      total: calculateCartTotal() + selectedShipping.price
    };

    // Enviar para backend processar pagamento
    // Backend vai:
    // 1. Confirmar pagamento com Stripe
    // 2. Gerar etiqueta com Melhor Envio
    // 3. Enviar confirmação para cliente
    await api.post('/orders/create', order);
  };

  return (
    <form>
      {/* CEP Input */}
      <input
        value={cep}
        onChange={(e) => {
          setCep(e.target.value);
          handleSearchCep(e.target.value);
        }}
        placeholder="Seu CEP"
      />

      {/* Endereço preenchido */}
      {address && (
        <div>
          <p>{address.street}, {address.neighborhood}</p>
          <p>{address.city}, {address.state}</p>
        </div>
      )}

      {/* Opções de frete */}
      {shippingOptions.map((option) => (
        <label key={option.id}>
          <input
            type="radio"
            checked={selectedShipping?.id === option.id}
            onChange={() => handleSelectShipping(option)}
          />
          {option.name} - R${option.price.toFixed(2)} ({option.deadline} dias)
        </label>
      ))}

      {/* Botão de pagamento */}
      <button onClick={handlePayment} disabled={!selectedShipping}>
        Pagar R${(calculateCartTotal() + selectedShipping?.price || 0).toFixed(2)}
      </button>
    </form>
  );
}
```

---

### Exemplo: Calcular Frete

```javascript
import * as deliveryService from '@/services/deliveryService.js';

async function calculateShipping() {
  try {
    const shipping = await deliveryService.calculateShipping({
      originZipCode: '01310100', // CEP da loja
      destinyZipCode: userCep,
      weight: totalWeight,
      height: 10,
      width: 15,
      length: 20,
      insurance: orderTotal
    });
    
    console.log('Opções de frete:', shipping);
  } catch (error) {
    console.error('Erro:', error.message);
  }
}
```

### Exemplo: Processar Pagamento

```javascript
import * as stripeService from '@/services/stripeService.js';

async function processPayment(amount, orderId) {
  try {
    // 1. Criar Intent de Pagamento
    const intent = await stripeService.createPaymentIntent(amount, orderId);
    
    // 2. Inicializar Stripe
    const stripe = await stripeService.initStripe();
    
    // 3. Processar pagamento
    const result = await stripeService.processPaymentWithStripe(
      stripe,
      elements,
      intent.clientSecret,
      `${window.location.origin}/checkout/success`
    );
    
    // 4. Confirmar no backend
    const confirmation = await stripeService.confirmPayment(
      intent.paymentIntentId,
      orderId
    );
    
    return confirmation;
  } catch (error) {
    console.error('Erro no pagamento:', error.message);
  }
}
```

---

## 🔔 Como Funcionam os Webhooks (Implementação)

### O que seu backend faz com webhooks

Quando Stripe envia um webhook, sua aplicação deve:

1. **Validar** se o webhook é realmente do Stripe (usar a chave secreta)
2. **Identificar** qual tipo de evento é (pagamento bem-sucedido, reembolso, etc)
3. **Processar** as ações correspondentes (atualizar pedido, enviar email, etc)
4. **Responder** com status 200 para confirmar que recebeu

### Arquivo: `backend/controllers/webhookController.js`

Já foi criado para você! Tem as funções:

```javascript
// Quando pagamento é bem-sucedido
handlePaymentIntentSucceeded(paymentIntent)
  → Atualiza pedido como "pago"
  → Envia email ao cliente
  → Gera etiqueta de envio

// Quando pagamento falha
handlePaymentIntentFailed(paymentIntent)
  → Atualiza pedido como "falho"
  → Envia email ao cliente

// Quando há reembolso
handleChargeRefunded(charge)
  → Atualiza pedido como "reembolsado"
  → Reverte estoque
  → Envia email
```

### Arquivo: `backend/routes/payments.js`

A rota webhook está assim:

```javascript
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // 1. Valida assinatura (CRÍTICO!)
  const event = webhookController.validateWebhookSignature(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  // 2. Processa o evento
  const result = await webhookController.processWebhookEvent(event);

  // 3. Responde ao Stripe
  res.json({ received: true });
});
```

### ⚠️ IMPORTANTE: Ordem das middlewares

A rota webhook **DEVE** estar ANTES do middleware `express.json()`:

```javascript
// ❌ ERRADO - webhook depois do json middleware
app.use(express.json());
app.use('/api/payments', paymentRoutes);

// ✅ CORRETO - webhook é registrado antes
app.use('/api/payments', paymentRoutes);
app.use(express.json());
```

Verifique em `backend/server.js` que as rotas estão sendo adicionadas:

```javascript
// Isso deve estar no server.js:
import paymentRoutes from './routes/payments.js';
app.use('/api/payments', paymentRoutes);
```

### Como testar localmente (PASSO A PASSO)

**Passo 1: Instale Stripe CLI**

```bash
# Windows (PowerShell como Admin)
choco install stripe-cli

# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl https://files.stripe.com/stripe-cli/releases/latest/stripe_linux_x86_64.tar.gz | tar
sudo mv stripe /usr/local/bin
```

**Passo 2: Faça login no Stripe**

```bash
stripe login
# Você será redirecionado para uma página
# Clique em "Allow" para autorizar
# Volta ao terminal com mensagem de sucesso
```

**Passo 3: Abra DUAS abas do terminal**

**Aba 1 - Escute os webhooks:**
```bash
cd d:\G\Programação\Desenvolvimento\E-commerce_TrajezzCo
stripe listen --forward-to localhost:5000/api/payments/webhook

# Resultado esperado:
# > Ready! Your webhook signing secret is whsec_test_c4c10b...
# ✓ Forwarding events to http://localhost:5000/api/payments/webhook
```

**Copie o `whsec_test_...` e adicione ao `backend/.env`:**
```env
STRIPE_WEBHOOK_SECRET=whsec_test_c4c10b...
```

**Aba 2 - Rode seu servidor:**
```bash
cd backend
npm start
# Você deve ver:
# 🚀 Servidor rodando na porta 5000
```

**Passo 4: Simule um evento (em OUTRA aba)**

```bash
stripe trigger payment_intent.succeeded
```

**Resultado esperado:**

**Aba 1 (stripe listen):**
```
> 2024-01-30 10:15:32   200   POST   /api/payments/webhook   payment_intent.succeeded
```

**Aba 2 (npm start):**
```
✅ Pagamento bem-sucedido: pi_test_1A2B3C...
Pedido order_123 marcado como pago
```

---

## 🧪 Testes

### Cartões de Teste (Stripe)

**Pagamento bem-sucedido:**
- Número: `4242 4242 4242 4242`
- Data: qualquer data futura
- CVC: qualquer 3 dígitos

**Pagamento falha:**
- Número: `4000 0000 0000 0002`

**Boleto (Teste):**
- Número: `4000 0000 0000 0126`

### CEP de Teste
- `01310100` - Av. Paulista, São Paulo

---

## 🐛 Troubleshooting

### Erro: "STRIPE_SECRET_KEY não está configurada"
**Solução:**
- Abra `backend/.env`
- Verifique se contém `STRIPE_SECRET_KEY=sk_test_...`
- Se não, adicione da seção **Variáveis de Ambiente**
- Reinicie: `npm start`

### Erro: "Webhook signature validation failed"

**Causa:** Assinatura do webhook está incorreta ou expirada

**Solução:**
1. Abra `backend/.env`
2. Procure por `STRIPE_WEBHOOK_SECRET`
3. Vá para [dashboard.stripe.com](https://dashboard.stripe.com) > **Developers** > **Webhooks**
4. Clique no seu endpoint
5. Procure **Signing secret**
6. Se estiver usando Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```
   Copie o `whsec_test_...` que aparecer
7. Atualize no `.env`
8. Reinicie o servidor

### Erro: "Webhook não está sendo chamado"

**Checklist:**
- [ ] `STRIPE_WEBHOOK_SECRET` está no `.env`?
- [ ] Servidor está rodando? (`npm start`)
- [ ] Stripe CLI está escutando? (`stripe listen --forward-to ...`)
- [ ] Firewall/VPN não está bloqueando?
- [ ] URL do webhook está correta no Stripe Dashboard?

**Se usando `stripe listen`:**
```bash
# Terminal Aba 1 - Escuta webhooks
stripe listen --forward-to localhost:5000/api/payments/webhook

# Terminal Aba 2 - Seu servidor
cd backend && npm start

# Terminal Aba 3 - Simula eventos
stripe trigger payment_intent.succeeded

# Verifique Aba 1 para ver se recebeu (status 200)
```

### Erro: "Webhook is called multiple times"

**Causa:** Seu código não está respondendo corretamente

**Solução - CRÍTICO:**
```javascript
// ✅ CORRETO - Sempre responder com 200
res.json({ received: true });

// ❌ ERRADO - Stripe tenta novamente se não receber 200
res.status(400).json({ error: '...' });
res.sendStatus(500);
```

Verifique em `backend/routes/payments.js` que a rota webhook termina com:
```javascript
res.json({ received: true });  // Status 200 automático
```

### Erro: "CEP não encontrado"
- Verifique se o CEP tem 8 dígitos
- Tente manualmente em [viacep.com.br](https://viacep.com.br)
- Exemplo: `01310100` (Av. Paulista, SP)

### Erro: "Melhor Envio API Key inválida"
- Confirme a chave em **Configurações > API** do Melhor Envio
- Verifique se a conta está ativa
- Tente regenerar a chave

### 🚚 Erros específicos do Melhor Envio

#### Erro: "401 Unauthorized" ao testar API Key

**Causa:** API Key expirada, copiada errada, ou não está no header

**Checklist:**
- [ ] A chave está em `backend/.env`?
  ```bash
  # Abra o arquivo e procure por:
  MELHOR_ENVIO_API_KEY=eyJ0eXA...
  ```
- [ ] A chave tem `Bearer ` na frente? (Sim, o código já faz isso automaticamente)
- [ ] Você regenerou a chave e não atualizou no `.env`?
  - Se regenerar, DEVE atualizar em `backend/.env`
  - Reinicie o servidor: `npm start`

**Solução rápida:**
1. Vá para Melhor Envio > **Configurações** > **API**
2. **Regenere a chave** (gera uma nova e invalida a antiga)
3. Copie a nova chave
4. Atualize em `backend/.env`
5. Salve e reinicie o servidor: `npm start`
6. Teste novamente

#### Erro: "No carriers available" (Nenhuma transportadora disponível)

**Causa:** Nenhuma transportadora foi conectada no painel

**Solução:**
1. Vá para Melhor Envio > **Integrações**
2. Você vai ver várias transportadoras (Correios, Loggi, Jadlog, etc)
3. Clique em **Conectar** em pelo menos uma transportadora
4. Se pedir dados de acesso, configure (Correios geralmente não pede)
5. Aguarde ativar (pode levar alguns minutos)
6. Tente calcular o frete novamente

#### Erro: "Shipment parameters invalid"

**Causa:** Os dados que você está enviando não estão no formato correto

**Checklist:**
```json
{
  "from": {
    "postal_code": "01310100"  // ✅ Obrigatório, 8 dígitos
  },
  "to": {
    "postal_code": "12345678"  // ✅ Obrigatório, 8 dígitos
  },
  "products": [
    {
      "width": 15,     // ✅ Centímetros, número
      "height": 10,    // ✅ Centímetros, número
      "length": 20,    // ✅ Centímetros, número
      "weight": 2.5,   // ✅ Quilogramas, número
      "quantity": 1    // ✅ Número inteiro
    }
  ]
}
```

#### Erro: "CEP não existe na base de dados"

**Causa:** CEP válido mas não está cadastrado no Melhor Envio

**Solução:**
1. Verifique o CEP em [viacep.com.br](https://viacep.com.br)
2. Se existir, aguarde sincronização do Melhor Envio (até 24h)
3. Teste com outro CEP entanto (exemplo: `01310100`)

#### Erro: "Service not found" ao gerar etiqueta

**Causa:** O `service_id` que você está tentando usar não existe

**Solução:**
1. Primeiro calcule o frete para pegar os IDs válidos
2. Use um desses IDs ao gerar a etiqueta
3. Exemplo:
   ```json
   // Passo 1: Calcular frete (retorna lista de services)
   POST /api/delivery/calculate
   // Resposta:
   [
     {
       "id": 1,     // ← Use este ID!
       "name": "Sedex"
     }
   ]
   
   // Passo 2: Gerar etiqueta com esse ID
   POST /api/delivery/generate-label
   {
     "service": 1  // ← Use o ID retornado acima
   }
   ```

### Como debugar webhooks

**Adicione logs no `backend/controllers/webhookController.js`:**

```javascript
export const processWebhookEvent = async (event) => {
  // Log tudo que entra
  console.log('\n' + '='.repeat(60));
  console.log('📨 WEBHOOK RECEBIDO');
  console.log('Tipo:', event.type);
  console.log('ID:', event.id);
  console.log('Data:', JSON.stringify(event.data.object, null, 2));
  console.log('='.repeat(60));

  // ... resto do código
};
```

**Abra o terminal e rode:**
```bash
npm start
# Você vai ver todos os detalhes do webhook
```

**Ou use Stripe Dashboard para ver o histórico:**
1. [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Developers** > **Webhooks**
3. Clique no seu endpoint
4. Vá para **Recent events**
5. Clique em um evento para ver a resposta

---

## ✅ Checklist Final

Antes de colocar em produção:

- [ ] `STRIPE_PUBLIC_KEY` adicionado ao `.env`
- [ ] `STRIPE_SECRET_KEY` adicionado ao `.env`
- [ ] `STRIPE_WEBHOOK_SECRET` adicionado ao `.env`
- [ ] `MELHOR_ENVIO_API_KEY` adicionado ao `.env`
- [ ] Webhook testado com Stripe CLI localmente
- [ ] Dependências instaladas: `npm install stripe axios`
- [ ] Backend rodando sem erros
- [ ] Webhook responde com status 200
- [ ] Pedidos sendo atualizados quando webhook é recebido
- [ ] Emails estão sendo enviados (adicionar depois)
- [ ] Etiquetas estão sendo geradas (adicionar depois)

---

## 📞 Suporte

- **Stripe**: [support.stripe.com](https://support.stripe.com)
- **Stripe CLI Help**: `stripe help listen`
- **Melhor Envio**: [melhorenviobeta.com.br/suporte](https://www.melhorenviobeta.com.br/suporte)
- **Documentação Stripe Webhooks**: https://stripe.com/docs/webhooks
