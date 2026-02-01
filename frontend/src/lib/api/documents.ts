import { api } from './client'
import type { PaginatedResponse } from './clients'

export interface DocumentCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  document_count: number
}

export interface Document {
  id: string
  title: string
  description: string
  category: string | null
  category_name: string | null
  tags: string[]
  household: string | null
  household_name: string | null
  client: string | null
  client_name: string | null
  file: string
  file_url: string
  file_name: string
  file_size: number
  file_size_display: string
  file_type: string
  status: 'draft' | 'active' | 'archived'
  version: number
  uploaded_by: string | null
  uploaded_by_name: string | null
  effective_date: string | null
  expiration_date: string | null
  is_confidential: boolean
  client_visible: boolean
  created_at: string
  updated_at: string
}

export interface DocumentUpload {
  title: string
  description?: string
  category?: string
  tags?: string[]
  household?: string
  client?: string
  file: File
  effective_date?: string
  is_confidential?: boolean
  client_visible?: boolean
}

export const documentsApi = {
  async list(params?: Record<string, string>): Promise<PaginatedResponse<Document>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get(`/documents/${queryString}`)
  },

  async get(id: string): Promise<Document> {
    return api.get(`/documents/${id}/`)
  },

  async upload(data: DocumentUpload): Promise<Document> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'tags' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value as string | Blob)
        }
      }
    })

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/documents/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('bastion-auth') ? JSON.parse(localStorage.getItem('bastion-auth')!).state?.tokens?.access : ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    return response.json()
  },

  async download(id: string): Promise<{ download_url: string; file_name: string; file_type: string }> {
    return api.get(`/documents/${id}/download/`)
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/documents/${id}/`)
  },

  async getRecent(): Promise<Document[]> {
    return api.get('/documents/recent/')
  },
}

export const documentCategoriesApi = {
  async list(): Promise<DocumentCategory[]> {
    const response = await api.get<PaginatedResponse<DocumentCategory>>('/document-categories/')
    return response.results || response as unknown as DocumentCategory[]
  },
}
