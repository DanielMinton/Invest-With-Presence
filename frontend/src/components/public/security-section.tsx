'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations'
import { useDevice } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import {
  Shield,
  Lock,
  Eye,
  Server,
  Key,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

const securityFeatures = [
  {
    icon: Lock,
    title: 'Multi-Factor Authentication',
    description: 'Every login requires multiple verification factors. No exceptions.',
  },
  {
    icon: Server,
    title: 'Encrypted at Rest & Transit',
    description: 'Your data is encrypted using industry-standard protocols at all times.',
  },
  {
    icon: Key,
    title: 'Role-Based Access Control',
    description: 'Least privilege by default. Access only what you need.',
  },
  {
    icon: FileCheck,
    title: 'Immutable Audit Trail',
    description: 'Every action is logged. Every access recorded. Full accountability.',
  },
  {
    icon: AlertTriangle,
    title: 'Threat Monitoring',
    description: 'Continuous monitoring for anomalies and suspicious activity.',
  },
  {
    icon: Eye,
    title: 'Compliance Ready',
    description: 'Designed for Reg S-P and Rule 204-2 requirements from day one.',
  },
]

export function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { isMobile, isReducedMotion } = useDevice()

  // Parallax for the shield
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const shieldY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const shieldRotate = useTransform(scrollYProgress, [0, 1], [-5, 5])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-brand-950 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-500/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-sm font-medium text-accent-400 uppercase tracking-wider mb-4"
            >
              Security First
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="text-fluid-4xl font-display font-bold text-white mb-6"
            >
              Your Trust is Our
              <span className="text-gradient bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
                {' '}Foundation
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-brand-300 mb-10"
            >
              Security is not a feature we add. It is the foundation everything
              else is built upon. Every decision, every line of code, every
              process is evaluated through a security lens.
            </motion.p>

            {/* Feature list */}
            <motion.div
              variants={staggerContainer}
              className="grid sm:grid-cols-2 gap-4"
            >
              {securityFeatures.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-500/20 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-accent-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-brand-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative flex items-center justify-center"
          >
            {/* Animated shield */}
            <motion.div
              style={{
                y: !isMobile && !isReducedMotion ? shieldY : 0,
                rotateZ: !isMobile && !isReducedMotion ? shieldRotate : 0,
              }}
              className="relative"
            >
              {/* Outer glow ring */}
              <motion.div
                animate={isReducedMotion ? {} : {
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 -m-8 rounded-full border-2 border-accent-500/20"
              />

              {/* Middle ring */}
              <motion.div
                animate={isReducedMotion ? {} : {
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute inset-0 -m-4 rounded-full border border-accent-500/30"
              />

              {/* Shield icon container */}
              <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-brand-800 to-brand-900 flex items-center justify-center border border-brand-700">
                {/* Inner glow */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent-500/10 to-transparent" />

                {/* Shield */}
                <Shield
                  className="w-24 h-24 lg:w-32 lg:h-32 text-accent-400"
                  strokeWidth={1}
                />

                {/* Check mark */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
                  className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-success-500 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </motion.div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={isReducedMotion ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-brand-800 border border-brand-700 text-sm text-brand-200"
              >
                SOC 2 Ready
              </motion.div>

              <motion.div
                animate={isReducedMotion ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-full bg-brand-800 border border-brand-700 text-sm text-brand-200"
              >
                256-bit AES
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
