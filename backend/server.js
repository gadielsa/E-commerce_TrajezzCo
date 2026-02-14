import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar Express
const app = express();

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    return next();
  }

  return express.json({ limit: '10mb' })(req, res, next);
});
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    return next();
  }

  return express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'API TrajezzCo está rodando! 🚀',
    version: '1.0.0',
    status: 'online'
  });
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Importar rotas
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import couponRoutes from './routes/coupons.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';
import paymentRoutes from './routes/payments.js';
import shippingRoutes from './routes/shipping.js';
import contactRoutes from './routes/contact.js';

// Usar rotas
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/contact', contactRoutes);

// Middleware de erro 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});
