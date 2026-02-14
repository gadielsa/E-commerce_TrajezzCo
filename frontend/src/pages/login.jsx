import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '../services/authService'
import { ShopContext } from '../context/ShopContextContext'

const Login = () => {

  const navigate = useNavigate()
  const { loadFavorites } = useContext(ShopContext)
  const [currentState, setCurrentState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (currentState === 'Login') {
        await authService.login(email, password)
        toast.success('Login realizado com sucesso!')
        // Carrega favoritos do banco após login
        await loadFavorites()
        navigate('/')
      } else {
        await authService.register(name, email, password)
        toast.success('Conta criada com sucesso!')
        // Carrega favoritos do banco após cadastro
        await loadFavorites()
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao processar requisição')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 pt-10'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>{currentState}</h2>
          <p className='text-gray-600'>
            {currentState === 'Login' ? 'Entre com sua conta' : 'Crie uma nova conta'}
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {currentState === 'Cadastro' && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Seu nome'
              />
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder='seu@email.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder='Senha'
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className='w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400'
          >
            {loading ? 'Processando...' : currentState}
          </button>
        </form>

        <div className='text-center mt-6'>
          {currentState === 'Login' ? (
            <p className='text-gray-600'>
              Não tem conta?{' '}
              <button
                onClick={() => setCurrentState('Cadastro')}
                className='text-black font-semibold hover:underline'
              >
                Cadastre-se
              </button>
            </p>
          ) : (
            <p className='text-gray-600'>
              Já tem conta?{' '}
              <button
                onClick={() => setCurrentState('Login')}
                className='text-black font-semibold hover:underline'
              >
                Faça login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
