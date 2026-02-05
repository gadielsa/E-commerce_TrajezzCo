import React, { useState } from 'react'
import AddProduct from '../components/Admin/AddProduct'
import ProductList from '../components/Admin/ProductList'
import OrdersList from '../components/Admin/OrdersList'
import CouponManager from '../components/Admin/CouponManager'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('adicionar')
  
  // Obter informações do usuário logado
  const getUserInfo = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-bold text-gray-900'>Painel de Administrador</h1>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex gap-8'>
            <button
              onClick={() => setActiveTab('adicionar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'adicionar'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Adicionar Produto
            </button>
            <button
              onClick={() => setActiveTab('listar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'listar'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gerenciar Produtos
            </button>
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pedidos'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Acompanhar Pedidos
            </button>
            <button
              onClick={() => setActiveTab('cupons')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cupons'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gerenciar Cupons
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {activeTab === 'adicionar' && <AddProduct />}
        {activeTab === 'listar' && <ProductList />}
        {activeTab === 'pedidos' && <OrdersList />}
        {activeTab === 'cupons' && <CouponManager />}
      </div>
    </div>
  )
}

export default AdminPanel
