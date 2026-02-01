import { api } from './client'

export interface Client {
  id: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string
  client_type: 'individual' | 'joint' | 'trust' | 'entity' | 'ira'
  household: string | null
  household_name: string | null
  portal_enabled: boolean
  risk_tolerance: string
  time_horizon: string
  is_active: boolean
  onboarded_at: string | null
  account_count: number
  total_value: number | null
  created_at: string
  updated_at: string
}

export interface Household {
  id: string
  name: string
  notes: string
  client_count: number
  total_value: number | null
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  account_number: string
  name: string
  account_type: string
  client: string
  client_name: string
  household: string | null
  household_name: string | null
  custodian: string
  is_active: boolean
  opened_date: string | null
  created_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const clientsApi = {
  async list(params?: Record<string, string>): Promise<PaginatedResponse<Client>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/clients/${queryString}`)
  },

  async get(id: string): Promise<Client> {
    return api.get(`/clients/${id}/`)
  },

  async create(data: Partial<Client>): Promise<Client> {
    return api.post('/clients/', data)
  },

  async update(id: string, data: Partial<Client>): Promise<Client> {
    return api.patch(`/clients/${id}/`, data)
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/clients/${id}/`)
  },

  async getAccounts(id: string): Promise<Account[]> {
    return api.get(`/clients/${id}/accounts/`)
  },
}

export const householdsApi = {
  async list(params?: Record<string, string>): Promise<PaginatedResponse<Household>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/households/${queryString}`)
  },

  async get(id: string): Promise<Household> {
    return api.get(`/households/${id}/`)
  },

  async create(data: Partial<Household>): Promise<Household> {
    return api.post('/households/', data)
  },

  async update(id: string, data: Partial<Household>): Promise<Household> {
    return api.patch(`/households/${id}/`, data)
  },

  async getClients(id: string): Promise<Client[]> {
    return api.get(`/households/${id}/clients/`)
  },

  async getAccounts(id: string): Promise<Account[]> {
    return api.get(`/households/${id}/accounts/`)
  },
}

export const accountsApi = {
  async list(params?: Record<string, string>): Promise<PaginatedResponse<Account>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/accounts/${queryString}`)
  },

  async get(id: string): Promise<Account> {
    return api.get(`/accounts/${id}/`)
  },
}
