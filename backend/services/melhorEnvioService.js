const axios = require('axios');

const melhorEnvio = axios.create({
  baseURL: 'https://api.melhorenvio.com.br',
  headers: {
    'Authorization': `Bearer ${process.env.MELHOR_ENVIO_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

exports.calculateShipping = async (destinyCEP, weight = null, width = null, height = null, length = null) => {
  try {
    const payload = {
      from: {
        postal_code: process.env.MELHOR_ENVIO_ORIGIN_ZIP || '01310100'
      },
      to: {
        postal_code: destinyCEP.replace(/\D/g, '')
      },
      products: [
        {
          id: '1',
          width: width || process.env.MELHOR_ENVIO_DEFAULT_WIDTH || 15,
          height: height || process.env.MELHOR_ENVIO_DEFAULT_HEIGHT || 10,
          length: length || process.env.MELHOR_ENVIO_DEFAULT_LENGTH || 20,
          weight: weight || process.env.MELHOR_ENVIO_DEFAULT_WEIGHT || 0.5
        }
      ]
    };

    const response = await melhorEnvio.post('/shipment/calculate', payload);

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Melhor Envio error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

exports.getAddressByCEP = async (cep) => {
  try {
    const cleanCEP = cep.replace(/\D/g, '');
    
    const response = await axios.get(`https://viacep.com.br/ws/${cleanCEP}/json/`);

    if (response.data.erro) {
      return {
        success: false,
        error: 'CEP not found'
      };
    }

    return {
      success: true,
      data: {
        street: response.data.logradouro,
        neighborhood: response.data.bairro,
        city: response.data.localidade,
        state: response.data.uf,
        zipCode: cep
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

exports.generateLabel = async (shipmentId) => {
  try {
    const response = await melhorEnvio.post(`/shipment/${shipmentId}/label`, {
      type: 'M'
    });

    return {
      success: true,
      label: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

exports.trackShipment = async (trackingNumber) => {
  try {
    const response = await melhorEnvio.get(`/shipment/tracking`, {
      params: {
        code: trackingNumber
      }
    });

    return {
      success: true,
      tracking: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
