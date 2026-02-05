/**
 * Script para limpar todos os dados do localStorage
 * Execute no console do navegador ou chame desta função
 */

export const clearAllLocalStorage = () => {
  const keysToRemove = [
    'adminProducts',
    'allProducts',
    'orders',
    'coupons',
    'adminAuth',
    'cart',
    'user',
    'token'
  ]

  keysToRemove.forEach(key => {
    localStorage.removeItem(key)
    console.log(`✅ Removido: ${key}`)
  })

  console.log('🗑️ localStorage limpo com sucesso!')
  console.log('Atualize a página (F5) para aplicar as mudanças')
}

// Script para executar no console do navegador
console.log(`
╔════════════════════════════════════════════════════════════╗
║ Para limpar o localStorage, execute no console (F12):      ║
║                                                            ║
║ localStorage.clear()                                       ║
║                                                            ║
║ OU para remover apenas dados de produtos:                 ║
║                                                            ║
║ localStorage.removeItem('adminProducts')                  ║
║ localStorage.removeItem('allProducts')                    ║
║ localStorage.removeItem('orders')                         ║
║ localStorage.removeItem('coupons')                        ║
╚════════════════════════════════════════════════════════════╝
`)
