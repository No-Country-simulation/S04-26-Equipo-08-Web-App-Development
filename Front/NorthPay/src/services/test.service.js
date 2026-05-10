import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
  },
})

export const testService = {
  async healthCheck() {
    const response = await api.get('/health')
    return response.data
  },

  async adminCheck() {
    const response = await api.get('/admin-check')
    return response.data
  },
}