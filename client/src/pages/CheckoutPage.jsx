import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'
import OrderSummary from '../components/OrderSummary'

const CheckoutPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { product, selectedVariant, quantity } = location.state || {}
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    simulationType: '1'
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!product) navigate('/')
  }, [product, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    const cardRegex = /^\d{16}$/
    const cvvRegex = /^\d{3}$/
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!emailRegex.test(formData.email)) newErrors.email = 'Valid email is required'
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Valid phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required'
    if (!cardRegex.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Valid card number is required'
    
    const today = new Date()
    const [month, year] = formData.expiryDate.split('/')
    const expiryDate = new Date(`20${year}`, month - 1)
    if (!formData.expiryDate || expiryDate < today) newErrors.expiryDate = 'Valid future date is required'
    
    if (!cvvRegex.test(formData.cvv)) newErrors.cvv = 'Valid CVV is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const response = await api.createOrder({
        productId: product.id,
        variant: Object.values(selectedVariant)[0],
        quantity,
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        simulationType: formData.simulationType
      })
      
      navigate('/thank-you', { 
        state: { 
          orderNumber: response.data.orderNumber, 
          status: response.data.status 
        } 
      })
    } catch (error) {
      console.error('Order submission error:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!product) return null

  const subtotal = product.price * quantity
  const total = subtotal

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            
            {/* Form fields for customer information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            
            {/* More form fields... */}
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Payment Information</h2>
            
            {/* Payment form fields... */}
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Simulation</label>
              <select
                name="simulationType"
                value={formData.simulationType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="1">Approved Transaction</option>
                <option value="2">Declined Transaction</option>
                <option value="3">Gateway Failure</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select the transaction outcome to simulate (for testing purposes)
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-6 disabled:bg-blue-400"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div className="md:w-1/3">
          <OrderSummary 
            product={product}
            selectedVariant={selectedVariant}
            quantity={quantity}
            subtotal={subtotal}
            total={total}
          />
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage