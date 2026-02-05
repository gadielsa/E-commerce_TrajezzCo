import React, { useState, useEffect } from 'react';
import { buscarCep, formatarCep } from '../services/shippingService';

/**
 * Componente para busca de endereço por CEP
 */
const CepInput = ({ onAddressFound, initialValue = '', className = '' }) => {
  const [cep, setCep] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValue) {
      setCep(formatarCep(initialValue));
    }
  }, [initialValue]);

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limitar a 8 dígitos
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    // Formatar CEP
    const formatted = formatarCep(value);
    setCep(formatted);
    setError('');

    // Buscar automaticamente quando completar 8 dígitos
    if (value.length === 8) {
      buscarEndereco(value);
    }
  };

  const buscarEndereco = async (cepValue) => {
    setLoading(true);
    setError('');

    try {
      const resultado = await buscarCep(cepValue || cep);
      
      if (resultado.success) {
        onAddressFound(resultado.data);
      } else {
        setError(resultado.message || 'CEP não encontrado');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = () => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length > 0 && cepLimpo.length < 8) {
      setError('CEP incompleto');
    } else if (cepLimpo.length === 8 && !loading) {
      buscarEndereco(cepLimpo);
    }
  };

  return (
    <div className={`cep-input-container ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={cep}
          onChange={handleCepChange}
          onBlur={handleBlur}
          placeholder="00000-000"
          maxLength="9"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CepInput;
