'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsAuthenticated } from '@/lib/stores/auth-store'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useIsAuthenticated()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Small delay to allow hydration
    const timer = setTimeout(() => {
      setIsChecking(false)
      if (!isAuthenticated) {
        // Store the attempted URL for redirect after login
        sessionStorage.setItem('redirectAfterLogin', pathname)
        router.push('/login')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router, pathname])

  // Show loading state while checking auth
  if (isChecking) {
    return fallback || <LoadingScreen />
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return fallback || <LoadingScreen />
  }

  return <>{children}</>
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-950">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Logo/Spinner */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-2 border-brand-200 dark:border-brand-700 border-t-accent-500 rounded-full"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-brand-500 dark:text-brand-400 text-sm"
          >
            Loading...
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Higher-order component version
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
