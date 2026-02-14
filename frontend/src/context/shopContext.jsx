import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { orderService } from "../services/orderService";
import { ShopContext } from "./ShopContextContext";
import { couponService } from "../services/couponService";
import favoriteService from "../services/favoriteService";

const ShopContextProvider = (props) => {

  const currency = 'R$';
  const delivery_fee = 10;
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCep, setShippingCep] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingCountry, setShippingCountry] = useState('Brasil');
  const [shippingAddress, setShippingAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [favorites, setFavorites] = useState([])
  const [favoritesLoaded, setFavoritesLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getProducts();
        const normalizedProducts = (data || []).map((product) => {
          const images = Array.isArray(product.images)
            ? product.images
            : Array.isArray(product.image)
            ? product.image
            : product.image
            ? [product.image]
            : [];

          return {
            ...product,
            image: images,
            images,
            bestseller: product.bestseller ?? product.isBestseller ?? false,
            isAvailable: product.isAvailable ?? product.available ?? true
          };
        });

        setProducts(normalizedProducts);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        toast.error('Erro ao carregar produtos. Tente novamente.');
        setProducts([]);
      }
    };

    loadProducts();
    loadFavorites();
  }, []);

  // Carregar favoritos do banco de dados
  const loadFavorites = async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      // Se não está logado, carrega do localStorage
      try {
        const localFavorites = JSON.parse(localStorage.getItem('favorites')) || []
        setFavorites(localFavorites)
      } catch {
        setFavorites([])
      }
      setFavoritesLoaded(true)
      return
    }

    try {
      const response = await favoriteService.getFavorites()
      
      if (response.success && response.favorites) {
        // Extrai apenas os IDs dos produtos
        const favoriteIds = response.favorites.map(p => p._id)
        setFavorites(favoriteIds)
        
        // Migra favoritos do localStorage para o banco (se houver)
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        if (localFavorites.length > 0) {
          const newFavorites = localFavorites.filter(id => !favoriteIds.includes(id))
          if (newFavorites.length > 0) {
            await favoriteService.syncFavorites(localFavorites)
            // Atualiza o estado com os favoritos combinados
            setFavorites([...favoriteIds, ...newFavorites])
          }
          // Remove do localStorage após sincronizar
          localStorage.removeItem('favorites')
        }
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
      // Em caso de erro, mantém os favoritos do localStorage
      try {
        const localFavorites = JSON.parse(localStorage.getItem('favorites')) || []
        setFavorites(localFavorites)
      } catch {
        setFavorites([])
      }
    } finally {
      setFavoritesLoaded(true)
    }
  }


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
          if (cartItems[items][item] > 0 && itemInfo) {
            totalAmount += itemInfo.price * cartItems[items][item]
          }
        } catch {
          // Ignora itens inválidos
        }
      }
    }
    return totalAmount
  }

  // Função auxiliar para obter o frete efetivo (considera frete grátis >= R$500)
  const getEffectiveShippingCost = (subtotal) => {
    return subtotal >= 500 ? 0 : shippingCost
  }

  const placeOrder = async (deliveryInfo, paymentDetails = null) => {
    try {
      const subtotal = getCartAmount()
      const effectiveShipping = getEffectiveShippingCost(subtotal)
      let finalAmount = subtotal + effectiveShipping
      
      // Aplica desconto de 6% para PIX
      if (deliveryInfo.method === 'pix') {
        finalAmount = finalAmount * 0.94 // 6% de desconto
      }

      // Preparar itens para envio à API
      const items = []
      for (const itemId in cartItems) {
        const product = products.find(p => p._id === itemId)
        if (product) {
          for (const size in cartItems[itemId]) {
            const quantity = cartItems[itemId][size]
            if (quantity > 0) {
              items.push({
                product: itemId,
                name: product.name,
                price: product.price,
                size: size,
                quantity: quantity,
                image: product.image?.[0] || ''
              })
            }
          }
        }
      }
      
      // Remover o campo 'method' de deliveryInfo pois não faz parte do schema
      const cleanDeliveryInfo = { ...deliveryInfo }
      delete cleanDeliveryInfo.method
      
      const orderPayload = {
        items: items,
        deliveryInfo: cleanDeliveryInfo,
        paymentMethod: deliveryInfo.method,
        paymentDetails: paymentDetails,
        subtotal: subtotal,
        shippingCost: effectiveShipping,
        discount: 0,
        couponCode: couponCode || '',
        totalAmount: finalAmount
      }

      // Criar pedido na API
      const response = await orderService.createOrder(orderPayload)
      
      if (!response.success) {
        throw new Error(response.message || 'Erro ao criar pedido')
      }

      const orderData = response.order
      
      setCartItems({})
      resetShipping()
      
      return orderData
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      toast.error(error.message || 'Erro ao criar pedido')
      throw error
    }
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

  const detectCardBrand = (number) => {
    const cleanNumber = (number || '').replace(/\s/g, '')

    if (/^4/.test(cleanNumber)) return 'Visa'
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard'
    if (/^3[47]/.test(cleanNumber)) return 'American Express'
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover'
    if (/^(606282|3841)/.test(cleanNumber)) return 'Hipercard'
    if (/^(636368|438935|504175|451416|636297)/.test(cleanNumber)) return 'Elo'

    return 'Desconhecida'
  }

  const toggleFavorite = async (itemId) => {
    const token = localStorage.getItem('token')

    // Atualiza o estado local imediatamente para melhor UX
    const isCurrentlyFavorite = favorites.includes(itemId)
    let newFavorites

    if (isCurrentlyFavorite) {
      newFavorites = favorites.filter(id => id !== itemId)
    } else {
      newFavorites = [...favorites, itemId]
    }

    setFavorites(newFavorites)

    // Se esta logado, sincroniza com o banco
    if (token) {
      try {
        if (isCurrentlyFavorite) {
          await favoriteService.removeFavorite(itemId)
        } else {
          await favoriteService.addFavorite(itemId)
        }
      } catch (error) {
        // Se falhar, reverte o estado local
        setFavorites(favorites)
        toast.error('Erro ao atualizar favoritos')
        console.error('Erro ao atualizar favoritos:', error)
      }
    } else {
      // Se nao esta logado, salva no localStorage
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    }
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
      console.log(`🚚 Iniciando cálculo de frete para CEP: ${cleanCep}`)

      // PASSO 1: Validar CEP com ViaCEP (API gratuita)
      const cepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const cepData = await cepResponse.json()
      
      if (cepData.erro) {
        toast.error('CEP não encontrado')
        return
      }

      // Armazena dados do endereço
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
        console.log('✅ Frete grátis: Compra acima de R$ 500')
        setShippingCost(0)
        setShippingCep(cep)
        return
      }

      // PASSO 2: Preparar dados dos produtos
      const cartProductsArray = []
      for (const itemId in cartItems) {
        const product = products.find(p => p._id === itemId)
        if (product) {
          for (const size in cartItems[itemId]) {
            const quantity = cartItems[itemId][size]
            if (quantity > 0) {
              cartProductsArray.push({
                nome: product.name,
                preço: product.price,
                quantidade: quantity,
                peso: 0.3, // kg padrão
                altura: 10,
                largura: 15,
                comprimento: 20
              })
            }
          }
        }
      }

      if (cartProductsArray.length === 0) {
        toast.error('Carrinho vazio')
        return
      }

      console.log(`📦 Produtos para cálculo: ${cartProductsArray.length} itens`)

      // PASSO 3: Chamar API do backend para calcular frete
      const API_URL = typeof window !== 'undefined' ? window.location.origin.includes('localhost') 
        ? 'http://localhost:5000'
        : window.location.protocol + '//' + window.location.host.replace(':5173', ':5000')
        : 'http://localhost:5000'

      console.log(`🔗 Chamando API em: ${API_URL}/api/shipping/calcular`)

      const shippingResponse = await fetch(`${API_URL}/api/shipping/calcular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          cepDestino: cleanCep,
          produtos: cartProductsArray
        })
      })

      if (!shippingResponse.ok) {
        const errorData = await shippingResponse.json()
        throw new Error(errorData.message || 'Erro ao consultar frete')
      }

      const shippingData = await shippingResponse.json()
      
      if (!shippingData.success || !shippingData.cotacoes || shippingData.cotacoes.length === 0) {
        throw new Error('Nenhuma opção de frete disponível')
      }

      // Procura pelo PAC (mais econômico) ou SEDEX
      const pacShipping = shippingData.cotacoes.find(s => s.nome?.includes('PAC'))
      const sedexShipping = shippingData.cotacoes.find(s => s.nome?.includes('SEDEX'))
      
      // Usa PAC se disponível, senão SEDEX, senão o primeiro disponível
      const selectedShipping = pacShipping || sedexShipping || shippingData.cotacoes[0]
      
      if (selectedShipping) {
        console.log(`✅ Frete selecionado: ${selectedShipping.servicoCompleto} - R$ ${selectedShipping.preco.toFixed(2)}`)
        setShippingCost(selectedShipping.preco)
      } else {
        throw new Error('Nenhuma opção de frete disponível')
      }
      
      setShippingCep(cep)
    } catch (error) {
      console.error('❌ Erro ao calcular frete:', error)
      toast.error(error.message || 'Erro ao calcular frete. Tente novamente.')
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

  const applyCoupon = async (code) => {
    const trimmedCode = (code || '').trim()
    if (!trimmedCode) {
      toast.error('Informe um cupom válido')
      return false
    }

    try {
      const amount = getCartAmount()
      const data = await couponService.validateCoupon(trimmedCode, amount)
      const discount = data?.discount || 0
      const appliedCode = data?.coupon?.code || trimmedCode.toUpperCase()

      setCouponCode(appliedCode)
      setCouponDiscount(discount)
      toast.success('Cupom aplicado com sucesso!')
      return true
    } catch (error) {
      setCouponCode('')
      setCouponDiscount(0)
      toast.error(error.message || 'Erro ao aplicar cupom')
      return false
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setCouponDiscount(0)
    toast.info('Cupom removido')
  }

  const value = {
    products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch, 
    cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate, placeOrder,
    favorites, toggleFavorite, isFavorite, getFavorites, loadFavorites,
    shippingCost, shippingCep, calculateShipping, resetShipping, getEffectiveShippingCost,
    shippingCity, shippingState, shippingCountry, shippingAddress,
    generatePixPayment, processCreditCardPayment, validateCreditCard, 
    detectCardBrand, calculateInstallments,
    couponCode, couponDiscount, applyCoupon, removeCoupon
  }
  

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )

}

export default ShopContextProvider