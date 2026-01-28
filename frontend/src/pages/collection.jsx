import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [sortType, setSortType] = useState('relevante')
  const [priceRange, setPriceRange] = useState([0, 1000])

  const toggleCategory = (e) => {
    if(category.includes(e.target.value)){
      setCategory(category.filter(item => item !== e.target.value))
    }
    else{
      setCategory([...category, e.target.value])
    }
  }

  const applyFilter = () => {
    // Apenas produtos marcados explicitamente como unavailable (available === false) serão ocultos.
    let productsCopy = products.slice().filter(item => item.available !== false)

    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if(category.length > 0){
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }

    if(priceRange){
      productsCopy = productsCopy.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1])
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
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIA</p>
          <div className='flex flex-col gap-2 text-sm text-gray-700'>
            <label className='flex gap-2 cursor-pointer'>
              <input type="checkbox" value={'Sneaker'} onChange={toggleCategory} /> Sneaker
            </label>
            <label className='flex gap-2 cursor-pointer'>
              <input type="checkbox" value={'Casual'} onChange={toggleCategory} /> Casual
            </label>
            <label className='flex gap-2 cursor-pointer'>
              <input type="checkbox" value={'Sports'} onChange={toggleCategory} /> Sports
            </label>
          </div>
        </div>

        {/* Filtro de Preço */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>PREÇO</p>
          <div className='flex gap-3 text-gray-700'>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value || 0), priceRange[1]])}
              placeholder='Min'
              className='w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black'
            />
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value || 0)])}
              placeholder='Max'
              className='w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-black'
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
          <select value={sortType} onChange={(e)=>setSortType(e.target.value)} className='border border-gray-300 text-sm px-2 py-2'>
            <option value="relevante">Ordenar: Relevância</option>
            <option value="baixo-alto">Preço: Menor para Maior</option>
            <option value="alto-baixo">Preço: Maior para Menor</option>
          </select>
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
