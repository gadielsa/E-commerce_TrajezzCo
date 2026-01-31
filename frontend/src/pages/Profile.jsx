import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API_URL from '../config/api'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar dados do usuário da API
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const response = await fetch(`${API_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário')
        }

        const data = await response.json()
        const userData = data.user || data.data || {}
        
        const userInfo = {
          name: userData.name || localStorage.getItem('userName') || 'Usuário',
          email: userData.email || localStorage.getItem('userEmail') || '',
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          zipCode: userData.zipCode || '',
          country: userData.country || 'Brasil'
        }

        setUser(userInfo)
        setFormData(userInfo)
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
        // Fallback para localStorage
        const userData = {
          name: localStorage.getItem('userName') || 'Usuário',
          email: localStorage.getItem('userEmail') || '',
          phone: localStorage.getItem('userPhone') || '',
          address: localStorage.getItem('userAddress') || '',
          city: localStorage.getItem('userCity') || '',
          zipCode: localStorage.getItem('userZipCode') || '',
          country: localStorage.getItem('userCountry') || 'Brasil'
        }
        setUser(userData)
        setFormData(userData)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil')
      }

      // Atualizar localStorage também
      localStorage.setItem('userName', formData.name)
      localStorage.setItem('userPhone', formData.phone)
      localStorage.setItem('userAddress', formData.address)
      localStorage.setItem('userCity', formData.city)
      localStorage.setItem('userZipCode', formData.zipCode)
      localStorage.setItem('userCountry', formData.country)

      setUser(formData)
      setIsEditing(false)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error(error.message || 'Erro ao atualizar perfil')
      console.error('Update profile error:', error)
    }
  }

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('userPhone')
    localStorage.removeItem('userAddress')
    localStorage.removeItem('userCity')
    localStorage.removeItem('userZipCode')
    localStorage.removeItem('userCountry')
    toast.success('Você foi desconectado!')
    navigate('/login')
  }

  if (loading) {
    return <div className='min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center'>Carregando...</div>
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Meu Perfil</h1>
              <p className='text-gray-600 mt-2'>Gerencie suas informações pessoais</p>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className='bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors'
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Informações Pessoais */}
        <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200'>
            Informações Pessoais
          </h2>

          {isEditing ? (
            <form className='space-y-6'>
              {/* Nome */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                />
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed'

              {/* Telefone */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Telefone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder='(XX) XXXXX-XXXX'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                />
              </div>

              {/* Endereço */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Endereço</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder='Rua, número e complemento'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                />
              </div>

              {/* Cidade e CEP */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Cidade</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>CEP</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder='XXXXX-XXX'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  />
                </div>
              </div>

              {/* País */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>País</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                />
              </div>

              {/* Botões de Ação */}
              <div className='flex gap-4 pt-6'>
                <button
                  type="button"
                  onClick={handleSaveClick}
                  className='flex-1 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors'
                >
                  Salvar Mudanças
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className='flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors'
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className='space-y-6'>
              {/* Nome */}
              <div className='border-b border-gray-200 pb-4'>
                <p className='text-sm font-medium text-gray-500 mb-1'>Nome</p>
                <p className='text-lg text-gray-900'>{user.name}</p>
              </div>

              {/* Email */}
              <div className='border-b border-gray-200 pb-4'>
                <p className='text-sm font-medium text-gray-500 mb-1'>Email</p>
                <p className='text-lg text-gray-900'>{user.email}</p>
              </div>

              {/* Telefone */}
              <div className='border-b border-gray-200 pb-4'>
                <p className='text-sm font-medium text-gray-500 mb-1'>Telefone</p>
                <p className='text-lg text-gray-900'>{user.phone || 'Não informado'}</p>
              </div>

              {/* Endereço */}
              <div className='border-b border-gray-200 pb-4'>
                <p className='text-sm font-medium text-gray-500 mb-1'>Endereço</p>
                <p className='text-lg text-gray-900'>
                  {user.address || 'Não informado'}
                  {user.city && `, ${user.city}`}
                  {user.zipCode && ` - ${user.zipCode}`}
                  {user.country && `, ${user.country}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botão de Sair */}
        {!isEditing && (
          <div className='flex justify-center'>
            <button
              onClick={handleLogout}
              className='bg-red-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors'
            >
              Sair da Conta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
