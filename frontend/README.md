# Trajezz - E-Commerce de Sneakers

Uma plataforma moderna e responsiva de e-commerce especializada em sneakers e tênis. Desenvolvida com React, Tailwind CSS e Vite.

## 🚀 Características Principais

- ✅ **Catálogo de Produtos** - Grid responsivo com +10 produtos
- ✅ **Filtros Avançados** - Por categoria, preço, e busca em tempo real
- ✅ **Carrinho Dinâmico** - Adicione, remova e atualize quantidades
- ✅ **Checkout Completo** - Formulário de entrega e seleção de pagamento
- ✅ **Histórico de Pedidos** - Acompanhe suas compras
- ✅ **Autenticação** - Login e cadastro de usuários
- ✅ **Buscador** - Procure produtos rapidamente
- ✅ **Design Responsivo** - Funciona em mobile, tablet e desktop
- ✅ **Notificações** - Toast notifications para feedback do usuário
- ✅ **LocalStorage** - Persistência de dados (carrinho, pedidos, autenticação)

## 📋 Funcionalidades por Página

### Home
- Hero banner chamativo
- Últimos lançamentos
- Produtos mais vendidos
- Políticas da loja
- Newsletter subscription

### Coleção
- Listagem de todos os produtos
- Filtros por categoria e preço
- Ordenação por preço
- Busca em tempo real

### Produto
- Visualização detalhada
- Múltiplas imagens
- Seleção de tamanho
- Informações de desconto
- Produtos relacionados

### Carrinho
- Visualização de itens
- Alteração de quantidades
- Remoção de produtos
- Total com descontos

### Checkout
- Formulário de entrega
- Seleção de método de pagamento
- Resumo do pedido
- Aplicação de cupons

### Pedidos
- Histórico de compras
- Detalhes de cada pedido
- Status de entrega

### Sobre
- Informações da empresa
- Valores e missão
- Estatísticas
- Time

### Contato
- Formulário de contato
- Informações de suporte
- Redes sociais
- FAQ

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework JavaScript
- **Vite** - Build tool rápido
- **Tailwind CSS 4** - Estilização
- **React Router 7** - Roteamento
- **React Toastify** - Notificações
- **Context API** - Gerenciamento de estado

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/E-commerce_TrajezzCo.git
cd frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Abra no navegador**
```
http://localhost:5173
```

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductItem.jsx
│   │   ├── CartTotal.jsx
│   │   └── ...
│   ├── pages/               # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── Collection.jsx
│   │   ├── Product.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   └── ...
│   ├── context/             # Context API
│   │   └── ShopContext.jsx
│   ├── assets/              # Imagens e ícones
│   ├── App.jsx              # Componente raiz
│   ├── main.jsx             # Ponto de entrada
│   └── index.css            # Estilos globais
├── package.json
└── vite.config.js
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linter
npm run lint
```

## 💳 Métodos de Pagamento

- PIX (6% de desconto)
- Cartão de Crédito

## 📊 Dados Salvos Localmente

- `cartItems` - Itens do carrinho
- `orders` - Histórico de pedidos
- `userEmail` - Email do usuário logado
- `userName` - Nome do usuário

## 🎨 Paleta de Cores

- **Preto**: #000000 - Principal
- **Branco**: #FFFFFF - Fundo
- **Cinza**: #F5F5F5, #D1D1D1 - Secundário
- **Amarelo**: #FFCA00 - Destaque (Newsletter)

## 📱 Responsividade

- **Mobile**: < 640px (Tailwind: sm)
- **Tablet**: 640px - 1024px (Tailwind: md, lg)
- **Desktop**: > 1024px (Tailwind: xl, 2xl)

## 🚀 Deploy

### Vercel
```bash
npm run build
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📝 Cupons Disponíveis

- `TRAJEZZ10` - 10% de desconto na primeira compra
- PIX - 6% de desconto automático

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para suporte, envie um email para contact@trajezz.com

---

**Desenvolvido com ❤️ para fãs de sneakers** 👟

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
