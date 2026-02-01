import { api } from './client'
import { useAuthStore, type User, type AuthTokens } from '@/lib/stores/auth-store'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  tokens: AuthTokens
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { setLoading, setError, login } = useAuthStore.getState()

    setLoading(true)
    setError(null)

    try {
      const response = await api.post<LoginResponse>(
        '/auth/login/',
        credentials,
        { requireAuth: false }
      )

      login(response.user, response.tokens)
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  },

  async logout(): Promise<void> {
    const { tokens, logout } = useAuthStore.getState()

    try {
      if (tokens?.refresh) {
        await api.post('/auth/logout/', { refresh: tokens.refresh })
      }
    } catch {
      // Logout even if API call fails
    } finally {
      logout()
    }
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    const { setLoading, setError, login } = useAuthStore.getState()

    setLoading(true)
    setError(null)

    try {
      const response = await api.post<LoginResponse>(
        '/auth/register/',
        data,
        { requireAuth: false }
      )

      login(response.user, response.tokens)
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me/')
  },

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/password/reset/', { email }, { requireAuth: false })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post(
      '/auth/password/reset/confirm/',
      { token, password },
      { requireAuth: false }
    )
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/password/change/', {
      current_password: currentPassword,
      new_password: newPassword,
    })
  },
}
