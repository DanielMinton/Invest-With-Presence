'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrolledPast, useScrollDirection, useDevice } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { Menu, X, Lock } from 'lucide-react'

const navLinks = [
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/security', label: 'Security' },
  { href: '/contact', label: 'Contact' },
]

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const hasScrolled = useScrolledPast(50)
  const scrollDirection = useScrollDirection(10)
  const { isMobile } = useDevice()

  // Hide header on scroll down (after initial scroll)
  const hideHeader = hasScrolled && scrollDirection === 'down' && !mobileMenuOpen

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hideHeader ? '-100%' : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300',
          hasScrolled
            ? 'bg-white/80 dark:bg-brand-950/80 backdrop-blur-xl border-b border-brand-100 dark:border-brand-800'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2"
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                'bg-brand-900 dark:bg-white',
                'transition-colors duration-300'
              )}>
                <span className="text-white dark:text-brand-900 font-display font-bold text-lg">
                  R
                </span>
              </div>
              <span className={cn(
                'font-display font-semibold text-xl',
                hasScrolled
                  ? 'text-brand-900 dark:text-white'
                  : 'text-white'
              )}>
                Bastion
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  'hover:text-accent-500',
                  hasScrolled
                    ? 'text-brand-600 dark:text-brand-300'
                    : 'text-brand-200 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Member Login */}
            <Link
              href="/members/login"
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                'transition-all duration-200',
                hasScrolled
                  ? 'bg-brand-900 text-white hover:bg-brand-800 dark:bg-white dark:text-brand-900 dark:hover:bg-brand-50'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              )}
            >
              <Lock size={14} />
              Member Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              'lg:hidden relative z-10 p-2 rounded-lg',
              'transition-colors duration-200',
              hasScrolled || mobileMenuOpen
                ? 'text-brand-900 dark:text-white hover:bg-brand-100 dark:hover:bg-brand-800'
                : 'text-white hover:bg-white/10'
            )}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-950/90 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full flex flex-col items-center justify-center gap-8 p-6"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-display font-semibold text-white hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Link
                  href="/members/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand-900 font-medium hover:bg-brand-50 transition-colors"
                >
                  <Lock size={18} />
                  Member Login
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
