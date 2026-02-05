import express from 'express';
import * as shippingController from '../controllers/shippingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/shipping/cep/:cep
 * @desc    Buscar endereço por CEP
 * @access  Public
 */
router.get('/cep/:cep', shippingController.buscarEnderecoPorCep);

/**
 * @route   POST /api/shipping/calcular
 * @desc    Calcular frete para produtos
 * @access  Public
 */
router.post('/calcular', shippingController.calcularFrete);

/**
 * @route   POST /api/shipping/etiqueta
 * @desc    Criar etiqueta de envio
 * @access  Private (Admin)
 */
router.post('/etiqueta', protect, shippingController.criarEtiqueta);

/**
 * @route   GET /api/shipping/rastrear/:rastreio
 * @desc    Rastrear envio
 * @access  Public
 */
router.get('/rastrear/:rastreio', shippingController.rastrearEnvio);

export default router;
