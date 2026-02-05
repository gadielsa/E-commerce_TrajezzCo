import * as shippingService from '../services/shippingService.js';
import * as cepService from '../services/cepService.js';

/**
 * Buscar endereço por CEP
 */
export const buscarEnderecoPorCep = async (req, res) => {
  try {
    const { cep } = req.params;

    if (!cep) {
      return res.status(400).json({
        success: false,
        message: 'CEP é obrigatório'
      });
    }

    const resultado = await cepService.buscarCep(cep);

    res.json(resultado);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Calcular frete para carrinho
 */
export const calcularFrete = async (req, res) => {
  try {
    const { cepDestino, produtos } = req.body;

    // Validações
    if (!cepDestino) {
      return res.status(400).json({
        success: false,
        message: 'CEP de destino é obrigatório'
      });
    }

    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lista de produtos é obrigatória'
      });
    }

    // Calcular frete
    const resultado = await shippingService.calcularFrete({
      cepDestino,
      produtos
    });

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Criar etiqueta de envio
 */
export const criarEtiqueta = async (req, res) => {
  try {
    const { pedidoId, servicoId, remetente, destinatario } = req.body;

    if (!pedidoId || !servicoId || !destinatario) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos para criar etiqueta'
      });
    }

    const resultado = await shippingService.criarEtiqueta({
      pedidoId,
      servicoId,
      remetente,
      destinatario
    });

    res.json(resultado);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Rastrear envio
 */
export const rastrearEnvio = async (req, res) => {
  try {
    const { rastreio } = req.params;

    if (!rastreio) {
      return res.status(400).json({
        success: false,
        message: 'Código de rastreamento é obrigatório'
      });
    }

    const resultado = await shippingService.rastrearEnvio(rastreio);

    res.json(resultado);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  buscarEnderecoPorCep,
  calcularFrete,
  criarEtiqueta,
  rastrearEnvio
};
