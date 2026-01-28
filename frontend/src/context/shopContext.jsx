import React, { createContext, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext()

const ShopContextProvider = (props) => {

  const currency = 'R$';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCep, setShippingCep] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingCountry, setShippingCountry] = useState('Brasil');
  const [shippingAddress, setShippingAddress] = useState('');
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || []
    } catch {
      return []
    }
  })
  const navigate = useNavigate()


  const addToCart = async (itemId, size) => {

    if (!size) {
      toast.error('Por favor, selecione um tamanho para adicionar o produto à sacola.')
      return
    }

    let cartData = structuredClone(cartItems)

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1
      }
      else {
        cartData[itemId][size] = 1
      }
    }
    else {
      cartData[itemId] = {}
      cartData[itemId][size] = 1
    }
    setCartItems(cartData)
  }

  const getCartCount = () => {
    let totalCount = 0
    for (const items in cartItems) {
      for(const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item]
          }
        } catch {
          // Ignora itens inválidos
        }
      } 
    }
    return totalCount
  }

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems)
    cartData[itemId][size] = quantity
    setCartItems(cartData)
  }

  const getCartAmount = () => {
    let totalAmount = 0
    for(const items in cartItems) {
      let itemInfo = products.find((product)=> product._id === items)
      for(const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item]
          }
        } catch {
          // Ignora itens inválidos
        }
      }
    }
    return totalAmount
  }

  const placeOrder = (deliveryInfo, paymentDetails = null) => {
    let finalAmount = getCartAmount() + shippingCost
    
    // Aplica desconto de 6% para PIX
    if (deliveryInfo.method === 'pix') {
      finalAmount = finalAmount * 0.94 // 6% de desconto
    }
    
    const orderData = {
      orderId: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      items: cartItems,
      deliveryInfo: deliveryInfo,
      paymentMethod: deliveryInfo.method,
      paymentDetails: paymentDetails,
      subtotal: getCartAmount(),
      shippingCost: shippingCost,
      totalAmount: finalAmount,
      status: deliveryInfo.method === 'pix' ? 'Aguardando pagamento' : 'Pagamento aprovado'
    }
    
    let orders = JSON.parse(localStorage.getItem('orders')) || []
    orders.push(orderData)
    localStorage.setItem('orders', JSON.stringify(orders))
    
    setCartItems({})
    resetShipping()
    
    return orderData
  }

  // Gera código PIX
  const generatePixPayment = (amount, orderId) => {
    const pixCode = `00020126580014br.gov.bcb.pix0136${String(orderId).padStart(36, '0')}52040000530398654${amount.toFixed(2)}5802BR5925TRAJEZZ COMERCIO LTDA6009SAO PAULO62070503***6304${Math.random().toString().substr(2, 4)}`
    
    return {
      pixCode: pixCode,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`,
      amount: amount,
      expiresIn: 30
    }
  }

  // Processa pagamento com cartão
  const processCreditCardPayment = (cardData) => {
    if (!validateCreditCard(cardData)) {
      return { success: false, message: 'Dados do cartão inválidos' }
    }
    
    const transactionId = `TRZ${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    return {
      success: true,
      transactionId: transactionId,
      cardBrand: detectCardBrand(cardData.number),
      lastDigits: cardData.number.slice(-4),
      installments: cardData.installments || 1,
      message: 'Pagamento aprovado com sucesso'
    }
  }

  // Valida dados do cartão
  const validateCreditCard = (cardData) => {
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      return false
    }
    
    const cardNumber = cardData.number.replace(/\s/g, '')
    
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return false
    }
    
    // Algoritmo de Luhn
    let sum = 0
    let isEven = false
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }

  // Detecta bandeira do cartão
  const detectCardBrand = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '')
    
    if (/^4/.test(number)) return 'Visa'
    if (/^5[1-5]/.test(number)) return 'Mastercard'
    if (/^3[47]/.test(number)) return 'American Express'
    if (/^6(?:011|5)/.test(number)) return 'Discover'
    if (/^(606282|3841)/.test(number)) return 'Hipercard'
    if (/^(636368|438935|504175|451416|636297)/.test(number)) return 'Elo'
    
    return 'Desconhecida'
  }

  // Calcula parcelas
  const calculateInstallments = (amount, maxInstallments = 12) => {
    const installments = []
    const minInstallmentValue = 50
    
    for (let i = 1; i <= maxInstallments; i++) {
      const installmentValue = amount / i
      
      if (installmentValue >= minInstallmentValue) {
        let interest = 0
        let totalAmount = amount
        
        if (i > 3) {
          interest = 0.0299
          totalAmount = amount * Math.pow(1 + interest, i)
        }
        
        installments.push({
          number: i,
          value: totalAmount / i,
          total: totalAmount,
          interest: i > 3,
          label: i === 1 
            ? `À vista: R$ ${amount.toFixed(2)}`
            : i <= 3
            ? `${i}x de R$ ${installmentValue.toFixed(2)} sem juros`
            : `${i}x de R$ ${(totalAmount / i).toFixed(2)} com juros`
        })
      }
    }
    
    return installments
  }

  const toggleFavorite = (itemId) => {
    let favs = structuredClone(favorites)
    if (favs.includes(itemId)) {
      favs = favs.filter(id => id !== itemId)
    } else {
      favs.push(itemId)
    }
    setFavorites(favs)
    localStorage.setItem('favorites', JSON.stringify(favs))
  }

  const isFavorite = (itemId) => {
    return favorites.includes(itemId)
  }

  const getFavorites = () => {
    return products.filter(p => favorites.includes(p._id))
  }

  const calculateShipping = async (cep) => {
    // Remove caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, '')
    
    if (cleanCep.length !== 8) {
      toast.error('CEP inválido')
      return
    }

    try {
      // PASSO 1: Validar CEP com ViaCEP (API gratuita)
      const cepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const cepData = await cepResponse.json()
      
      if (cepData.erro) {
        toast.error('CEP não encontrado')
        return
      }

      // Extrai e armazena dados do endereço do ViaCEP
      // Estrutura do ViaCEP:
      // - logradouro: rua/avenida
      // - bairro: bairro
      // - localidade: cidade
      // - uf: estado (sigla)
      const city = cepData.localidade || ''
      const state = cepData.uf || ''
      const address = cepData.logradouro || ''
      
      setShippingCity(city)
      setShippingState(state)
      setShippingAddress(address)
      setShippingCountry('Brasil')

      const subtotal = getCartAmount()
      
      // Se compra >= R$500, frete grátis
      if (subtotal >= 500) {
        setShippingCost(0)
        setShippingCep(cep)
        return
      }

      // PASSO 2: Calcular frete com Melhor Envio
      // IMPORTANTE: Para usar em produção, você precisa:
      // 1. Criar conta em https://melhorenvio.com.br
      // 2. Ir em: Configurações > Desenvolvedores > Gerar Token
      // 3. Substituir 'SEU_TOKEN_AQUI' pelo seu token real
      // 4. Configurar o CEP de origem da sua loja
      
      const MELHOR_ENVIO_TOKEN = 'SEU_TOKEN_AQUI' // SUBSTITUA PELO SEU TOKEN
      const CEP_ORIGEM = '92518604' // SUBSTITUA PELO CEP DA SUA LOJA
      
      // Enquanto não tiver token, usa simulação
      if (MELHOR_ENVIO_TOKEN === 'SEU_TOKEN_AQUI') {
        // SIMULAÇÃO (REMOVER QUANDO INTEGRAR COM MELHOR ENVIO)
        const region = parseInt(cleanCep.substring(0, 2))
        let cost = 0
        
        if (region >= 1 && region <= 19) {
          cost = 15 // Sudeste
        } else if (region >= 20 && region <= 28) {
          cost = 18 // Rio de Janeiro/Espírito Santo
        } else if (region >= 40 && region <= 48) {
          cost = 25 // Sul
        } else if (region >= 50 && region <= 65) {
          cost = 30 // Nordeste
        } else if (region >= 69 && region <= 76) {
          cost = 35 // Norte
        } else {
          cost = 28 // Centro-Oeste
        }
        
        setShippingCost(cost)
        setShippingCep(cep)
        return
      }

      // INTEGRAÇÃO REAL COM MELHOR ENVIO
      const shippingResponse = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`
        },
        body: JSON.stringify({
          from: {
            postal_code: CEP_ORIGEM
          },
          to: {
            postal_code: cleanCep
          },
          package: {
            height: 10,    // altura em cm (ajuste conforme seus produtos)
            width: 20,     // largura em cm
            length: 30,    // comprimento em cm
            weight: 1      // peso em kg
          }
        })
      })

      if (!shippingResponse.ok) {
        throw new Error('Erro ao consultar frete')
      }

      const shippingData = await shippingResponse.json()
      
      // Procura pelo PAC (mais econômico) ou SEDEX
      const pacShipping = shippingData.find(s => s.company.name === 'Correios' && s.name === 'PAC')
      const sedexShipping = shippingData.find(s => s.company.name === 'Correios' && s.name === 'SEDEX')
      
      // Usa PAC se disponível, senão SEDEX, senão o primeiro disponível
      const selectedShipping = pacShipping || sedexShipping || shippingData[0]
      
      if (selectedShipping) {
        setShippingCost(selectedShipping.price)
      } else {
        toast.error('Nenhuma opção de frete disponível')
        return
      }
      
      setShippingCep(cep)
    } catch (error) {
      console.error('Erro ao calcular frete:', error)
      toast.error('Erro ao calcular frete. Tente novamente.')
    }
  }

  const resetShipping = () => {
    setShippingCost(0)
    setShippingCep('')
    setShippingCity('')
    setShippingState('')
    setShippingAddress('')
    setShippingCountry('Brasil')
  }

  const value = {
    products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch, 
    cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate, placeOrder,
    favorites, toggleFavorite, isFavorite, getFavorites,
    shippingCost, shippingCep, calculateShipping, resetShipping,
    shippingCity, shippingState, shippingCountry, shippingAddress,
    generatePixPayment, processCreditCardPayment, validateCreditCard, 
    detectCardBrand, calculateInstallments
  }
  

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )

}

export default ShopContextProvider