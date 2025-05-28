import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

const LandingPage = () => {
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState({})
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.getProduct(1)
        setProduct(response.data)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }
    fetchProduct()
  }, [])

  const handleVariantChange = (type, value) => {
    setSelectedVariant(prev => ({ ...prev, [type]: value }))
  }

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: { product, selectedVariant, quantity }
    })
  }

  if (!product) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <ProductCard 
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        onVariantChange={handleVariantChange}
        onQuantityChange={setQuantity}
        onBuyNow={handleBuyNow}
      />
    </div>
  )
}

export default LandingPage