'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  RefreshCw,
  Clock,
} from 'lucide-react'

interface HubHeaderProps {
  onMenuClick: () => void
  showMenuButton: boolean
}

export function HubHeader({ onMenuClick, showMenuButton }: HubHeaderProps) {
  const [isDark, setIsDark] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [notifications] = useState([
    { id: 1, title: 'Client briefing due', time: '2h ago', unread: true },
    { id: 2, title: 'Market alert: VIX spike', time: '4h ago', unread: true },
    { id: 3, title: 'Integration sync complete', time: '1d ago', unread: false },
  ])
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  // Current time display
  const now = new Date()
  const timeString = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-brand-900/80 backdrop-blur-xl border-b border-brand-100 dark:border-brand-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-brand-600 hover:bg-brand-100 dark:text-brand-300 dark:hover:bg-brand-800 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Time display */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-brand-500 dark:text-brand-400">
            <Clock size={14} />
            <span>{dateString}</span>
            <span className="text-brand-300">•</span>
            <span className="font-medium text-brand-700 dark:text-brand-200">{timeString}</span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={cn(
              'p-2 rounded-lg text-brand-600 hover:bg-brand-100',
              'dark:text-brand-300 dark:hover:bg-brand-800',
              'transition-colors disabled:opacity-50'
            )}
            title="Refresh data"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            >
              <RefreshCw size={18} />
            </motion.div>
          </button>

          {/* Search button */}
          <button
            className="p-2 rounded-lg text-brand-600 hover:bg-brand-100 dark:text-brand-300 dark:hover:bg-brand-800 transition-colors"
            title="Search (⌘K)"
          >
            <Search size={18} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-brand-600 hover:bg-brand-100 dark:text-brand-300 dark:hover:bg-brand-800 transition-colors"
            title="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                showNotifications
                  ? 'bg-brand-100 dark:bg-brand-800 text-brand-900 dark:text-white'
                  : 'text-brand-600 hover:bg-brand-100 dark:text-brand-300 dark:hover:bg-brand-800'
              )}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
              )}
            </button>

            {/* Notifications dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-brand-900 rounded-xl border border-brand-100 dark:border-brand-800 shadow-lg overflow-hidden"
                >
                  <div className="p-4 border-b border-brand-100 dark:border-brand-800">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-brand-900 dark:text-white">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        className={cn(
                          'w-full p-4 text-left hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors',
                          notification.unread && 'bg-accent-50/50 dark:bg-accent-900/10'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <span className="w-2 h-2 mt-1.5 bg-accent-500 rounded-full flex-shrink-0" />
                          )}
                          <div className={cn(!notification.unread && 'ml-5')}>
                            <p className="text-sm font-medium text-brand-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-xs text-brand-400 mt-0.5">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-brand-100 dark:border-brand-800">
                    <button className="w-full text-center text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
