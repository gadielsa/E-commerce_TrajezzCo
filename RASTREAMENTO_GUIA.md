# 🚚 Guia de Rastreamento de Pedidos - Melhor Envio

## 1. Visão Geral da Implementação

O sistema de rastreamento permite que:
- **Usuários logados** rastreiem seus pedidos através da página `/pedidos`
- **Usuários públicos** rastreiem pedidos através de `/rastrear` usando número do pedido + código de rastreamento
- **Admins** gerenciem e atualizem o status de rastreamento

## 2. Arquitetura

### Backend

#### **Models**
- `Order.js` - Contém campo `trackingCode` para armazenar código de rastreamento Melhor Envio

#### **Services**
- `shippingService.js` - Funções:
  - `calcularFrete()` - Calcula frete
  - `criarEtiqueta()` - Cria etiqueta e gera código de rastreamento
  - `rastrearEnvio(rastreio)` - Consulta status na API Melhor Envio

#### **Controllers**
- `orderController.js` - Novos endpoints:
  - `trackOrder(req, res)` - Rastreia pedido autenticado (usuário logado)
  - `trackOrderPublic(req, res)` - Rastreia pedido publicamente (sem login)

#### **Routes**
- `orders.js`:
  - `GET /api/orders/:id/track` - Rastreamento autenticado
  - `POST /api/orders/public/track` - Rastreamento público

### Frontend

#### **Services**
- `trackingService.js` - Funções:
  - `trackOrderAuthenticated(orderId)` - Chama API de rastreamento autenticada
  - `trackOrderPublic(orderNumber, trackingCode)` - Chama API de rastreamento público
  - `formatTrackingInfo(tracking)` - Formata dados para exibição

#### **Pages**
- `TrackingPublic.jsx` - Página pública de rastreamento em `/rastrear`
- `Orders.jsx` - Atualizada com modal de rastreamento

#### **Routes**
- `App.jsx`:
  - `/rastrear` - Página de rastreamento público
  - `/pedidos/:id/track` - Rastreamento (integrado no modal)

## 3. Fluxo de Uso

### Para Usuários Logados

1. Usuário acessa `/pedidos`
2. Visualiza lista de pedidos
3. Clica em "Rastrear Pedido" para um pedido enviado
4. Modal abre mostrando histórico de rastreamento em tempo real

### Para Usuários Públicos

1. Usuário acessa `/rastrear`
2. Preenche:
   - Número do Pedido (ex: TRZ17394521234)
   - Código de Rastreamento (ex: AA123456789BR)
3. Sistema valida e exibe status do pedido + histórico

## 4. Integração com Melhor Envio API

### Dados Necessários

```javascript
// No .env backend
MELHOR_ENVIO_BASE_URL=https://sandbox.melhorenvio.com.br/api/v2
MELHOR_ENVIO_API_KEY=seu_token_aqui
```

### Fluxo Completo de Entrega

```
1. Pedido criado → Status: "Aguardando pagamento"
   ↓
2. Pagamento confirmado → Status: "Pagamento aprovado"
   ↓
3. Admin gera etiqueta (criarEtiqueta) → Recebe tracking code
   ↓
4. Admin atualiza pedido com tracking code
   putOrder('/api/orders/:id/status', { trackingCode: 'AA123456789BR' })
   ↓
5. Usuário rastreia com o código
   GET /api/orders/:id/track
```

## 5. Dados Retornados na API

### GET /api/orders/:id/track (Autenticado)

```json
{
  "success": true,
  "order": {
    "orderNumber": "TRZ17394521234",
    "status": "Enviado",
    "statusHistory": [...],
    "trackingCode": "AA123456789BR",
    "tracking": {
      "success": true,
      "status": "in_transit",
      "mensagem": "Objeto em trânsito",
      "historico": [
        {
          "evento": "Saiu para entrega",
          "data": "2026-02-13 10:30",
          "local": "São Paulo, SP",
          "detalhes": "Saiu da unidade..."
        }
      ]
    }
  }
}
```

### POST /api/orders/public/track (Público)

```json
{
  "success": true,
  "order": {
    "orderNumber": "TRZ17394521234",
    "status": "Em trânsito",
    "statusHistory": [...],
    "deliveryInfo": {
      "city": "São Paulo",
      "state": "SP",
      "address": "Rua X, 123"
    },
    "trackingCode": "AA123456789BR",
    "tracking": {...}
  }
}
```

## 6. Como Gerar Código de Rastreamento

### Opção 1: Admin Panel (Recomendado)

1. Acesse `/admin`
2. Vá para "Pedidos"
3. Selecione pedido com status "Pagamento aprovado"
4. Clique "Gerar Etiqueta"
5. Sistema retorna tracking code
6. Admin salva no pedido

### Opção 2: Programaticamente

```javascript
// Backend - gerar etiqueta e salvar tracking code
import { criarEtiqueta, rastrearEnvio } from '../services/shippingService.js'

const order = await Order.findById(orderId);

try {
  const etiqueta = await criarEtiqueta({
    destinatario: {
      nome: order.deliveryInfo.firstName,
      email: order.deliveryInfo.email,
      telefone: order.deliveryInfo.phone,
      cep: order.deliveryInfo.zipCode,
      endereco: order.deliveryInfo.address,
      numero: order.deliveryInfo.number,
      complemento: order.deliveryInfo.complement,
      cidade: order.deliveryInfo.city,
      estado: order.deliveryInfo.state,
      produtos: order.items.map(item => ({
        nome: item.name,
        quantidade: item.quantity,
        preco: item.price
      })),
      valorDeclarado: order.totalAmount
    }
  });

  // Salvar tracking code no pedido
  order.trackingCode = etiqueta.protocolo;
  order.status = 'Enviado';
  await order.save();

} catch (error) {
  console.error('Erro ao gerar etiqueta:', error);
}
```

## 7. Status Mapeados

A API Melhor Envio retorna status que são mapeados para português:

| Status Melhor Envio | Português | Cor |
|-------------------|-----------|-----|
| `received` | Recebido | Cinza |
| `forwarded` | Encaminhado | Amarelo |
| `in_transit` | Em trânsito | Azul |
| `on_delivery` | Saiu para entrega | Roxo |
| `delivered` | Entregue | Verde |
| `returned` | Devolvido | Vermelho |
| `exception` | Exceção | Laranja |
| `cancelled` | Cancelado | Vermelho |

## 8. Testando Localmente

### 1. Criar um pedido
```bash
POST http://localhost:5000/api/orders
Body:
{
  "items": [...],
  "deliveryInfo": {...},
  "paymentMethod": "pix",
  "subtotal": 100,
  "shippingCost": 15,
  "totalAmount": 115
}
```

### 2. Simular pagamento aprovado
```bash
PUT http://localhost:5000/api/orders/:orderId/payment
Body:
{
  "paymentStatus": "paid",
  "status": "Pagamento aprovado"
}
```

### 3. Adicionar tracking code (Admin)
```bash
PUT http://localhost:5000/api/orders/:orderId/status
Headers: Authorization: Bearer admin_token
Body:
{
  "status": "Enviado",
  "trackingCode": "AA123456789BR"
}
```

### 4. Rastrear pedido
```bash
# Autenticado
GET http://localhost:5000/api/orders/:orderId/track
Headers: Authorization: Bearer user_token

# Público
POST http://localhost:5000/api/orders/public/track
Body:
{
  "orderNumber": "TRZ17394521234",
  "trackingCode": "AA123456789BR"
}
```

## 9. Sandbox vs Production

A API utiliza `MELHOR_ENVIO_BASE_URL` do .env:

```bash
# Desenvolvimento (Sandbox - sem cobranças reais)
MELHOR_ENVIO_BASE_URL=https://sandbox.melhorenvio.com.br/api/v2

# Produção (cobrança real)
MELHOR_ENVIO_BASE_URL=https://api.melhorenvio.com.br/api/v2
```

## 10. Mensagens de Erro Comuns

| Erro | Causa | Solução |
|------|-------|--------|
| `Código de rastreamento ainda não disponível` | Pedido sem tracking code | Admin precisa gerar etiqueta |
| `Pedido não encontrado` | Dados incorretos | Verificar número e código |
| `Token inválido` | API key expirada/inválida | Atualizar token no .env |

## 11. Próximos Passos

- [ ] Webhook para atualizar status automaticamente
- [ ] Email de notificação quando status muda
- [ ] SMS de rastreamento (integração com Twilio)
- [ ] Timeline visual completa no frontend
- [ ] Integração com mais transportadoras

## 12. Arquivos Modificados

### Backend
- `backend/models/Order.js` - Campo trackingCode já existente
- `backend/services/shippingService.js` - Funções de rastreamento
- `backend/controllers/orderController.js` - ✨ NOVO: trackOrder, trackOrderPublic
- `backend/routes/orders.js` - ✨ NOVO: Rotas de rastreamento

### Frontend
- `frontend/src/services/trackingService.js` - ✨ NOVO
- `frontend/src/pages/TrackingPublic.jsx` - ✨ NOVO
- `frontend/src/pages/Orders.jsx` - Atualizado com modal
- `frontend/src/App.jsx` - Rota /rastrear adicionada
- `frontend/src/components/Footer.jsx` - Link para rastreamento
