import { api } from './client'
import type { PaginatedResponse } from './clients'

export interface BriefingTemplate {
  id: string
  name: string
  template_type: string
  template_type_display: string
  description: string
  subject_template: string
  body_template: string
  available_variables: string[]
  is_active: boolean
  requires_approval: boolean
  usage_count: number
  created_at: string
}

export interface Briefing {
  id: string
  title: string
  subject: string
  household: string | null
  household_name: string | null
  client: string | null
  client_name: string | null
  template: string | null
  template_name: string | null
  body_markdown: string
  body_html: string
  status: 'draft' | 'pending_review' | 'approved' | 'sent' | 'failed'
  status_display: string
  delivery_method: 'email' | 'portal' | 'both'
  delivery_method_display: string
  scheduled_for: string | null
  sent_at: string | null
  opened_at: string | null
  created_by: string | null
  created_by_name: string | null
  approved_by: string | null
  approved_by_name: string | null
  approved_at: string | null
  period_start: string | null
  period_end: string | null
  attachment_count: number
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  title: string
  message: string
  notification_type: 'info' | 'warning' | 'alert' | 'success' | 'task'
  notification_type_display: string
  link: string
  link_text: string
  is_read: boolean
  read_at: string | null
  created_at: string
}

export const briefingsApi = {
  async list(params?: Record<string, string>): Promise<PaginatedResponse<Briefing>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/briefings/${queryString}`)
  },

  async get(id: string): Promise<Briefing> {
    return api.get(`/briefings/${id}/`)
  },

  async create(data: Partial<Briefing>): Promise<Briefing> {
    return api.post('/briefings/', data)
  },

  async update(id: string, data: Partial<Briefing>): Promise<Briefing> {
    return api.patch(`/briefings/${id}/`, data)
  },

  async approve(id: string): Promise<Briefing> {
    return api.post(`/briefings/${id}/approve/`)
  },

  async send(id: string): Promise<Briefing> {
    return api.post(`/briefings/${id}/send/`)
  },

  async getPending(): Promise<Briefing[]> {
    return api.get('/briefings/pending/')
  },

  async getScheduled(): Promise<Briefing[]> {
    return api.get('/briefings/scheduled/')
  },
}

export const briefingTemplatesApi = {
  async list(): Promise<PaginatedResponse<BriefingTemplate>> {
    return api.get('/briefing-templates/')
  },

  async get(id: string): Promise<BriefingTemplate> {
    return api.get(`/briefing-templates/${id}/`)
  },
}

export const notificationsApi = {
  async list(params?: Record<string, string>): Promise<PaginatedResponse<Notification>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/notifications/${queryString}`)
  },

  async getUnread(): Promise<{ count: number; notifications: Notification[] }> {
    return api.get('/notifications/unread/')
  },

  async markRead(notificationIds?: string[]): Promise<{ marked_read: number }> {
    if (notificationIds) {
      return api.post('/notifications/mark_read/', { notification_ids: notificationIds })
    }
    return api.post('/notifications/mark_read/', { mark_all: true })
  },

  async markOneRead(id: string): Promise<Notification> {
    return api.post(`/notifications/${id}/read/`)
  },
}
