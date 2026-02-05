import React, { useState } from 'react';
import { calcularFrete } from '../services/shippingService';

/**
 * Componente de Calculadora de Frete
 */
const FreteCalculator = ({ produtos, onFreteSelected, className = '' }) => {
  const [cep, setCep] = useState('');
  const [cotacoes, setCotacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFrete, setSelectedFrete] = useState(null);

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    // Formatar
    const formatted = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    setCep(formatted);
    setError('');
  };

  const calcular = async () => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      setError('Digite um CEP válido');
      return;
    }

    if (!produtos || produtos.length === 0) {
      setError('Carrinho vazio');
      return;
    }

    setLoading(true);
    setError('');
    setCotacoes([]);
    setSelectedFrete(null);

    try {
      const resultado = await calcularFrete(cepLimpo, produtos);

      if (resultado.success && resultado.cotacoes) {
        setCotacoes(resultado.cotacoes);
        
        if (resultado.metadata?.modo === 'ficticio') {
          setError('⚠️ Valores fictícios - Configure Melhor Envio API');
        }
      } else {
        setError('Nenhuma opção de frete disponível');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFrete = (cotacao) => {
    setSelectedFrete(cotacao);
    if (onFreteSelected) {
      onFreteSelected(cotacao);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      calcular();
    }
  };

  return (
    <div className={`frete-calculator ${className}`}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Calcular Frete e Prazo
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={cep}
            onChange={handleCepChange}
            onKeyPress={handleKeyPress}
            placeholder="Digite seu CEP"
            maxLength="9"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={calcular}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
        </div>

        {error && (
          <p className={`text-sm mt-2 ${error.includes('⚠️') ? 'text-yellow-600' : 'text-red-500'}`}>
            {error}
          </p>
        )}
      </div>

      {/* Opções de Frete */}
      {cotacoes.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Selecione uma opção de entrega:
          </p>

          {cotacoes.map((cotacao) => (
            <div
              key={cotacao.id}
              onClick={() => handleSelectFrete(cotacao)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedFrete?.id === cotacao.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {cotacao.logo && (
                    <img 
                      src={cotacao.logo} 
                      alt={cotacao.servico}
                      className="h-8 w-8 object-contain"
                    />
                  )}
                  
                  <div>
                    <p className="font-medium text-gray-900">
                      {cotacao.servicoCompleto}
                    </p>
                    <p className="text-sm text-gray-600">
                      Entrega em até {cotacao.prazoEntrega} dias úteis
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    R$ {cotacao.preco.toFixed(2)}
                  </p>
                  {selectedFrete?.id === cotacao.id && (
                    <p className="text-xs text-blue-600 font-medium">
                      ✓ Selecionado
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 mt-2">Consultando transportadoras...</p>
        </div>
      )}
    </div>
  );
};

export default FreteCalculator;
