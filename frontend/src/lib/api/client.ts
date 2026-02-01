import { useAuthStore } from '@/lib/stores/auth-store'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface RequestOptions extends RequestInit {
  requireAuth?: boolean
}

interface ApiError {
  message: string
  status: number
  details?: Record<string, string[]>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async refreshToken(): Promise<string | null> {
    const { tokens, updateAccessToken, logout } = useAuthStore.getState()

    if (!tokens?.refresh) {
      logout()
      return null
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: tokens.refresh }),
      })

      if (!response.ok) {
        logout()
        return null
      }

      const data = await response.json()
      updateAccessToken(data.access)
      return data.access
    } catch {
      logout()
      return null
    }
  }

  private getHeaders(requireAuth: boolean): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (requireAuth) {
      const { tokens } = useAuthStore.getState()
      if (tokens?.access) {
        headers['Authorization'] = `Bearer ${tokens.access}`
      }
    }

    return headers
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requireAuth = true, ...fetchOptions } = options

    const url = `${this.baseUrl}${endpoint}`
    const headers = this.getHeaders(requireAuth)

    let response = await fetch(url, {
      ...fetchOptions,
      headers: { ...headers, ...fetchOptions.headers },
    })

    // Handle token refresh on 401
    if (response.status === 401 && requireAuth) {
      const newToken = await this.refreshToken()
      if (newToken) {
        response = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...headers,
            ...fetchOptions.headers,
            Authorization: `Bearer ${newToken}`,
          },
        })
      }
    }

    if (!response.ok) {
      const error: ApiError = {
        message: 'An error occurred',
        status: response.status,
      }

      try {
        const data = await response.json()
        error.message = data.detail || data.message || error.message
        error.details = data.errors || data
      } catch {
        // Response wasn't JSON
      }

      throw error
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  // Convenience methods
  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  patch<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const api = new ApiClient(API_URL)
export type { ApiError }
