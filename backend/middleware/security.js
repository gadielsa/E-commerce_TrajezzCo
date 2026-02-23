import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// ============================================
// 🛡️ HELMET - Proteção de Headers HTTP
// ============================================
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
});

// ============================================
// 🚫 RATE LIMITING GLOBAL
// ============================================
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true, // Retorna info em `RateLimit-*` headers
  legacyHeaders: false, // Desabilita `X-RateLimit-*` headers
  skip: (req) => {
    // Não aplicar rate limit para health check
    return req.path === '/api/health';
  },
});

// ============================================
// 🔐 RATE LIMITING PARA LOGIN (Brute Force Protection)
// ============================================
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Não conta tentativas bem-sucedidas
  skipFailedRequests: false, // Conta tentativas falhadas
});

// ============================================
// 📋 RATE LIMITING PARA REGISTRO
// ============================================
export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros por hora por IP
  message: 'Muitas tentativas de registro. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// 🔓 RATE LIMITING PARA ENDPOINTS PÚBLICOS
// ============================================
export const publicApiRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 30, // máximo 30 requisições por IP
  message: 'Limite de requisições excedido. Aguarde antes de tentar novamente.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// ⚠️ RATE LIMITING PARA CONTATO (Anti-Spam)
// ============================================
export const contactRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 mensagens por hora por IP
  message: 'Você enviou muitas mensagens. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// 💳 RATE LIMITING PARA PAGAMENTOS
// ============================================
export const paymentRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // máximo 5 tentativas de pagamento por minuto
  message: 'Muitas tentativas de pagamento. Aguarde antes de tentar novamente.',
  standardHeaders: true,
  legacyHeaders: false,
  store: undefined, // Utili za a store em memória por padrão
});
