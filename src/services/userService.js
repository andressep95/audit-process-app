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
  async updateUser(userData) {
    try {
      const response = await apiClient.put('/users', userData)
      return response.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },
  async toggleUserStatus({ email, enabled }) {
    try {
      const response = await apiClient.patch('/users', null, {
        params: { email, enabled },
      })
      return response.data
    } catch (error) {
      console.error('Error toggling user status:', error)
      throw error
    }
  },
}
