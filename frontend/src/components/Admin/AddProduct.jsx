import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { productService } from '../../services/productService'

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Tênis',
    subCategory: '',
    sizes: [],
    isBestseller: false,
    isAvailable: true,
    images: [],
    sizeType: 'clothing'
  })

  const [imagePreview, setImagePreview] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  const categories = ['Tênis', 'Roupas', 'Acessórios']
  const subCategories = {
    'Tênis': [],
    'Roupas': ['Camisetas', 'Shorts', 'Calças', 'Regatas', 'Moletons', 'Jaquetas e Casacos', 'Infantil'],
    'Acessórios': ['Boné', 'Cinto', 'Shoulder Bag']
  }

  const sizes = ['P', 'M', 'G', 'GG', 'XG']
  const shoeSizes = Array.from({ length: 43 - 35 + 1 }, (_, i) => (35 + i).toString())

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => {
      const nextValue = type === 'checkbox' ? checked : value
      if (name === 'category') {
        return {
          ...prev,
          category: nextValue,
          subCategory: subCategories[nextValue]?.[0] || ''
        }
      }

      return {
        ...prev,
        [name]: nextValue
      }
    })
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length + formData.images.length > 4) {
      toast.error('Máximo de 4 imagens permitidas')
      return
    }

    setUploadingImages(true)
    
    try {
      for (const file of files) {
        // Upload para Cloudinary via backend
        const imageUrl = await productService.uploadImage(file)
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }))
        setImagePreview(prev => [...prev, imageUrl])
      }
      
      toast.success('Imagens carregadas com sucesso!')
    } catch (error) {
      toast.error(error.message || 'Erro ao fazer upload das imagens')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validação
    if (!formData.name.trim()) {
      toast.error('Nome do produto é obrigatório')
      return
    }
    if (!formData.description.trim()) {
      toast.error('Descrição é obrigatória')
      return
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Preço válido é obrigatório')
      return
    }
    if (formData.sizes.length === 0) {
      toast.error('Selecione pelo menos um tamanho')
      return
    }
    if (formData.images.length === 0) {
      toast.error('Adicione pelo menos uma imagem')
      return
    }

    setUploading(true)

    try {
      // Criar novo produto via API
      const newProduct = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        images: formData.images,
        category: formData.category,
        sizes: formData.sizes,
        isBestseller: formData.isBestseller,
        isAvailable: formData.isAvailable,
        sizeType: formData.sizeType
      }

      if (formData.subCategory) {
        newProduct.subCategory = formData.subCategory
      }

      await productService.createProduct(newProduct)
      
      toast.success(`Produto "${formData.name}" adicionado com sucesso!`)
      
      // Limpar formulário
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Tênis',
        subCategory: '',
        sizes: [],
        isBestseller: false,
        isAvailable: true,
        images: [],
        sizeType: 'clothing'
      })
      setImagePreview([])
      
      // Recarregar página após 1 segundo para mostrar novo produto
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      toast.error(error.message || 'Erro ao adicionar produto')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
      <h2 className='text-3xl font-bold text-gray-900 mb-8'>Adicionar Novo Produto</h2>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Upload de Imagens */}
        <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-all'>
          <h3 className='text-lg font-semibold mb-4 text-gray-900'>Imagens do Produto</h3>
          <div className='flex gap-4 mb-4 flex-wrap'>
            {imagePreview.map((img, idx) => (
              <div key={idx} className='relative'>
                <img src={img} alt='preview' className='h-24 w-24 object-cover rounded' />
                <button
                  type='button'
                  onClick={() => removeImage(idx)}
                  className='absolute -top-2 -right-2 bg-red-500 text-white rounded px-2 py-1 text-xs font-semibold hover:bg-red-600 transition-all'
                >
                  Remover
                </button>
              </div>
            ))}
            {formData.images.length < 4 && (
              <label className='h-24 w-24 border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-all'>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
                <span className='text-xs font-medium text-gray-600'>Adicionar</span>
              </label>
            )}
          </div>
          <p className='text-sm text-gray-500'>Máximo de 4 imagens. Tamanho máximo: 5MB cada</p>
        </div>

        {/* Nome do Produto */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Nome do Produto</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            placeholder='Digite o nome do produto'
            className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black hover:border-gray-400 transition-all'
          />
        </div>

        {/* Descrição */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Descrição</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            placeholder='Digite a descrição completa do produto'
            rows='4'
            className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black hover:border-gray-400 transition-all'
          ></textarea>
        </div>

        {/* Categoria, Subcategoria e Preço */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Categoria</label>
            <div className='relative'>
              <select
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                className='appearance-none w-full px-4 py-2 pr-8 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white cursor-pointer hover:border-gray-400 transition-all'
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
                <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Subcategoria</label>
            <div className='relative'>
              <select
                name='subCategory'
                value={formData.subCategory}
                onChange={handleInputChange}
                className='appearance-none w-full px-4 py-2 pr-8 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white cursor-pointer hover:border-gray-400 transition-all'
              >
                {(subCategories[formData.category] || []).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none'>
                <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Preço (R$)</label>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleInputChange}
              placeholder='0.00'
              step='0.01'
              min='0'
              className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black hover:border-gray-400 transition-all'
            />
          </div>
        </div>

        {/* Tipo de Tamanho */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>Tipo de Tamanho</label>
          <div className='flex gap-3 mb-4'>
            <button
              type='button'
              onClick={() => {
                setFormData(prev => ({ ...prev, sizeType: 'clothing', sizes: [] }))
              }}
              className={`px-6 py-2 rounded-lg border-2 font-semibold transition-all ${
                formData.sizeType === 'clothing'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              Roupas (P, M, G)
            </button>
            <button
              type='button'
              onClick={() => {
                setFormData(prev => ({ ...prev, sizeType: 'shoes', sizes: [] }))
              }}
              className={`px-6 py-2 rounded-lg border-2 font-semibold transition-all ${
                formData.sizeType === 'shoes'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              Calçados (35-43)
            </button>
          </div>
        </div>

        {/* Tamanhos */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>Tamanhos Disponíveis</label>
          <div className='flex gap-2 flex-wrap'>
            {(formData.sizeType === 'clothing' ? sizes : shoeSizes).map(size => (
              <button
                key={size}
                type='button'
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                  formData.sizes.includes(size)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
          <label htmlFor='bestseller' className='flex items-center gap-3 cursor-pointer'>
            <input
              type='checkbox'
              id='bestseller'
              name='isBestseller'
              checked={formData.isBestseller}
              onChange={handleInputChange}
              className='sr-only'
            />
            <div 
              className={`w-5 h-5 border-2 rounded transition-all ${
                formData.isBestseller 
                  ? 'bg-black border-black' 
                  : 'bg-white border-gray-300 hover:border-black'
              }`}
            >
              {formData.isBestseller && (
                <svg className='w-full h-full text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M5 13l4 4L19 7'></path>
                </svg>
              )}
            </div>
            <span className='text-sm font-medium text-gray-900'>
              Marcar como Produto em Destaque
            </span>
          </label>
        </div>

        {/* Disponibilidade */}
        <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
          <label htmlFor='available' className='flex items-center gap-3 cursor-pointer'>
            <input
              type='checkbox'
              id='available'
              name='isAvailable'
              checked={formData.isAvailable}
              onChange={handleInputChange}
              className='sr-only'
            />
            <div 
              className={`w-5 h-5 border-2 rounded transition-all ${
                formData.isAvailable 
                  ? 'bg-black border-black' 
                  : 'bg-white border-gray-300 hover:border-black'
              }`}
            >
              {formData.isAvailable && (
                <svg className='w-full h-full text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M5 13l4 4L19 7'></path>
                </svg>
              )}
            </div>
            <span className='text-sm font-medium text-gray-900'>
              Produto Disponível
            </span>
          </label>
        </div>

        {/* Botão Submit */}
        <button
          type='submit'
          disabled={uploading || uploadingImages}
          className='w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all active:scale-95 text-lg disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {uploading ? 'Adicionando produto...' : uploadingImages ? 'Fazendo upload das imagens...' : 'Adicionar Produto ao Catálogo'}
        </button>
      </form>
    </div>
  )
}

export default AddProduct
