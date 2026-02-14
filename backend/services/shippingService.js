import axios from 'axios';

/**
 * Serviço de cálculo e geração de fretes
 * Integração com Melhor Envio API
 */

const MELHOR_ENVIO_API = process.env.MELHOR_ENVIO_BASE_URL || 'https://sandbox.melhorenvio.com.br/api/v2';
const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_API_KEY;

// Cliente axios configurado
const melhorEnvioClient = axios.create({
  baseURL: MELHOR_ENVIO_API,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`
  },
  timeout: 15000
});

/**
 * Calcular frete para um pedido
 * @param {Object} params - Parâmetros do frete
 * @param {string} params.cepDestino - CEP de destino
 * @param {Array} params.produtos - Lista de produtos
 * @returns {Promise<Object>} Cotações disponíveis
 */
export const calcularFrete = async ({ cepDestino, produtos }) => {
  try {
    // Validar CEP
    const cepLimpo = cepDestino.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      throw new Error('CEP de destino deve conter 8 dígitos');
    }

    // Validar produtos
    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      throw new Error('Lista de produtos é obrigatória');
    }

    // CEP de origem (seu armazém/loja)
    const cepOrigem = process.env.CEP_ORIGEM || '01310100';
    console.log(`🚀 Iniciando cálculo de frete: ${cepDestino} → ${cepOrigem}`);

    // Calcular dimensões e peso total
    let pesoTotal = 0;
    let volumeTotal = { altura: 0, largura: 0, comprimento: 0 };

    produtos.forEach(produto => {
      const peso = parseFloat(produto.peso) || 0.3; // kg
      const quantidade = parseInt(produto.quantidade) || 1;
      const preco = parseFloat(produto.preco) || 0;
      
      pesoTotal += peso * quantidade;
      
      // Dimensões padrão se não especificadas (cm)
      volumeTotal.altura = Math.max(volumeTotal.altura, parseInt(produto.altura) || 10);
      volumeTotal.largura = Math.max(volumeTotal.largura, parseInt(produto.largura) || 15);
      volumeTotal.comprimento += (parseInt(produto.comprimento) || 20) * quantidade;
      
      console.log(`  📦 Produto: ${produto.nome || 'N/A'} - Peso: ${peso}kg x ${quantidade}, Preço: R$ ${preco.toFixed(2)}`);
    });

    // Limites do Melhor Envio
    pesoTotal = Math.max(0.3, Math.min(pesoTotal, 30)); // Entre 300g e 30kg
    volumeTotal.altura = Math.max(2, Math.min(volumeTotal.altura, 105));
    volumeTotal.largura = Math.max(11, Math.min(volumeTotal.largura, 105));
    volumeTotal.comprimento = Math.max(16, Math.min(volumeTotal.comprimento, 105));

    // Calcular valor declarado (para seguro)
    const valorDeclarado = produtos.reduce((total, p) => {
      return total + (p.preco * p.quantidade);
    }, 0);

    // Payload para Melhor Envio
    const payload = {
      from: {
        postal_code: cepOrigem
      },
      to: {
        postal_code: cepLimpo
      },
      package: {
        height: volumeTotal.altura,
        width: volumeTotal.largura,
        length: volumeTotal.comprimento,
        weight: pesoTotal
      },
      options: {
        insurance_value: valorDeclarado,
        receipt: false,
        own_hand: false
      }
    };

    console.log(`📊 Payload enviado para Melhor Envio:`, JSON.stringify(payload, null, 2));
    console.log(`💰 Token configurado: ${MELHOR_ENVIO_TOKEN ? 'SIM' : 'NÃO'}`);
    console.log(`🔗 URL da API: ${MELHOR_ENVIO_API}`);

    // Fazer requisição ao Melhor Envio
    const response = await melhorEnvioClient.post('/shipment/calculate', payload);

    // Verificar resposta
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('⚠️ Resposta inválida do Melhor Envio:', response.data);
      throw new Error('Resposta inválida da API de frete');
    }

    // Processar e formatar cotações
    const cotacoes = response.data
      .map(cotacao => {
        // Verificar se há erro na cotação
        if (cotacao.error) {
          console.warn(`⚠️ Erro na cotação ${cotacao.name}: ${cotacao.error}`);
          return null;
        }

        return {
          id: cotacao.id,
          nome: cotacao.name,
          servico: cotacao.company?.name || 'Transportadora',
          preco: parseFloat(cotacao.price) || 0,
          prazoEntrega: parseInt(cotacao.delivery_time) || 0,
          servicoCompleto: `${cotacao.company?.name || 'Transportadora'} - ${cotacao.name}`,
          logo: cotacao.company?.picture || '',
          error: null
        };
      })
      .filter(c => c !== null); // Filtrar erros

    if (cotacoes.length === 0) {
      console.warn('⚠️ Nenhuma cotação válida retornada');
      throw new Error('Nenhuma opção de frete disponível para este CEP');
    }

    // Ordenar por preço
    cotacoes.sort((a, b) => a.preco - b.preco);

    console.log(`✅ Frete calculado com sucesso! ${cotacoes.length} opções disponíveis`);
    cotacoes.forEach(c => {
      console.log(`   - ${c.servicoCompleto}: R$ ${c.preco.toFixed(2)} (${c.prazoEntrega} dias)`);
    });

    return {
      success: true,
      cotacoes,
      metadata: {
        cepOrigem,
        cepDestino: cepLimpo,
        peso: pesoTotal,
        dimensoes: volumeTotal,
        valorDeclarado
      }
    };
  } catch (error) {
    console.error('❌ Erro ao calcular frete:');
    console.error('   Status:', error.response?.status);
    console.error('   Mensagem:', error.response?.data?.message || error.message);
    console.error('   Dados:', error.response?.data);
    
    // Tratamento específico de erros
    if (error.response?.status === 401) {
      console.error('❌ ERRO 401: Token inválido ou expirado. Verifique MELHOR_ENVIO_API_KEY no .env');
      throw new Error('Token de autenticação inválido. Configure corretamente.');
    }

    if (error.response?.status === 422) {
      console.error('❌ ERRO 422: Dados inválidos enviados para a API');
      throw new Error('Dados de frete inválidos. Verifique CEP e dimensões.');
    }

    if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
      console.error('❌ ERRO DE CONEXÃO: Não conseguiu conectar na API do Melhor Envio');
      throw new Error('Erro ao conectar com serviço de frete. Tente novamente.');
    }
    
    // Se a API não estiver configurada, retornar fretes fictícios
    if (!MELHOR_ENVIO_TOKEN || MELHOR_ENVIO_TOKEN === 'seu_api_key_aqui') {
      console.warn('⚠️ Melhor Envio não configurado. Usando valores fictícios.');
      return calcularFreteFicticio(cepDestino);
    }

    throw new Error(error.response?.data?.message || error.message || 'Erro ao calcular frete');
  }
};

/**
 * Calcular frete fictício (para desenvolvimento)
 * Quando Melhor Envio não estiver configurado
 */
const calcularFreteFicticio = (cepDestino) => {
  const cepNum = parseInt(cepDestino.replace(/\D/g, ''));
  const base = (cepNum % 100) / 10;

  return {
    success: true,
    cotacoes: [
      {
        id: 'pac',
        nome: 'PAC',
        servico: 'Correios',
        preco: 15 + base,
        prazoEntrega: 10,
        servicoCompleto: 'Correios - PAC',
        logo: 'https://static.melhorenvio.com.br/images/shipping-companies/correios.png'
      },
      {
        id: 'sedex',
        nome: 'SEDEX',
        servico: 'Correios',
        preco: 25 + base,
        prazoEntrega: 5,
        servicoCompleto: 'Correios - SEDEX',
        logo: 'https://static.melhorenvio.com.br/images/shipping-companies/correios.png'
      },
      {
        id: 'jadlog',
        nome: 'Jadlog .Package',
        servico: 'Jadlog',
        preco: 18 + base,
        prazoEntrega: 7,
        servicoCompleto: 'Jadlog - .Package',
        logo: 'https://static.melhorenvio.com.br/images/shipping-companies/jadlog.png'
      }
    ],
    metadata: {
      modo: 'ficticio',
      aviso: 'Configure MELHOR_ENVIO_API_KEY para usar valores reais'
    }
  };
};

/**
 * Criar etiqueta de envio
 * @param {Object} params - Dados do pedido
 * @returns {Promise<Object>} Dados da etiqueta
 */
export const criarEtiqueta = async ({ pedidoId, servicoId, remetente, destinatario }) => {
  try {
    if (!MELHOR_ENVIO_TOKEN || MELHOR_ENVIO_TOKEN === 'seu_api_key_aqui') {
      console.warn('⚠️ Melhor Envio não configurado. Etiqueta fictícia criada.');
      return {
        success: true,
        etiquetaId: `ETQ-${pedidoId}-${Date.now()}`,
        rastreio: `BR${Math.random().toString().slice(2, 15)}BR`,
        url: 'https://example.com/etiqueta-ficticia.pdf',
        modo: 'ficticio'
      };
    }

    const payload = {
      service: servicoId,
      from: {
        name: remetente.nome,
        phone: remetente.telefone,
        email: remetente.email,
        document: remetente.cpf || remetente.cnpj,
        address: remetente.endereco,
        complement: remetente.complemento || '',
        number: remetente.numero,
        district: remetente.bairro,
        city: remetente.cidade,
        state_abbr: remetente.estado,
        postal_code: remetente.cep.replace(/\D/g, '')
      },
      to: {
        name: destinatario.nome,
        phone: destinatario.telefone,
        email: destinatario.email,
        document: destinatario.cpf,
        address: destinatario.endereco,
        complement: destinatario.complemento || '',
        number: destinatario.numero,
        district: destinatario.bairro,
        city: destinatario.cidade,
        state_abbr: destinatario.estado,
        postal_code: destinatario.cep.replace(/\D/g, '')
      },
      products: destinatario.produtos.map(p => ({
        name: p.nome,
        quantity: p.quantidade,
        unitary_value: p.preco
      })),
      volumes: [
        {
          height: destinatario.volumes?.altura || 10,
          width: destinatario.volumes?.largura || 15,
          length: destinatario.volumes?.comprimento || 20,
          weight: destinatario.volumes?.peso || 0.3
        }
      ],
      options: {
        insurance_value: destinatario.valorDeclarado || 0,
        receipt: false,
        own_hand: false
      }
    };

    const response = await melhorEnvioClient.post('/cart', payload);

    return {
      success: true,
      etiquetaId: response.data.id,
      protocolo: response.data.protocol
    };
  } catch (error) {
    console.error('❌ Erro ao criar etiqueta:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Erro ao criar etiqueta');
  }
};

/**
 * Rastrear envio
 * @param {string} rastreio - Código de rastreamento
 * @returns {Promise<Object>} Status do envio
 */
export const rastrearEnvio = async (rastreio) => {
  try {
    if (!MELHOR_ENVIO_TOKEN || MELHOR_ENVIO_TOKEN === 'seu_api_key_aqui') {
      return {
        success: true,
        status: 'em_transito',
        mensagem: 'Objeto em trânsito',
        atualizacao: new Date().toISOString(),
        modo: 'ficticio'
      };
    }

    const response = await melhorEnvioClient.get(`/shipments/tracking?orders=${rastreio}`);

    const dados = response.data[rastreio];

    return {
      success: true,
      status: dados.status,
      mensagem: dados.message,
      historico: dados.tracking,
      atualizacao: dados.updated_at
    };
  } catch (error) {
    console.error('❌ Erro ao rastrear envio:', error.response?.data || error.message);
    throw new Error('Erro ao rastrear envio');
  }
};

export default {
  calcularFrete,
  criarEtiqueta,
  rastrearEnvio
};
