# 💳 Guia de Pagamentos - Trajezz E-commerce

## ✨ Funcionalidades Implementadas

### 🔹 PIX
- Geração automática de QR Code
- Código Pix Copia e Cola
- **6% de desconto automático**
- Validação de expiração (30 minutos)
- Modal interativo com instruções

### 🔹 Cartão de Crédito
- Validação completa dos dados (Algoritmo de Luhn)
- Detecção automática de bandeira
- Parcelamento inteligente (até 12x)
- Sem juros até 3x
- Formatação automática dos campos

## 🎯 Como Usar

### Para o Cliente

#### Pagamento com PIX
1. Adicione produtos ao carrinho
2. Vá para o checkout
3. Preencha seus dados de entrega
4. Selecione **PIX** como método de pagamento
5. Clique em "Finalizar Pedido"
6. Um modal será exibido com:
   - QR Code para escanear
   - Código para copiar e colar
   - Valor com desconto aplicado
7. Pague usando seu app bancário
8. Acompanhe seu pedido em "Meus Pedidos"

#### Pagamento com Cartão
1. Adicione produtos ao carrinho
2. Vá para o checkout
3. Preencha seus dados de entrega
4. Selecione **Cartão de Crédito**
5. Preencha os dados do cartão:
   - Número do cartão (detecta bandeira automaticamente)
   - Nome como está no cartão
   - Validade (MM/AA)
   - CVV
6. Escolha o número de parcelas
7. Clique em "Finalizar Pedido"
8. Confirmação imediata!

## 🧪 Testar Localmente

### Dados de Teste - Cartão de Crédito

#### ✅ Cartões que Serão Aprovados

**Visa**
```
Número: 4111 1111 1111 1111
Nome: SEU NOME
Validade: 12/25
CVV: 123
```

**Mastercard**
```
Número: 5555 5555 5555 4444
Nome: SEU NOME  
Validade: 12/25
CVV: 123
```

**Elo**
```
Número: 6362 9700 0000 0005
Nome: SEU NOME
Validade: 12/25
CVV: 123
```

#### ❌ Cartões que Serão Recusados

**Visa Recusado**
```
Número: 4000 0000 0000 0002
```

**Mastercard Recusado**
```
Número: 5105 1051 0510 5100
```

### PIX
- Qualquer compra gerará um QR Code de teste
- O código expira em 30 minutos
- Status do pedido: "Aguardando pagamento"

## 💰 Regras de Parcelamento

| Parcelas | Condição | Exemplo (R$ 600) |
|----------|----------|------------------|
| 1x | À vista | R$ 600,00 |
| 2-3x | Sem juros | 3x de R$ 200,00 |
| 4-12x | Com juros (2,99% a.m.) | 6x de R$ 106,73 |

**Parcela mínima:** R$ 50,00

## 🎨 Descontos Automáticos

### PIX: 6% OFF
```
Subtotal: R$ 500,00
Frete: R$ 25,00
Total: R$ 525,00
Com PIX (6% desc): R$ 493,50
Economia: R$ 31,50
```

### Compras acima de R$ 500
```
Subtotal: R$ 500,00
Frete: GRÁTIS
Total: R$ 500,00
```

## 🔐 Segurança

### O que NÃO é armazenado:
- ❌ Número completo do cartão
- ❌ CVV
- ❌ Dados bancários

### O que É armazenado:
- ✅ Últimos 4 dígitos do cartão
- ✅ Bandeira do cartão
- ✅ Número de parcelas
- ✅ ID da transação

## 🚀 Próximos Passos (Produção)

### Para ativar pagamentos reais:

1. **Escolha um Gateway**
   - Mercado Pago (recomendado para Brasil)
   - Stripe
   - PagSeguro

2. **Crie uma conta**
   - Acesse o site do gateway escolhido
   - Crie uma conta empresarial
   - Obtenha as credenciais (API Keys)

3. **Configure Webhook PIX**
   - Para confirmação automática de pagamento
   - Atualize o status do pedido em tempo real

4. **Teste em Sandbox**
   - Use ambiente de testes do gateway
   - Valide todos os fluxos

5. **Ative Produção**
   - Troque para credenciais de produção
   - Configure certificado SSL (HTTPS obrigatório)
   - Teste com compras reais

## 📊 Visualizando Pedidos

Após finalizar a compra, acesse:
- Menu → **Meus Pedidos**
- Veja status, detalhes e método de pagamento

### Status Possíveis
- 🟡 **Aguardando pagamento** (PIX)
- 🟢 **Pagamento aprovado** (Cartão)
- 🚚 **Pronto para entrega**
- ✅ **Entregue**

## 🐛 Problemas Comuns

### "Dados do cartão inválidos"
- Verifique se o número do cartão está correto
- Confirme a validade (MM/AA)
- CVV deve ter 3 ou 4 dígitos

### QR Code não aparece
- Certifique-se de selecionar PIX
- Preencha todos os campos de entrega
- Verifique sua conexão de internet

### "Por favor, preencha todos os campos"
- Todos os campos são obrigatórios
- Verifique dados de entrega E dados de pagamento

## 💡 Dicas

1. **Use PIX para economizar 6%**
2. **Parcele sem juros até 3x**
3. **Compre acima de R$ 500 para frete grátis**
4. **Salve o código PIX antes de fechar o modal**
5. **Acompanhe seu pedido em tempo real**

## 📱 Suporte

- Email: suporte@trajezz.com.br
- WhatsApp: (11) 9999-9999
- Horário: Segunda a Sexta, 9h às 18h

---

**Desenvolvido com ❤️ pela equipe Trajezz**
