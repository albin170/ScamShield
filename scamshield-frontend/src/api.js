import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const analyzeURL = (url) => api.post('/analyze/url', { url })
export const analyzeMessage = (text) => api.post('/analyze/message', { text })
export const getHistory = (limit = 20) => api.get(`/history?limit=${limit}`)
export const getScanDetail = (id) => api.get(`/history/${id}`)
export const clearHistory = () => api.delete('/history')
export const getDemoCases = () => api.get('/demo-cases')
export const runDemoCase = (id) => api.post(`/demo-cases/${id}/run`)
export const getStats = () => api.get('/stats')
