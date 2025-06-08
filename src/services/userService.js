// src/services/UserService.js
import apiClient from '@/services/api'

export default {
  async getUsers() {
    try {
      const response = await apiClient.get('/users')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },
  async createUser(userData) {
    try {
      const response = await apiClient.post('/users', userData)
      return response.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },
}
