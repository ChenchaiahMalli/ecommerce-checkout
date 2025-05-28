import React from 'react'

const ProductCard = ({ product, selectedVariant, quantity, onVariantChange, onQuantityChange, onBuyNow }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <img 
          src={product.image_url || 'https://via.placeholder.com/500'} 
          alt={product.name} 
          className="w-full rounded-lg shadow-md"
        />
      </div>
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-2xl font-semibold mb-6">${product.price.toFixed(2)}</p>
        
        {Object.entries(product.variants).map(([variantName, options]) => (
          <div key={variantName} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {variantName.charAt(0).toUpperCase() + variantName.slice(1)}
            </label>
            <select
              className="input-field"
              onChange={(e) => onVariantChange(variantName, e.target.value)}
              value={selectedVariant[variantName] || ''}
            >
              <option value="">Select {variantName}</option>
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="w-20 input-field"
          />
        </div>
        
        <button
          onClick={onBuyNow}
          className="btn-primary w-full py-3 px-4"
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}

export default ProductCard