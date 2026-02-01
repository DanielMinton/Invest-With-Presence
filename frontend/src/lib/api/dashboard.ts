import { api } from './client'

export interface DashboardStats {
  total_aum: number
  total_clients: number
  total_households: number
  total_accounts: number
  pending_tasks: number
  pending_briefings: number
}

export interface ActivityItem {
  id: string
  type: 'auth' | 'data' | 'document' | 'briefing' | 'admin' | 'system' | 'other'
  title: string
  description: string
  user: string
  timestamp: string
  event_type: string
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    return api.get('/dashboard/stats/')
  },

  async getActivity(limit = 10): Promise<ActivityItem[]> {
    return api.get(`/dashboard/activity/?limit=${limit}`)
  },
}

export interface AuditLog {
  id: string
  timestamp: string
  event_type: string
  severity: string
  user_email: string
  target_type: string
  target_id: string
  target_repr: string
  description: string
  ip_address: string
  data: Record<string, unknown>
}

export const auditApi = {
  async list(params?: Record<string, string>): Promise<{ count: number; results: AuditLog[] }> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/audit-logs/${queryString}`)
  },

  async export(params?: Record<string, string>): Promise<AuditLog[]> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/audit-logs/export/${queryString}`)
  },
}

export interface Settings {
  company_name: string
  timezone: string
  date_format: string
  currency: string
  email_notifications: boolean
  mfa_required: boolean
  session_timeout_minutes: number
  password_expiry_days: number
}

export const settingsApi = {
  async get(): Promise<Settings> {
    return api.get('/settings/')
  },

  async update(data: Partial<Settings>): Promise<{ status: string }> {
    return api.patch('/settings/', data)
  },
}
