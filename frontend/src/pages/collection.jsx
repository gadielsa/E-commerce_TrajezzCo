import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContextContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [sortType, setSortType] = useState('relevante')
  const [priceRange, setPriceRange] = useState(['', ''])

  const toggleCategory = (e) => {
    const value = (e.target.value || '').toLowerCase().trim()
    if(category.includes(value)){
      setCategory(category.filter(item => item !== value))
    }
    else{
      setCategory([...category, value])
    }
  }

  const applyFilter = () => {
    // Proteção contra products undefined
    if (!products || !Array.isArray(products)) {
      console.warn('Collection - products inválido:', products)
      return []
    }
    
    // Apenas produtos marcados explicitamente como indisponíveis serão ocultos.
    let productsCopy = products.slice().filter(item => item.isAvailable !== false)

    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if(category.length > 0){
      productsCopy = productsCopy.filter(item => category.includes((item.category || '').toLowerCase().trim()))
    }

    if (priceRange && (priceRange[0] !== '' || priceRange[1] !== '')) {
      const min = priceRange[0] === '' ? 0 : parseFloat(priceRange[0])
      const max = priceRange[1] === '' ? Number.MAX_SAFE_INTEGER : parseFloat(priceRange[1])
      productsCopy = productsCopy.filter(item => item.price >= min && item.price <= max)
    }

    return productsCopy
  }

  const applySort = (productsToSort) => {
    switch(sortType){
      case 'baixo-alto':
        return productsToSort.sort((a,b) => a.price - b.price)
      case 'alto-baixo':
        return productsToSort.sort((a,b) => b.price - a.price)
      default:
        return productsToSort
    }
  }

  useEffect(()=>{
    let filtered = applyFilter()
    let sorted = applySort(filtered)
    setFilterProducts(sorted)
  },[category, products, sortType, search, showSearch, priceRange])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* Filtros */}
      <div className='min-w-64'>
        
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2 font-bold'>FILTROS
          <span className={`text-2xl sm:hidden ${showFilter ? '' : 'rotate-90'}`}>⌄</span>
        </p>

        {/* Filtro de Categoria */}
        <div className={`border border-gray-200 rounded-lg px-5 py-4 mt-6 bg-white shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIA</p>
          <div className='flex flex-col gap-3 text-sm text-gray-700'>
            {['Tênis', 'Roupas', 'Acessórios'].map((cat) => (
              <label key={cat} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  value={cat}
                  onChange={toggleCategory}
                  className='h-4 w-4 rounded border-gray-300 text-black focus:ring-black'
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Filtro de Preço */}
        <div className={`border border-gray-200 rounded-lg px-5 py-4 my-5 bg-white shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>PREÇO</p>
          <div className='flex gap-3 text-gray-700'>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
              placeholder='Min'
              className='w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black'
            />
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
              placeholder='Max'
              className='w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black'
            />
          </div>
        </div>

      </div>

      {/* Produtos */}
      <div className='flex-1'>
        
        <div className='flex justify-between items-center mb-4'>
          <div className='text-2xl'>
            <Title text1={'EM'} text2={'ESTOQUE'}/>
          </div>
        </div>

        <div className='my-8 flex justify-between items-center'>
          <p className='text-gray-700 text-sm'>Mostrando {filterProducts.length} produtos</p>
          <div className='relative'>
            <select value={sortType} onChange={(e)=>setSortType(e.target.value)} className='appearance-none border border-gray-300 rounded-lg text-sm px-3 py-2 pr-8 bg-white hover:border-gray-400 focus:ring-2 focus:ring-black focus:outline-none transition-all'>
              <option value="relevante">Ordenar: Relevância</option>
              <option value="baixo-alto">Preço: Menor para Maior</option>
              <option value="alto-baixo">Preço: Maior para Menor</option>
            </select>
            <svg className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
            </svg>
          </div>
        </div>

        {/* Grid de produtos */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item, index) => (
              <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
            ))
          }
        </div>

        {filterProducts.length === 0 && (
          <div className='text-center py-20'>
            <p className='text-gray-500 text-lg'>Nenhum produto encontrado</p>
          </div>
        )}

      </div>

    </div>
  )
}

export default Collection
