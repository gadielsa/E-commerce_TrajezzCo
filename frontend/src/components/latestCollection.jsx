import React, { useContext } from 'react'
import { shopContext } from '../context/shopContext'

const latestCollection = () => {

  const { products } = useContext(shopContext)

  console.log(products)

  return (
    <div>
      
    </div>
  )
}

export default latestCollection
