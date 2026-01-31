# Backend - Integrações Completas Restauradas

## ✅ Status: TOTALMENTE RESTAURADO

Toda a estrutura do backend com integrações de API foi recriada com sucesso.

---

## 📦 Estrutura Criada

### Models (Banco de Dados)
- ✓ **User.js** - Esquema de usuários com endereços
- ✓ **Product.js** - Esquema de produtos com reviews
- ✓ **Order.js** - Esquema de pedidos com numeração automática
- ✓ **Coupon.js** - Esquema de cupons de desconto

### Controllers (Lógica de Negócio)
- ✓ **authController.js** - Registro, login, perfil (JWT)
- ✓ **productController.js** - CRUD de produtos (com admin check)
- ✓ **orderController.js** - Criação e gerenciamento de pedidos
- ✓ **couponController.js** - Validação e aplicação de cupons
- ✓ **uploadController.js** - Upload de imagens para Cloudinary

### Routes (Endpoints da API)
- ✓ **auth.js** - `/api/auth/*` - Autenticação
- ✓ **products.js** - `/api/products/*` - Gerenciamento de produtos
- ✓ **orders.js** - `/api/orders/*` - Gerenciamento de pedidos
- ✓ **coupons.js** - `/api/coupons/*` - Gerenciamento de cupons
- ✓ **users.js** - `/api/users/*` - Perfil e endereços
- ✓ **delivery.js** - `/api/delivery/*` - Cálculo de frete e CEP
- ✓ **payments.js** - `/api/payments/*` - Pagamentos e webhooks
- ✓ **upload.js** - `/api/upload/*` - Upload de imagens

### Services (Integrações Externas)
- ✓ **stripeService.js** - Stripe (cartões, PIX)
  - Criar payment intent
  - Confirmar pagamento
  - Reembolsos
  - Verificação de webhook
  
- ✓ **mercadoPagoService.js** - Mercado Pago (PIX, cartão)
  - Criar pagamentos
  - Preferences/Checkout
  - Reembolsos
  - Webhooks
  
- ✓ **melhorEnvioService.js** - Melhor Envio (cálculo de frete)
  - Cálculo de frete por CEP
  - Validação de CEP (ViaCEP)
  - Rastreamento
  - Geração de labels

### Middleware
- ✓ **auth.js** - Autenticação JWT em rotas protegidas

### Config
- ✓ **database.js** - Configuração MongoDB
- ✓ **cloudinary.js** - Configuração Cloudinary

---

## 🔌 Endpoints Disponíveis

### Autenticação
```
POST   /api/auth/register          - Registrar novo usuário
POST   /api/auth/login             - Fazer login
GET    /api/auth/profile           - Obter perfil (protegido)
PUT    /api/auth/profile           - Atualizar perfil (protegido)
```

### Produtos
```
GET    /api/products               - Listar produtos (com filtros)
GET    /api/products/:id           - Obter detalhes do produto
POST   /api/products               - Criar produto (admin)
PUT    /api/products/:id           - Atualizar produto (admin)
DELETE /api/products/:id           - Deletar produto (admin)
```

### Pedidos
```
POST   /api/orders                 - Criar pedido (protegido)
GET    /api/orders                 - Listar pedidos do usuário (protegido)
GET    /api/orders/:id             - Detalhes do pedido (protegido)
PUT    /api/orders/:id/status      - Atualizar status (admin)
PUT    /api/orders/:id/payment-status - Atualizar status pagamento (admin)
```

### Cupons
```
POST   /api/coupons                - Criar cupom (admin)
GET    /api/coupons                - Listar cupons (admin)
POST   /api/coupons/validate       - Validar cupom (protegido)
POST   /api/coupons/apply          - Aplicar cupom (protegido)
DELETE /api/coupons/:id            - Deletar cupom (admin)
```

### Usuários
```
GET    /api/users/profile          - Obter perfil (protegido)
PUT    /api/users/profile          - Atualizar perfil (protegido)
POST   /api/users/address          - Adicionar endereço (protegido)
PUT    /api/users/address/:id      - Atualizar endereço (protegido)
DELETE /api/users/address/:id      - Deletar endereço (protegido)
```

### Entrega
```
GET    /api/delivery/address/:cep  - Obter endereço por CEP
POST   /api/delivery/calculate     - Calcular frete (protegido)
GET    /api/delivery/track/:code   - Rastrear pedido
```

### Pagamentos
```
POST   /api/payments/create-intent           - Criar payment intent Stripe (protegido)
POST   /api/payments/mercadopago-preference  - Criar preference MP (protegido)
POST   /api/payments/webhook                 - Webhook Stripe
POST   /api/payments/webhook-mercadopago     - Webhook Mercado Pago
POST   /api/payments/refund                  - Solicitar reembolso (protegido)
```

### Upload
```
POST   /api/upload/image            - Upload de uma imagem (protegido)
POST   /api/upload/images           - Upload múltiplas imagens (protegido)
DELETE /api/upload/image            - Deletar imagem (protegido)
```

---

## 🔐 Recursos de Segurança

- ✓ Autenticação JWT com expiração (7 dias padrão)
- ✓ Hash de senhas com bcryptjs
- ✓ Role-based access control (user/admin)
- ✓ Validação de webhook Stripe
- ✓ CORS configurado
- ✓ Proteção de rotas sensíveis

---

## 🚀 Como Iniciar

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente
Editar `.env` com suas credenciais:
```bash
MONGODB_URI=sua_conexao_mongodb
STRIPE_SECRET_KEY=sk_test_...
MERCADOPAGO_ACCESS_TOKEN=APP_USR_...
MELHOR_ENVIO_API_KEY=seu_token
CLOUDINARY_CLOUD_NAME=seu_cloud
```

### 3. Iniciar Servidor
```bash
npm start              # Produção
# ou
npm run dev           # Desenvolvimento (com nodemon)
```

Servidor rodará em: `http://localhost:5000`

---

## 📝 Frontend Integration

O frontend pode agora consumir estes endpoints. Exemplo:

```javascript
// Buscar produtos
const response = await fetch('http://localhost:5000/api/products');
const products = await response.json();

// Criar pedido
const order = await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
});
```

---

## ✨ Próximos Passos

1. Instalar dependências do backend: `npm install`
2. Configurar credenciais no `.env`
3. Iniciar servidor: `npm start`
4. Testar endpoints via Postman/Insomnia
5. Integrar com frontend (ShopContext.jsx já está configurado)

---

**Tudo restaurado e pronto para desenvolvimento! 🎉**
