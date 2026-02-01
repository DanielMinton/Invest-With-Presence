'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useDevice } from '@/lib/hooks'
import { fadeInUp, staggerContainer, textRevealContainer, textRevealWord } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { ArrowDown, Shield, Lock, Eye } from 'lucide-react'

/**
 * Hero Section with Epic Parallax
 * Multi-layer depth effect with smooth scroll-linked animations
 */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isMobile, isReducedMotion } = useDevice()

  // Main scroll progress for the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms - different speeds create depth
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const midgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Scale effect as user scrolls
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Apply spring physics for buttery smooth motion
  const smoothBackgroundY = useSpring(backgroundY, { stiffness: 100, damping: 30 })
  const smoothMidgroundY = useSpring(midgroundY, { stiffness: 100, damping: 30 })
  const smoothBackgroundScale = useSpring(backgroundScale, { stiffness: 100, damping: 30 })
  const smoothTextY = useSpring(textY, { stiffness: 100, damping: 30 })
  const smoothOpacity = useSpring(contentOpacity, { stiffness: 100, damping: 30 })

  // Disable parallax on mobile or reduced motion
  const enableParallax = !isMobile && !isReducedMotion

  const headline = 'Clarity Through Discipline'
  const words = headline.split(' ')

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] lg:min-h-[120vh] overflow-hidden"
    >
      {/* Background Layer - Slowest parallax */}
      <motion.div
        className="absolute inset-0 -z-30"
        style={{
          y: enableParallax ? smoothBackgroundY : 0,
          scale: enableParallax ? smoothBackgroundScale : 1,
        }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-accent-500/10 blur-[120px] animate-pulse-subtle" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-600/20 blur-[100px] animate-pulse-subtle delay-500" />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-noise mix-blend-overlay" />
      </motion.div>

      {/* Midground Layer - Grid pattern */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={{ y: enableParallax ? smoothMidgroundY : 0 }}
      >
        {/* Perspective grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center top',
          }}
        />
      </motion.div>

      {/* Floating Elements - Create depth */}
      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ y: enableParallax ? smoothMidgroundY : 0 }}
      >
        {/* Floating security icons */}
        <motion.div
          className="absolute top-[20%] left-[10%] text-accent-400/20"
          animate={isReducedMotion ? {} : { y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Shield size={80} strokeWidth={1} />
        </motion.div>

        <motion.div
          className="absolute top-[30%] right-[15%] text-brand-400/20"
          animate={isReducedMotion ? {} : { y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Lock size={60} strokeWidth={1} />
        </motion.div>

        <motion.div
          className="absolute bottom-[30%] left-[20%] text-brand-500/20"
          animate={isReducedMotion ? {} : { y: [0, -25, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Eye size={70} strokeWidth={1} />
        </motion.div>
      </motion.div>

      {/* Content - Main hero text */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
        style={{
          y: enableParallax ? smoothTextY : 0,
          opacity: enableParallax ? smoothOpacity : 1,
        }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Overline */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-brand-200">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              Private Wealth & Equity
            </span>
          </motion.div>

          {/* Main headline with word-by-word reveal */}
          <motion.h1
            variants={textRevealContainer}
            className="text-fluid-hero font-display font-bold text-white mb-8 tracking-tight"
            style={{ perspective: '1000px' }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={textRevealWord}
                className="inline-block mr-[0.25em]"
                style={{ transformOrigin: 'center bottom' }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-fluid-xl text-brand-300 max-w-2xl mx-auto mb-12 text-balance"
          >
            A security-first approach to wealth management. Experience transparency,
            provenance, and institutional-grade protection for your capital.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/contact"
              className={cn(
                'group relative px-8 py-4 rounded-full font-medium text-brand-900',
                'bg-white hover:bg-brand-50',
                'transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900'
              )}
            >
              <span className="relative z-10">Begin a Conversation</span>
              <motion.div
                className="absolute inset-0 rounded-full bg-accent-400/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </a>

            <a
              href="/philosophy"
              className={cn(
                'px-8 py-4 rounded-full font-medium text-white',
                'border border-white/20 hover:border-white/40 hover:bg-white/5',
                'transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900'
              )}
            >
              Our Philosophy
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={isReducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-brand-400"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-brand-950 to-transparent z-20" />
    </section>
  )
}
