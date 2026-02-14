import express from 'express';
import { sendContactMessage, checkEmailStatus } from '../controllers/contactController.js';

const router = express.Router();

// Rota para enviar mensagem de contato
router.post('/', sendContactMessage);

// Rota para verificar status do serviço de email
router.get('/status', checkEmailStatus);

export default router;
