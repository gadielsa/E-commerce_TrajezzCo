import express from 'express';
import { sendContactMessage, checkEmailStatus } from '../controllers/contactController.js';
import { contactRateLimit } from '../middleware/security.js';

const router = express.Router();

// Rota para enviar mensagem de contato (com proteção contra spam)
router.post('/', contactRateLimit, sendContactMessage);

// Rota para verificar status do serviço de email
router.get('/status', checkEmailStatus);

export default router;
