# Integração de Pagamentos - Trajezz E-commerce

## 📋 Visão Geral

Este documento descreve a implementação dos sistemas de pagamento PIX e Cartão de Crédito no e-commerce.

## 💳 Métodos de Pagamento Implementados

### 1. PIX
- ✅ Geração de QR Code
- ✅ Código copiável (Pix Copia e Cola)
- ✅ 6% de desconto automático
- ✅ Prazo de expiração: 30 minutos
- ✅ Modal interativo com instruções

### 2. Cartão de Crédito
- ✅ Validação de dados do cartão (Algoritmo de Luhn)
- ✅ Detecção automática de bandeira (Visa, Mastercard, Elo, etc.)
- ✅ Parcelamento em até 12x
- ✅ Sem juros até 3x
- ✅ Parcela mínima: R$ 50,00
- ✅ Formatação automática de campos

## 🔧 Funções Implementadas

### ShopContext.jsx

#### `generatePixPayment(amount, orderId)`
Gera um código PIX para pagamento.

**Parâmetros:**
- `amount` (number): Valor do pagamento
- `orderId` (number): ID do pedido

**Retorna:**
```javascript
{
  pixCode: "00020126580014...", // Código PIX completo
  qrCode: "https://api.qrserver.com/...", // URL do QR Code
  amount: 299.99,
  expiresIn: 30 // Minutos
}
```

#### `processCreditCardPayment(cardData, amount)`
Processa pagamento com cartão de crédito.

**Parâmetros:**
```javascript
cardData = {
  number: "4111 1111 1111 1111",
  name: "JOÃO SILVA",
  expiry: "12/25",
  cvv: "123",
  installments: 3
}
```

**Retorna:**
```javascript
{
  success: true,
  transactionId: "TRZ1704067200ABC123",
  cardBrand: "Visa",
  lastDigits: "1111",
  installments: 3,
  message: "Pagamento aprovado com sucesso"
}
```

#### `validateCreditCard(cardData)`
Valida dados do cartão usando o algoritmo de Luhn.

**Retorna:** `true` ou `false`

#### `detectCardBrand(cardNumber)`
Detecta a bandeira do cartão.

**Bandeiras suportadas:**
- Visa
- Mastercard
- American Express
- Elo
- Hipercard
- Maestro
- Discover
- JCB

#### `calculateInstallments(amount, maxInstallments = 12)`
Calcula opções de parcelamento.

**Retorna:**
```javascript
[
  {
    number: 1,
    value: 299.99,
    total: 299.99,
    interest: false,
    label: "À vista: R$ 299.99"
  },
  {
    number: 3,
    value: 99.99,
    total: 299.99,
    interest: false,
    label: "3x de R$ 99.99 sem juros"
  },
  // ...
]
```

## 🚀 Integração com Gateway de Pagamento (Produção)

### Para PIX

Atualmente usa uma simulação. Para produção, integre com:

#### Mercado Pago
```javascript
const mercadopago = require('mercadopago');
mercadopago.configure({ access_token: 'SEU_ACCESS_TOKEN' });

const payment_data = {
  transaction_amount: amount,
  description: `Pedido #${orderId}`,
  payment_method_id: 'pix',
  payer: {
    email: email,
  }
};

const payment = await mercadopago.payment.create(payment_data);
// payment.point_of_interaction.transaction_data.qr_code
// payment.point_of_interaction.transaction_data.qr_code_base64
```

#### PagSeguro
```javascript
const pagseguro = require('pagseguro');

const payment = await pagseguro.charge.create({
  amount: {
    value: amount * 100, // Valor em centavos
    currency: 'BRL'
  },
  charge_type: 'PIX',
  reference_id: orderId
});

// payment.qr_codes[0].text (código PIX)
// payment.qr_codes[0].links[0].href (QR Code image)
```

### Para Cartão de Crédito

#### Stripe
```javascript
const stripe = require('stripe')('sk_test_...');

const paymentIntent = await stripe.paymentIntents.create({
  amount: amount * 100, // Valor em centavos
  currency: 'brl',
  payment_method_types: ['card'],
  payment_method_data: {
    type: 'card',
    card: {
      number: cardNumber,
      exp_month: expMonth,
      exp_year: expYear,
      cvc: cvv
    }
  }
});
```

#### Mercado Pago
```javascript
const payment_data = {
  transaction_amount: amount,
  token: cardToken, // Token gerado pelo MercadoPago.js
  description: `Pedido #${orderId}`,
  installments: installments,
  payment_method_id: 'visa', // detectado automaticamente
  payer: {
    email: email,
  }
};

const payment = await mercadopago.payment.create(payment_data);
```

## 🔐 Segurança

### Boas Práticas Implementadas

1. **Validação Client-Side**
   - Algoritmo de Luhn para cartões
   - Formatação automática
   - Validação de campos obrigatórios

2. **Dados Sensíveis**
   - Nunca armazene o CVV
   - Armazene apenas os últimos 4 dígitos do cartão
   - Use tokens para transações recorrentes

3. **HTTPS Obrigatório**
   - Sempre use HTTPS em produção
   - Configure certificado SSL válido

4. **PCI DSS Compliance**
   - Não armazene dados completos do cartão
   - Use gateways certificados
   - Implemente criptografia

## 📊 Fluxo de Pagamento

### PIX
1. Cliente escolhe PIX como método
2. Preenche dados de entrega
3. Clica em "Finalizar Pedido"
4. Sistema gera QR Code e código PIX
5. Modal exibe QR Code
6. Cliente paga via app do banco
7. Sistema confirma pagamento (webhook)
8. Pedido é processado

### Cartão de Crédito
1. Cliente escolhe Cartão
2. Preenche dados do cartão
3. Escolhe parcelamento
4. Clica em "Finalizar Pedido"
5. Sistema valida dados
6. Processa com gateway
7. Confirmação imediata
8. Pedido é processado

## 🧪 Testes

### Cartões de Teste

#### Visa
- **Aprovado:** 4111 1111 1111 1111
- **Recusado:** 4000 0000 0000 0002

#### Mastercard
- **Aprovado:** 5555 5555 5555 4444
- **Recusado:** 5105 1051 0510 5100

#### Elo
- **Aprovado:** 6362 9700 0000 0005

### Dados de Teste
- **Validade:** Qualquer data futura (ex: 12/25)
- **CVV:** Qualquer 3 dígitos (ex: 123)
- **Nome:** Qualquer nome

## 📱 Responsividade

Todos os componentes são totalmente responsivos:
- Mobile First
- Formulários adaptáveis
- Modal centralizado
- Touch-friendly

## 🐛 Tratamento de Erros

### Mensagens Implementadas
- ❌ "Dados do cartão inválidos"
- ❌ "Por favor, preencha todos os campos"
- ❌ "Seu carrinho está vazio"
- ✅ "Pagamento aprovado com sucesso"
- ✅ "Código PIX copiado!"
- ✅ "Pedido realizado! Aguardando pagamento PIX"

## 📈 Melhorias Futuras

1. **Webhook para PIX**
   - Confirmação automática de pagamento
   - Atualização em tempo real

2. **Salvamento de Cartões**
   - Tokenização segura
   - Checkout em 1 clique

3. **Outros Métodos**
   - Boleto bancário
   - PayPal
   - Apple Pay / Google Pay

4. **Analytics**
   - Taxa de conversão por método
   - Abandono de carrinho
   - Análise de parcelamento

## 🔗 Links Úteis

- [Mercado Pago Docs](https://www.mercadopago.com.br/developers/pt/docs)
- [Stripe Docs](https://stripe.com/docs)
- [PagSeguro Docs](https://dev.pagseguro.uol.com.br/docs)
- [PIX BR Code Spec](https://www.bcb.gov.br/estabilidadefinanceira/pix)

## 📞 Suporte

Para dúvidas sobre a implementação, consulte:
- ShopContext.jsx (linha 100+)
- Checkout.jsx (linha 50+)
