# TrajezzCo Backend API

Backend API para o e-commerce TrajezzCo desenvolvido com Node.js, Express e MongoDB.

## 🚀 Começando

### Pré-requisitos

- Node.js v18+ instalado
- MongoDB instalado localmente OU conta no MongoDB Atlas
- npm ou yarn

### Instalação

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais

5. Inicie o servidor:

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

O servidor estará rodando em: `http://localhost:5000`

## 📁 Estrutura do Projeto

```
backend/
├── config/          # Configurações (database, cloudinary, etc)
├── models/          # Models do MongoDB (User, Product, Order, etc)
├── routes/          # Rotas da API
├── controllers/     # Lógica de negócio
├── middleware/      # Middlewares (auth, upload, etc)
├── utils/           # Funções utilitárias
├── uploads/         # Pasta temporária para uploads
├── .env             # Variáveis de ambiente (não commitar)
├── .env.example     # Exemplo de variáveis de ambiente
├── server.js        # Arquivo principal
└── package.json
```

## 🔌 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Buscar produto por ID
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Atualizar produto (admin)
- `DELETE /api/products/:id` - Deletar produto (admin)

### Usuários
- `GET /api/users/profile` - Perfil do usuário logado
- `PUT /api/users/profile` - Atualizar perfil

### Pedidos
- `GET /api/orders` - Listar pedidos do usuário
- `POST /api/orders` - Criar novo pedido
- `GET /api/orders/:id` - Detalhes do pedido
- `GET /api/admin/orders` - Todos os pedidos (admin)
- `PUT /api/orders/:id/status` - Atualizar status (admin)

### Cupons
- `POST /api/coupons/validate` - Validar cupom
- `GET /api/admin/coupons` - Listar cupons (admin)
- `POST /api/admin/coupons` - Criar cupom (admin)

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer seu_token_aqui
```

## 🛠️ Tecnologias

- **Express.js** - Framework web
- **MongoDB** - Banco de dados
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Cloudinary** - Upload de imagens
- **Multer** - Upload de arquivos

## 📝 Notas

- Em desenvolvimento, a API aceita requisições de `http://localhost:5173`
- Em produção, configure o `FRONTEND_URL` no `.env`
- Sempre use HTTPS em produção
- Configure rate limiting para evitar abuso da API
