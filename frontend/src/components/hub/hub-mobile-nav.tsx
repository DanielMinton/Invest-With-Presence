'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  CheckSquare,
  MoreHorizontal,
} from 'lucide-react'

const navItems = [
  { href: '/hub', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/hub/risk', icon: AlertTriangle, label: 'Risk' },
  { href: '/hub/clients', icon: Users, label: 'Clients' },
  { href: '/hub/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/hub/more', icon: MoreHorizontal, label: 'More' },
]

export function HubMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-brand-900 border-t border-brand-100 dark:border-brand-800 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center w-16 h-full',
                'text-brand-500 dark:text-brand-400',
                'transition-colors',
                isActive && 'text-brand-900 dark:text-white'
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-xl',
                  isActive && 'bg-brand-100 dark:bg-brand-800'
                )}
              >
                <item.icon
                  size={22}
                  className={cn(
                    isActive ? 'text-brand-900 dark:text-white' : 'text-brand-400'
                  )}
                />
              </motion.div>

              {/* Label */}
              <span
                className={cn(
                  'text-[10px] font-medium mt-0.5',
                  isActive ? 'text-brand-900 dark:text-white' : 'text-brand-400'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
