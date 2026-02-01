'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-white dark:bg-brand-950 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-50 dark:from-brand-900/50 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          ref={sectionRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-fluid-4xl lg:text-fluid-5xl font-display font-bold text-brand-900 dark:text-white mb-6"
          >
            Ready for Clarity?
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg lg:text-xl text-brand-600 dark:text-brand-300 mb-10 max-w-2xl mx-auto text-balance"
          >
            Begin a confidential conversation about your wealth management needs.
            No pressure, no obligations—just an honest discussion about how we
            might work together.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-900 dark:bg-white text-white dark:text-brand-900 font-medium hover:bg-brand-800 dark:hover:bg-brand-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Schedule a Conversation
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              href="/philosophy"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-300 font-medium hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 pt-10 border-t border-brand-100 dark:border-brand-800"
          >
            <p className="text-sm text-brand-500 dark:text-brand-400 mb-6">
              Trusted by discerning investors who value discipline over promises
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-brand-400 dark:text-brand-500">
              <span className="text-sm">SEC Registered</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-brand-300" />
              <span className="text-sm">Fiduciary Standard</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-brand-300" />
              <span className="text-sm">Confidential</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-brand-300" />
              <span className="text-sm">Security-First</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
