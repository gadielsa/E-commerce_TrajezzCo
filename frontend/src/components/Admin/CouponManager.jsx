import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { couponService } from '../../services/couponService'

const CouponManager = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxUses: '',
    expiryDate: '',
    firstPurchaseOnly: false
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const data = await couponService.getAllCoupons()
      setCoupons(data || [])
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao carregar cupons')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.code || !formData.description || !formData.discountValue || !formData.expiryDate) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    try {
      const couponData = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minPurchaseAmount: parseFloat(formData.minPurchase) || 0,
        usageLimit: formData.maxUses ? parseInt(formData.maxUses) : null,
        validUntil: formData.expiryDate,
        isFirstPurchaseOnly: formData.firstPurchaseOnly
      }

      await couponService.createCoupon(couponData)

      toast.success('Cupom criado com sucesso!')
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchase: '',
        maxUses: '',
        expiryDate: '',
        firstPurchaseOnly: false
      })
      setShowForm(false)
      fetchCoupons()
    } catch (error) {
      toast.error(error.message || 'Erro ao criar cupom')
      console.error('Erro:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await couponService.deleteCoupon(id)

      toast.success('Cupom deletado com sucesso!')
      setConfirmDeleteId(null)
      fetchCoupons()
    } catch (error) {
      toast.error(error.message || 'Erro ao deletar cupom')
      console.error('Erro:', error)
    }
  }

  if (loading) {
    return <div className='text-center py-10'>Carregando cupons...</div>
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Gerenciar Cupons</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className='px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition'
        >
          {showForm ? 'Cancelar' : '+ Novo Cupom'}
        </button>
      </div>

      {/* Formulário de Criação */}
      {showForm && (
        <form onSubmit={handleSubmit} className='bg-gray-50 p-6 rounded-lg mb-6 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Código do Cupom *</label>
              <input
                type='text'
                name='code'
                value={formData.code}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                  setFormData(prev => ({
                    ...prev,
                    code: value
                  }))
                }}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                placeholder='Ex: TRAJEZZ10'
                maxLength='20'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Descrição *</label>
              <input
                type='text'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                placeholder='Ex: 10% OFF em toda a loja'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Tipo de Desconto *</label>
              <div className='relative'>
                <select
                  name='discountType'
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className='appearance-none w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white'
                >
                  <option value='percentage'>Percentual (%)</option>
                  <option value='fixed'>Valor Fixo (R$)</option>
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
                  <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Valor do Desconto *</label>
              <input
                type='text'
                name='discountValue'
                value={formData.discountValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.')
                  setFormData(prev => ({
                    ...prev,
                    discountValue: value
                  }))
                }}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                placeholder={formData.discountType === 'percentage' ? '10' : '50.00'}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Compra Mínima (R$)</label>
              <input
                type='text'
                name='minPurchase'
                value={formData.minPurchase}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.')
                  setFormData(prev => ({
                    ...prev,
                    minPurchase: value
                  }))
                }}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                placeholder='0.00'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Máximo de Usos</label>
              <input
                type='number'
                name='maxUses'
                value={formData.maxUses}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                placeholder='Deixe vazio para ilimitado'
              />
            </div>

            <div className='flex items-center gap-3'>
              <label htmlFor='firstPurchaseOnly' className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  id='firstPurchaseOnly'
                  name='firstPurchaseOnly'
                  checked={formData.firstPurchaseOnly}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    firstPurchaseOnly: e.target.checked
                  }))}
                  className='sr-only'
                />
                <div
                  className={`w-5 h-5 border-2 rounded transition-all ${
                    formData.firstPurchaseOnly
                      ? 'bg-black border-black'
                      : 'bg-white border-gray-300 hover:border-black'
                  }`}
                >
                  {formData.firstPurchaseOnly && (
                    <svg className='w-full h-full text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M5 13l4 4L19 7'></path>
                    </svg>
                  )}
                </div>
                <span className='text-sm font-medium text-gray-900'>Apenas na primeira compra</span>
              </label>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Data de Expiração *</label>
              <input
                type='date'
                name='expiryDate'
                value={formData.expiryDate}
                onChange={handleInputChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
              />
            </div>
          </div>

          <button
            type='submit'
            className='w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition'
          >
            Criar Cupom
          </button>
        </form>
      )}

      {/* Lista de Cupons */}
      <div className='overflow-x-auto'>
        <table className='w-full table-fixed'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Código</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Desconto</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Min. Compra</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Usos / Limite</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Expira em</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700 w-[200px]'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon._id} className='border-b border-gray-200 hover:bg-gray-50'>
                <td className='py-4 px-4 font-bold text-gray-900'>{coupon.code}</td>
                <td className='py-4 px-4 text-gray-700'>
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}%` 
                    : `R$ ${coupon.discountValue.toFixed(2)}`}
                </td>
                <td className='py-4 px-4 text-gray-700'>R$ {coupon.minPurchaseAmount?.toFixed(2) || '0.00'}</td>
                <td className='py-4 px-4 text-gray-700'>
                  {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
                </td>
                <td className='py-4 px-4 text-gray-700'>
                  {coupon.validUntil 
                    ? new Date(coupon.validUntil).toLocaleDateString('pt-BR')
                    : 'Sem limite'}
                </td>
                <td className='py-4 px-4'>
                  <div className='inline-flex items-center gap-2 min-w-[170px]'>
                    {confirmDeleteId === coupon._id ? (
                      <>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className='px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition text-sm'
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className='px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm'
                        >
                          Confirmar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(coupon._id)}
                        className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm'
                      >
                        Deletar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {coupons.length === 0 && (
        <div className='text-center py-10 text-gray-500'>
          Nenhum cupom criado ainda
        </div>
      )}
    </div>
  )
}

export default CouponManager
