'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { Target, LineChart, Shield, Users } from 'lucide-react'

const principles = [
  {
    icon: Target,
    title: 'Discipline Over Prediction',
    description:
      'Markets are unpredictable. Process is controllable. We focus on what we can influence: risk management, diversification, and consistent execution.',
  },
  {
    icon: LineChart,
    title: 'Transparency Through Provenance',
    description:
      'Every number tells a story. We trace data to its source, document our reasoning, and make the audit trail visible. No hidden assumptions.',
  },
  {
    icon: Shield,
    title: 'Security as Foundation',
    description:
      'In a world of increasing digital threats, security is not an afterthought. It is the foundation upon which trust is built.',
  },
  {
    icon: Users,
    title: 'Clarity Reduces Anxiety',
    description:
      'Most client stress comes from uncertainty, not markets. Clear communication, consistent cadence, and honest explanations build lasting confidence.',
  },
]

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-white dark:bg-brand-950 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-brand-100/50 dark:bg-brand-900/30 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-sm font-medium text-accent-600 dark:text-accent-400 uppercase tracking-wider mb-4"
          >
            Our Philosophy
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-fluid-4xl font-display font-bold text-brand-900 dark:text-white mb-6"
          >
            Principles That Compound
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-fluid-lg text-brand-600 dark:text-brand-300 max-w-2xl mx-auto text-balance"
          >
            Elite performance is not about finding secrets. It is about executing
            fundamentals with unusual consistency.
          </motion.p>
        </motion.div>

        {/* Principles Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              variants={fadeInUp}
              className={cn(
                'group relative p-8 lg:p-10 rounded-2xl',
                'bg-brand-50/50 dark:bg-brand-900/50',
                'border border-brand-100 dark:border-brand-800',
                'hover:border-accent-200 dark:hover:border-accent-800',
                'transition-all duration-500'
              )}
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={cn(
                  'w-14 h-14 rounded-xl mb-6',
                  'bg-gradient-to-br from-brand-100 to-brand-50',
                  'dark:from-brand-800 dark:to-brand-900',
                  'flex items-center justify-center',
                  'group-hover:from-accent-100 group-hover:to-accent-50',
                  'dark:group-hover:from-accent-900/50 dark:group-hover:to-accent-800/50',
                  'transition-all duration-500'
                )}
              >
                <principle.icon
                  className="w-6 h-6 text-brand-700 dark:text-brand-200 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-500"
                  strokeWidth={1.5}
                />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl lg:text-2xl font-display font-semibold text-brand-900 dark:text-white mb-3">
                {principle.title}
              </h3>
              <p className="text-brand-600 dark:text-brand-300 leading-relaxed">
                {principle.description}
              </p>

              {/* Hover gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/0 to-accent-500/0 group-hover:from-accent-500/5 group-hover:to-transparent transition-all duration-500 -z-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
