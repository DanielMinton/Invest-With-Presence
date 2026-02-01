export { api, type ApiError } from './client'
export { authApi } from './auth'

export { clientsApi, householdsApi, accountsApi } from './clients'
export type { Client, Household, Account, PaginatedResponse } from './clients'

export { documentsApi, documentCategoriesApi } from './documents'
export type { Document, DocumentCategory, DocumentUpload } from './documents'

export { briefingsApi, briefingTemplatesApi, notificationsApi } from './briefings'
export type { Briefing, BriefingTemplate, Notification } from './briefings'

export { dashboardApi, auditApi, settingsApi } from './dashboard'
export type { DashboardStats, ActivityItem, AuditLog, Settings } from './dashboard'

export { usersApi } from './users'
export type { User } from './users'
