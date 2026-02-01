'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  useAuthStore,
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
} from '@/lib/stores/auth-store'
import { authApi } from '@/lib/api/auth'

export function useAuth() {
  const router = useRouter()
  const user = useUser()
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()
  const error = useAuthError()
  const clearError = useAuthStore((state) => state.setError)

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await authApi.login({ email, password })
        router.push('/hub')
        return true
      } catch {
        return false
      }
    },
    [router]
  )

  const logout = useCallback(async () => {
    await authApi.logout()
    router.push('/login')
  }, [router])

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      try {
        await authApi.register({ email, password, firstName, lastName })
        router.push('/hub')
        return true
      } catch {
        return false
      }
    },
    [router]
  )

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    clearError: () => clearError(null),
    login,
    logout,
    register,
  }
}
