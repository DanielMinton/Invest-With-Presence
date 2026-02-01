'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  CheckSquare,
  FolderOpen,
  Bell,
  Search,
  Zap,
} from 'lucide-react'

interface HubSidebarProps {
  collapsed: boolean
  onToggle: () => void
  isMobileOverlay?: boolean
}

const navGroups = [
  {
    label: 'Core',
    items: [
      {
        href: '/hub',
        icon: LayoutDashboard,
        label: 'Dashboard',
        badge: null,
      },
      {
        href: '/hub/risk',
        icon: AlertTriangle,
        label: 'Risk Console',
        badge: 'Live',
        badgeColor: 'success',
      },
      {
        href: '/hub/clients',
        icon: Users,
        label: 'Clients',
        badge: null,
      },
    ],
  },
  {
    label: 'Workflow',
    items: [
      {
        href: '/hub/tasks',
        icon: CheckSquare,
        label: 'Tasks',
        badge: '3',
        badgeColor: 'warning',
      },
      {
        href: '/hub/briefings',
        icon: FileText,
        label: 'Briefings',
        badge: null,
      },
      {
        href: '/hub/documents',
        icon: FolderOpen,
        label: 'Documents',
        badge: null,
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      {
        href: '/hub/reports',
        icon: BarChart3,
        label: 'Reports',
        badge: null,
      },
      {
        href: '/hub/audit',
        icon: Clock,
        label: 'Audit Log',
        badge: null,
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        href: '/hub/users',
        icon: Shield,
        label: 'Users',
        badge: null,
      },
      {
        href: '/hub/integrations',
        icon: Zap,
        label: 'Integrations',
        badge: null,
      },
      {
        href: '/hub/settings',
        icon: Settings,
        label: 'Settings',
        badge: null,
      },
    ],
  },
]

export function HubSidebar({ collapsed, onToggle, isMobileOverlay }: HubSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col',
        'bg-white dark:bg-brand-900 border-r border-brand-100 dark:border-brand-800',
        'transition-all duration-300 ease-out-expo',
        collapsed ? 'w-[72px]' : 'w-[280px]',
        isMobileOverlay && 'w-72'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-brand-100 dark:border-brand-800',
        collapsed && !isMobileOverlay ? 'justify-center' : 'justify-between'
      )}>
        <Link href="/hub" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-900 dark:bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-white dark:text-brand-900 font-display font-bold text-lg">R</span>
          </div>
          <AnimatePresence mode="wait">
            {(!collapsed || isMobileOverlay) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display font-semibold text-lg text-brand-900 dark:text-white whitespace-nowrap overflow-hidden"
              >
                Bastion Hub
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Collapse toggle (desktop only) */}
        {!isMobileOverlay && (
          <button
            onClick={onToggle}
            className={cn(
              'p-1.5 rounded-lg text-brand-400 hover:text-brand-600 hover:bg-brand-100',
              'dark:hover:text-brand-200 dark:hover:bg-brand-800',
              'transition-colors',
              collapsed && 'absolute -right-3 top-6 bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-700 shadow-sm'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Quick Search (when expanded) */}
      <AnimatePresence>
        {(!collapsed || isMobileOverlay) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 border-b border-brand-100 dark:border-brand-800"
          >
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-brand-50 dark:bg-brand-800 text-brand-400 hover:text-brand-600 dark:hover:text-brand-200 transition-colors">
              <Search size={16} />
              <span className="text-sm">Quick search...</span>
              <kbd className="ml-auto text-xs bg-brand-100 dark:bg-brand-700 px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            {/* Group label */}
            <AnimatePresence>
              {(!collapsed || isMobileOverlay) && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 mb-2 text-xs font-semibold text-brand-400 dark:text-brand-500 uppercase tracking-wider"
                >
                  {group.label}
                </motion.h3>
              )}
            </AnimatePresence>

            {/* Group items */}
            <ul className="space-y-1 px-2">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2.5 rounded-lg',
                        'transition-all duration-200',
                        isActive
                          ? 'bg-brand-900 dark:bg-white text-white dark:text-brand-900'
                          : 'text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800 hover:text-brand-900 dark:hover:text-white',
                        collapsed && !isMobileOverlay && 'justify-center'
                      )}
                      title={collapsed && !isMobileOverlay ? item.label : undefined}
                    >
                      <item.icon
                        size={20}
                        className={cn(
                          'flex-shrink-0',
                          isActive
                            ? 'text-white dark:text-brand-900'
                            : 'text-brand-400 group-hover:text-brand-600 dark:group-hover:text-brand-200'
                        )}
                      />
                      <AnimatePresence>
                        {(!collapsed || isMobileOverlay) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-1 text-sm font-medium whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {/* Badge */}
                      {item.badge && (!collapsed || isMobileOverlay) && (
                        <span
                          className={cn(
                            'px-2 py-0.5 text-xs font-medium rounded-full',
                            item.badgeColor === 'success' && 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
                            item.badgeColor === 'warning' && 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
                            !item.badgeColor && 'bg-brand-100 text-brand-600 dark:bg-brand-700 dark:text-brand-200'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-brand-100 dark:border-brand-800 p-4">
        <div className={cn(
          'flex items-center gap-3',
          collapsed && !isMobileOverlay && 'justify-center'
        )}>
          {/* User avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-medium text-sm">R</span>
          </div>
          <AnimatePresence>
            {(!collapsed || isMobileOverlay) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-brand-900 dark:text-white truncate">
                  Bastion
                </p>
                <p className="text-xs text-brand-400 truncate">Principal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  )
}
