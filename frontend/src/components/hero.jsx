import React, { useContext, useEffect, useMemo, useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContextContext'

const Hero = () => {
  const { products } = useContext(ShopContext)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true)

  const recentProductImages = useMemo(() => {
    const now = new Date()
    const lastMonth = new Date(now)
    lastMonth.setMonth(now.getMonth() - 1)

    const recentProducts = (products || []).filter((product) => {
      const productDate = product?.createdAt ? new Date(product.createdAt) : product?.updatedAt ? new Date(product.updatedAt) : null
      return productDate && productDate >= lastMonth && productDate <= now
    })

    const images = recentProducts
      .map((product) => (Array.isArray(product.image) ? product.image[0] : Array.isArray(product.images) ? product.images[0] : product.image))
      .filter(Boolean)

    return images
  }, [products])

  const heroImages = recentProductImages.length > 0 ? recentProductImages : [assets.jezz_image]

  useEffect(() => {
    if (heroImages.length <= 1) {
      setCurrentImageIndex(0)
      return
    }

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [heroImages.length])

  useEffect(() => {
    if (heroImages.length <= 1) {
      return
    }

    if (currentImageIndex === heroImages.length) {
      const timeoutId = setTimeout(() => {
        setIsTransitionEnabled(false)
        setCurrentImageIndex(0)
      }, 700)

      return () => clearTimeout(timeoutId)
    }
  }, [currentImageIndex, heroImages.length])

  useEffect(() => {
    if (!isTransitionEnabled) {
      const rafId = requestAnimationFrame(() => {
        setIsTransitionEnabled(true)
      })

      return () => cancelAnimationFrame(rafId)
    }
  }, [isTransitionEnabled])

  return (
    <div className='flex flex-col sm:flex-row overflow-hidden bg-gradient-to-br from-gray-50 to-white'>
      {/* Hero - Lado esquerdo */}
      <div className='w-full sm:w-3/5 flex items-center justify-center py-20 sm:py-0 px-5 sm:px-0'>
        <div className='text-center sm:text-left'>
          <div className='flex items-center gap-3 justify-center sm:justify-start mb-4'>
            <p className='w-8 md:w-12 h-[2px] bg-gray-800'></p>
            <p className='font-semibold text-sm md:text-base text-gray-700 uppercase tracking-wider'>NOVA COLEÇÃO</p>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6'>
            LANÇAMENTOS<br/>DA SEASON
          </h1>
          <p className='text-gray-600 text-base md:text-lg mb-8 max-w-md'>
            Descubra os modelos mais esperados do ano com tecnologia de ponta e design exclusivo.
          </p>
                <Link to='/estoque' className='inline-block bg-black text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105'>
            EXPLORAR AGORA
          </Link>
        </div>
      </div>
      {/* Hero - Lado direito */}
      <div className='w-full sm:w-2/5 relative flex items-center justify-center py-0'>
        <div className='relative overflow-hidden bg-gray-100 rounded-lg w-full aspect-square group'>
          <div
            className={`flex h-full ${isTransitionEnabled ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {heroImages.map((src, index) => (
              <div className='w-full h-full flex-shrink-0' key={`${src}-${index}`}>
                <img
                  className='w-full h-full object-cover'
                  src={src}
                  alt='Nova coleção'
                />
              </div>
            ))}
            {heroImages.length > 1 && (
              <div className='w-full h-full flex-shrink-0' key={`${heroImages[0]}-clone`}>
                <img
                  className='w-full h-full object-cover'
                  src={heroImages[0]}
                  alt='Nova coleção'
                />
              </div>
            )}
          </div>
          <div className='absolute inset-0 bg-transparent group-hover:bg-black/10 transition-all duration-300 pointer-events-none'></div>
        </div>
      </div>
    </div>
  )
}

export default Hero
