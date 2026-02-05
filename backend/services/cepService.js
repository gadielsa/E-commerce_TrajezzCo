import axios from 'axios';

/**
 * Serviço para busca de endereços por CEP
 * Usa ViaCEP como API principal
 */

// Buscar endereço por CEP
export const buscarCep = async (cep) => {
  try {
    // Remover caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');

    // Validar formato do CEP
    if (cepLimpo.length !== 8) {
      throw new Error('CEP inválido. Digite 8 dígitos.');
    }

    // Buscar no ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      timeout: 10000
    });

    // Verificar se o CEP foi encontrado
    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      success: true,
      data: {
        cep: response.data.cep,
        logradouro: response.data.logradouro,
        complemento: response.data.complemento,
        bairro: response.data.bairro,
        cidade: response.data.localidade,
        estado: response.data.uf,
        ibge: response.data.ibge,
        gia: response.data.gia,
        ddd: response.data.ddd,
        siafi: response.data.siafi
      }
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout ao buscar CEP. Tente novamente.');
    }

    throw new Error(error.message || 'Erro ao buscar CEP');
  }
};

// Validar CEP (formato)
export const validarCep = (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
};

// Formatar CEP (xxxxx-xxx)
export const formatarCep = (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export default {
  buscarCep,
  validarCep,
  formatarCep
};
