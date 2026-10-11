import axios from 'axios'
const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://scamshield-yj85.onrender.com' : '/api')

const baseURL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl

const api = axios.create({ baseURL })

export const analyzeURL = (url) => api.post('/analyze/url', { url })
export const analyzeMessage = (text) => api.post('/analyze/message', { text })
export const getHistory = (limit = 20) => api.get(`/history?limit=${limit}`)
export const getScanDetail = (id) => api.get(`/history/${id}`)
export const clearHistory = () => api.delete('/history')
export const getDemoCases = () => api.get('/demo-cases')
export const runDemoCase = (id) => api.post(`/demo-cases/${id}/run`)
export const getStats = () => api.get('/stats')
