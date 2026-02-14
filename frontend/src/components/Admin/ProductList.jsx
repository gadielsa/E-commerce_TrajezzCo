import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { productService } from '../../services/productService'

const ProductList = ({ refreshTrigger }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [refreshTrigger])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getProducts()
      setProducts(data || [])
    } catch (error) {
      toast.error('Erro ao carregar produtos')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product._id)
    setEditData({
      name: product.name,
      price: product.price,
      isAvailable: product.isAvailable ?? true
    })
  }

  const handleSaveEdit = async () => {
    try {
      const payload = {
        name: editData.name,
        price: editData.price,
        isAvailable: editData.isAvailable ?? true
      }
      await productService.updateProduct(editingId, payload)
      toast.success('Produto atualizado com sucesso!')
      setEditingId(null)
      fetchProducts()
    } catch (error) {
      toast.error(error.message || 'Erro ao atualizar produto')
      console.error('Erro:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id)
      toast.success('Produto deletado com sucesso!')
      setConfirmDeleteId(null)
      fetchProducts()
    } catch (error) {
      toast.error(error.message || 'Erro ao deletar produto')
      console.error('Erro:', error)
    }
  }

  if (loading) {
    return <div className='text-center py-10'>Carregando produtos...</div>
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>Lista de Produtos</h2>

      <div className='overflow-x-auto'>
        <table className='w-full table-fixed'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Nome</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Categoria</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Preço</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Status</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Tamanhos</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700 w-[260px]'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className='border-b border-gray-200 hover:bg-gray-50'>
                <td className='py-4 px-4'>
                  {editingId === product._id ? (
                    <input
                      type='text'
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className='w-full px-2 py-1 border border-gray-300 rounded'
                    />
                  ) : (
                    <span className='text-gray-900 font-medium'>{product.name}</span>
                  )}
                </td>
                <td className='py-4 px-4 text-gray-700'>{product.category}</td>
                <td className='py-4 px-4 text-gray-700'>
                  {editingId === product._id ? (
                    <input
                      type='number'
                      value={editData.price}
                      onChange={(e) => setEditData({...editData, price: parseFloat(e.target.value)})}
                      step='0.01'
                      className='w-24 px-2 py-1 border border-gray-300 rounded'
                    />
                  ) : (
                    `R$ ${product.price.toFixed(2)}`
                  )}
                </td>
                <td className='py-4 px-4 text-gray-700'>
                  {editingId === product._id ? (
                    <div className='relative inline-block w-full min-w-[160px]'>
                      <select
                        value={(editData.isAvailable ?? true) ? 'true' : 'false'}
                        onChange={(e) => setEditData({
                          ...editData,
                          isAvailable: e.target.value === 'true'
                        })}
                        className={`appearance-none w-full px-3 py-2 pr-8 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300 bg-white cursor-pointer hover:border-gray-400 transition-all text-sm ${
                          editData.isAvailable === false ? 'text-red-700' : 'text-green-700'
                        }`}
                      >
                        <option value='true' style={{ color: '#15803d' }}>Disponível</option>
                        <option value='false' style={{ color: '#b91c1c' }}>Indisponível</option>
                      </select>
                      <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
                        <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        product.isAvailable === false
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {product.isAvailable === false ? 'Indisponível' : 'Disponível'}
                    </span>
                  )}
                </td>
                <td className='py-4 px-4 text-gray-700'>{product.sizes?.join(', ') || 'N/A'}</td>
                <td className='py-4 px-4'>
                  <div className='inline-flex items-center gap-2 min-w-[240px]'>
                  {editingId === product._id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className='px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm'
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className='px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition text-sm'
                      >
                        Cancelar
                      </button>
                    </>
                  ) : confirmDeleteId === product._id ? (
                    <>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className='px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm'
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className='px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition text-sm'
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(product)}
                        className='px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm'
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(product._id)}
                        className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm'
                      >
                        Deletar
                      </button>
                    </>
                  )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className='text-center py-10 text-gray-500'>
          Nenhum produto encontrado
        </div>
      )}
    </div>
  )
}

export default ProductList
