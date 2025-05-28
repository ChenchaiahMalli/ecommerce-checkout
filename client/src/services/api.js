import axios from 'axios'

const api = {
  getProduct: (id) => axios.get(`/api/products/${id}`),
  createOrder: (orderData) => axios.post('/api/orders', orderData),
  getOrder: (orderNumber) => axios.get(`/api/orders/${orderNumber}`)
}

export default api