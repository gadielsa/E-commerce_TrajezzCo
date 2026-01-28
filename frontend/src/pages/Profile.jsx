import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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

  useEffect(() => {
    // Buscar dados do usuário do localStorage
    const userName = localStorage.getItem('userName')
    const userEmail = localStorage.getItem('userEmail')
    const userPhone = localStorage.getItem('userPhone') || ''
    const userAddress = localStorage.getItem('userAddress') || ''
    const userCity = localStorage.getItem('userCity') || ''
    const userZipCode = localStorage.getItem('userZipCode') || ''
    const userCountry = localStorage.getItem('userCountry') || ''

    const userData = {
      name: userName || 'Usuário',
      email: userEmail || 'email@example.com',
      phone: userPhone,
      address: userAddress,
      city: userCity,
      zipCode: userZipCode,
      country: userCountry
    }

    setUser(userData)
    setFormData(userData)
  }, [])

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

  const handleSaveClick = () => {
    // Salvar dados no localStorage
    localStorage.setItem('userName', formData.name)
    localStorage.setItem('userEmail', formData.email)
    localStorage.setItem('userPhone', formData.phone)
    localStorage.setItem('userAddress', formData.address)
    localStorage.setItem('userCity', formData.city)
    localStorage.setItem('userZipCode', formData.zipCode)
    localStorage.setItem('userCountry', formData.country)

    setUser(formData)
    setIsEditing(false)
    toast.success('Perfil atualizado com sucesso!')
  }

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPhone')
    localStorage.removeItem('userAddress')
    localStorage.removeItem('userCity')
    localStorage.removeItem('userZipCode')
    localStorage.removeItem('userCountry')
    toast.success('Você foi desconectado!')
    navigate('/login')
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
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                />
              </div>

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
