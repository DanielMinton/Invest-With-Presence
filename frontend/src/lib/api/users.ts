import { api } from './client'
import type { PaginatedResponse } from './clients'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name?: string
  role: 'admin' | 'advisor' | 'client'
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  mfa_enabled: boolean
  date_joined: string
  last_login: string | null
}

export const usersApi = {
  async list(params?: Record<string, string>): Promise<PaginatedResponse<User>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/users/${queryString}`)
  },

  async get(id: string): Promise<User> {
    return api.get(`/users/${id}/`)
  },

  async create(data: Partial<User> & { password: string }): Promise<User> {
    return api.post('/users/', data)
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    return api.patch(`/users/${id}/`, data)
  },

  async deactivate(id: string): Promise<{ status: string }> {
    return api.post(`/users/${id}/deactivate/`)
  },

  async activate(id: string): Promise<{ status: string }> {
    return api.post(`/users/${id}/activate/`)
  },

  async resetPassword(id: string): Promise<{ status: string }> {
    return api.post(`/users/${id}/reset_password/`)
  },
}
