import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '../services/authService'
import { userService } from '../services/userService'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    addressNumber: '',
    state: '',
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
        if (!authService.isAuthenticated()) {
          navigate('/login')
          return
        }
        const data = await authService.getProfile()
        const userData = data.user || data.data || {}

        const userInfo = {
          name: userData.name || 'Usuário',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address?.street || '',
          addressNumber: userData.address?.number || '',
          state: userData.address?.state || '',
          city: userData.address?.city || '',
          zipCode: userData.address?.zipCode || '',
          country: userData.address?.country || 'Brasil'
        }

        setUser(userInfo)
        setFormData(userInfo)
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
        toast.error('Erro ao carregar perfil')
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
      if (!authService.isAuthenticated()) {
        navigate('/login')
        return
      }
      const response = await userService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.address,
          number: formData.addressNumber,
          state: formData.state,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country
        }
      })

      const userData = response.user || response.data || {}
      const updatedInfo = {
        name: userData.name || formData.name,
        email: userData.email || formData.email,
        phone: userData.phone || formData.phone,
        address: userData.address?.street || formData.address,
        addressNumber: userData.address?.number || formData.addressNumber,
        state: userData.address?.state || formData.state,
        city: userData.address?.city || formData.city,
        zipCode: userData.address?.zipCode || formData.zipCode,
        country: userData.address?.country || formData.country
      }

      setUser(updatedInfo)
      setFormData(updatedInfo)
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

  const formatZipCode = (value) => {
    let digits = value.replace(/\D/g, '').slice(0, 8)
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`
    }
    return digits
  }

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (!digits) return ''
    if (digits.length <= 2) return `(${digits}`

    const ddd = digits.slice(0, 2)
    const rest = digits.slice(2)
    if (rest.length <= 5) {
      return `(${ddd}) ${rest}`
    }
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
  }

  const handleLogout = () => {
    authService.logout()
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
                  className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
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
                  className='w-full border border-gray-300 rounded-lg py-2 px-4 bg-gray-100 text-gray-600 cursor-not-allowed'
                />
              </div>

              {/* Endereço */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Endereço</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder='Rua, avenida, complemento'
                    className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Número</label>
                  <input
                    type="text"
                    name="addressNumber"
                    value={formData.addressNumber}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      addressNumber: e.target.value.replace(/\D/g, '')
                    }))}
                    placeholder='Número da casa'
                    className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Cidade</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder='São Paulo'
                    className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Estado</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2)
                      setFormData(prev => ({
                        ...prev,
                        state: value
                      }))
                    }}
                    placeholder='SP'
                    maxLength={2}
                    className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>CEP</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      zipCode: formatZipCode(e.target.value)
                    }))}
                    placeholder='00000-000'
                    maxLength={9}
                    className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>País</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder='Brasil'
                    className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Telefone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    phone: formatPhone(e.target.value)
                  }))}
                  placeholder='(11) 99999-9999'
                  maxLength={15}
                  className='w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
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
                  {user.addressNumber && `, ${user.addressNumber}`}
                  {user.city && ` - ${user.city}`}
                  {user.state && ` - ${user.state}`}
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
