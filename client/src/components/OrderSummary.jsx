import React from 'react'

const OrderSummary = ({ product, selectedVariant, quantity, subtotal, total }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Product:</span>
        <span>{product.name}</span>
      </div>
      
      {Object.values(selectedVariant).length > 0 && (
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Variant:</span>
          <span>{Object.values(selectedVariant).join(', ')}</span>
        </div>
      )}
      
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Quantity:</span>
        <span>{quantity}</span>
      </div>
      
      <div className="border-t border-gray-200 my-3"></div>
      
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      
      <div className="border-t border-gray-200 my-3"></div>
      
      <div className="flex justify-between font-semibold text-lg">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default OrderSummary