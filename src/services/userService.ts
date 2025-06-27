// src/services/UserService.ts
import apiClient from '@/services/api'
import type { User, UserInput } from '@/models/User'

const UserService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/users')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  async createUser(userData: UserInput): Promise<User> {
    try {
      const response = await apiClient.post<User>('/users', userData)
      return response.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  async updateUser(userData: UserInput): Promise<User> {
    try {
      const response = await apiClient.put<User>('/users', userData)
      return response.data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  async toggleUserStatus(params: { email: string; enabled: boolean }): Promise<User> {
    try {
      const response = await apiClient.patch<User>('/users', null, {
        params,
      })
      return response.data
    } catch (error) {
      console.error('Error toggling user status:', error)
      throw error
    }
  },
}

export default UserService
