'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDevice } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { HubSidebar } from './hub-sidebar'
import { HubHeader } from './hub-header'
import { HubMobileNav } from './hub-mobile-nav'

interface HubShellProps {
  children: React.ReactNode
}

/**
 * Hub Shell - Main layout wrapper for the operations hub
 * Responsive design with collapsible sidebar for desktop and bottom nav for mobile
 */
export function HubShell({ children }: HubShellProps) {
  const { isMobile, isTablet } = useDevice()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false) // For mobile overlay

  // Auto-collapse sidebar on tablet
  useEffect(() => {
    if (isTablet) {
      setSidebarCollapsed(true)
    }
  }, [isTablet])

  // Close mobile sidebar on route change would go here with usePathname

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-brand-950">
      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <HubSidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-brand-950/50 backdrop-blur-sm"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72"
            >
              <HubSidebar
                collapsed={false}
                onToggle={() => setSidebarOpen(false)}
                isMobileOverlay
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className={cn(
          'min-h-screen transition-all duration-300',
          !isMobile && (sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[280px]'),
          isMobile && 'pb-20' // Space for mobile nav
        )}
      >
        {/* Header */}
        <HubHeader
          onMenuClick={toggleSidebar}
          showMenuButton={isMobile}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <HubMobileNav />}
    </div>
  )
}
