import api from '../config/api';

/**
 * Serviço de CEP e Frete - Frontend
 */

/**
 * Buscar endereço por CEP
 * @param {string} cep - CEP (com ou sem máscara)
 * @returns {Promise<Object>} Dados do endereço
 */
export const buscarCep = async (cep) => {
  try {
    const cepLimpo = cep.replace(/\D/g, '');
    
    const response = await api.get(`/shipping/cep/${cepLimpo}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar CEP');
  }
};

/**
 * Calcular frete para o carrinho
 * @param {string} cepDestino - CEP de destino
 * @param {Array} produtos - Lista de produtos do carrinho
 * @returns {Promise<Object>} Cotações de frete
 */
export const calcularFrete = async (cepDestino, produtos) => {
  try {
    const response = await api.post('/shipping/calcular', {
      cepDestino,
      produtos: produtos.map(item => ({
        nome: item.name,
        preco: item.price,
        quantidade: item.quantity || 1,
        peso: item.weight || 0.3,
        altura: item.height || 10,
        largura: item.width || 15,
        comprimento: item.length || 20
      }))
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao calcular frete');
  }
};

/**
 * Rastrear pedido
 * @param {string} codigoRastreio - Código de rastreamento
 * @returns {Promise<Object>} Status do envio
 */
export const rastrearEnvio = async (codigoRastreio) => {
  try {
    const response = await api.get(`/shipping/rastrear/${codigoRastreio}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao rastrear envio');
  }
};

/**
 * Formatar CEP (xxxxx-xxx)
 * @param {string} cep - CEP sem formatação
 * @returns {string} CEP formatado
 */
export const formatarCep = (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Validar CEP
 * @param {string} cep - CEP a validar
 * @returns {boolean} True se válido
 */
export const validarCep = (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
};

export default {
  buscarCep,
  calcularFrete,
  rastrearEnvio,
  formatarCep,
  validarCep
};
