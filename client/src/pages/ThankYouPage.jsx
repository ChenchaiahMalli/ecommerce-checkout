import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'

const ThankYouPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderNumber, status } = location.state || {}
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber) {
      navigate('/')
      return
    }

    const fetchOrder = async () => {
      try {
        const response = await api.getOrder(orderNumber)
        setOrder(response.data)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderNumber, navigate])

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  if (!order) return (
    <div className="container mx-auto p-4 max-w-4xl text-center">
      <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
      <p className="mb-4">We couldn't find your order details.</p>
      <button
        onClick={() => navigate('/')}
        className="btn-primary px-6 py-2"
      >
        Back to Home
      </button>
    </div>
  )

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {status === 'approved' ? (
        <div className="text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-lg mb-8">
            Your order has been placed successfully. A confirmation email has been sent to {order.email}.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg text-left max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <p className="mb-2"><strong>Order Number:</strong> {order.order_number}</p>
            <p className="mb-2"><strong>Status:</strong> <span className="capitalize">{order.transaction_status}</span></p>
            <p className="mb-2"><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            
            <div className="border-t border-gray-200 my-4"></div>
            
            <h3 className="font-semibold mb-2">Items Ordered</h3>
            <div className="flex justify-between mb-1">
              <span>{order.product_name} {order.variant_value ? `(${order.variant_value})` : ''}</span>
              <span>${order.product_price.toFixed(2)} × {order.quantity}</span>
            </div>
            
            <div className="border-t border-gray-200 my-4"></div>
            
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-200 my-4"></div>
            
            <h3 className="font-semibold mb-2">Shipping Information</h3>
            <p>{order.full_name}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.state} {order.zip_code}</p>
            <p className="mt-2">{order.email}</p>
            <p>{order.phone}</p>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="mt-8 btn-primary px-6 py-2"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">✗</div>
          <h1 className="text-3xl font-bold mb-4">Order Failed</h1>
          <p className="text-lg mb-8">
            We're sorry, but your order could not be completed because the transaction was {order.transaction_status}.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg text-left max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <p className="mb-2"><strong>Order Number:</strong> {order.order_number}</p>
            <p className="mb-2"><strong>Status:</strong> <span className="capitalize">{order.transaction_status}</span></p>
            
            <div className="border-t border-gray-200 my-4"></div>
            
            <p className="mb-4">
              Please try again or contact our support team if you need assistance.
            </p>
            
            <button
              onClick={() => navigate('/checkout', { state: location.state })}
              className="btn-primary px-4 py-2"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThankYouPage