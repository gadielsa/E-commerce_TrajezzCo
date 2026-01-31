import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Title from '../components/Title'
import AddProduct from '../components/Admin/AddProduct'
import ProductList from '../components/Admin/ProductList'
import OrdersList from '../components/Admin/OrdersList'
import CouponManager from '../components/Admin/CouponManager'
import API_URL from '../config/api'

const AdminPanel = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [productRefresh, setProductRefresh] = useState(0)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) {
      toast.error('Você não tem permissão para acessar o painel de administração')
      navigate('/')
      return
    }

    fetchStats()
  }, [navigate])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Fetch admin stats
      const statsRes = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!statsRes.ok) {
        throw new Error('Failed to fetch stats')
      }

      const statsData = await statsRes.json()
      const data = statsData.data || {}

      setStats({
        totalProducts: data.totalProducts || 0,
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0,
        pendingOrders: data.pendingOrders || 0
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
      toast.error('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }

  const handleProductAdded = () => {
    setProductRefresh(prev => prev + 1)
    fetchStats()
  }

  if (loading) {
    return (
      <div className='border-t pt-16'>
        <Title text1={'PAINEL'} text2={'ADMINISTRATIVO'} />
        <div className='text-center py-20'>Carregando...</div>
      </div>
    )
  }

  return (
    <div className='border-t pt-16 pb-20'>
      <div className='mb-12'>
        <Title text1={'PAINEL'} text2={'ADMINISTRATIVO'} />
        <p className='text-gray-600 text-center mt-4'>Gerencie produtos, pedidos e cupons da sua loja</p>
      </div>

      {/* Dashboard Cards */}
      {activeTab === 'dashboard' && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-12'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-gray-600 text-sm font-semibold mb-2'>Total de Produtos</h3>
            <p className='text-3xl font-bold text-black'>{stats.totalProducts}</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-gray-600 text-sm font-semibold mb-2'>Total de Pedidos</h3>
            <p className='text-3xl font-bold text-black'>{stats.totalOrders}</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-gray-600 text-sm font-semibold mb-2'>Pedidos Pendentes</h3>
            <p className='text-3xl font-bold text-orange-600'>{stats.pendingOrders}</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-gray-600 text-sm font-semibold mb-2'>Receita Total</h3>
            <p className='text-3xl font-bold text-green-600'>R$ {stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className='mb-8 border-b border-gray-200'>
        <div className='flex gap-8 overflow-x-auto'>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'addProduct', label: 'Adicionar Produto' },
            { id: 'products', label: 'Produtos' },
            { id: 'orders', label: 'Pedidos' },
            { id: 'coupons', label: 'Cupons' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-4 font-semibold text-sm md:text-base transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'dashboard' && (
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Bem-vindo ao Painel de Administração</h3>
            <p className='text-gray-600 mb-4'>
              Use o menu acima para gerenciar:
            </p>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li><strong>Adicionar Produto:</strong> Crie novos produtos para sua loja</li>
              <li><strong>Produtos:</strong> Visualize, edite e delete produtos existentes</li>
              <li><strong>Pedidos:</strong> Acompanhe e atualize o status dos pedidos dos clientes</li>
              <li><strong>Cupons:</strong> Crie e gerencie cupons de desconto</li>
            </ul>
          </div>
        )}

        {activeTab === 'addProduct' && (
          <AddProduct onProductAdded={handleProductAdded} />
        )}

        {activeTab === 'products' && (
          <ProductList refreshTrigger={productRefresh} />
        )}

        {activeTab === 'orders' && (
          <OrdersList />
        )}

        {activeTab === 'coupons' && (
          <CouponManager />
        )}
      </div>
    </div>
  )
}

export default AdminPanel
