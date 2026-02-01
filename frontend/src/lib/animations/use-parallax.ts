'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isServer } from '@/lib/utils'

// Register GSAP plugins
if (!isServer) {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Framer Motion-based parallax hook
 * Use for simple parallax effects with motion values
 */
export function useParallax(
  distance: number = 100,
  options: {
    offset?: ['start end' | 'start center' | 'start start', 'end end' | 'end center' | 'end start']
    smooth?: boolean
    stiffness?: number
    damping?: number
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null)
  const { offset = ['start end', 'end start'], smooth = true, stiffness = 100, damping = 30 } = options

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })

  // Transform scroll progress to Y position
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])

  // Apply spring physics for smooth motion
  const smoothY = useSpring(y, { stiffness, damping })

  return {
    ref,
    y: smooth ? smoothY : y,
    progress: scrollYProgress,
  }
}

/**
 * Multi-layer parallax hook
 * Returns motion values for multiple depth layers
 */
export function useMultiLayerParallax(
  layerDistances: number[] = [50, 100, 150],
  options: {
    smooth?: boolean
    stiffness?: number
    damping?: number
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null)
  const { smooth = true, stiffness = 100, damping = 30 } = options

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Create transforms for each layer
  const layers = layerDistances.map((distance) => {
    const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
    const smoothY = useSpring(y, { stiffness, damping })
    return smooth ? smoothY : y
  })

  return {
    ref,
    layers,
    progress: scrollYProgress,
  }
}

/**
 * GSAP-based parallax for more complex effects
 * Better performance for many elements
 */
export function useGSAPParallax(
  options: {
    speed?: number
    scrub?: boolean | number
    start?: string
    end?: string
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null)
  const { speed = 1, scrub = true, start = 'top bottom', end = 'bottom top' } = options

  useEffect(() => {
    if (isServer || !ref.current) return

    const element = ref.current
    const distance = element.offsetHeight * speed

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: distance },
        {
          y: -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start,
            end,
            scrub,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [speed, scrub, start, end])

  return ref
}

/**
 * GSAP batch parallax for multiple elements
 * Use when you have many parallax elements
 */
export function useGSAPBatchParallax(
  selector: string,
  options: {
    speed?: number
    scrub?: boolean | number
  } = {}
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { speed = 1, scrub = true } = options

  useEffect(() => {
    if (isServer || !containerRef.current) return

    const elements = containerRef.current.querySelectorAll(selector)
    if (elements.length === 0) return

    const ctx = gsap.context(() => {
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement
        const elementSpeed = parseFloat(htmlElement.dataset.parallaxSpeed || String(speed))
        const distance = htmlElement.offsetHeight * elementSpeed

        gsap.fromTo(
          element,
          { y: distance },
          {
            y: -distance,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub,
            },
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [selector, speed, scrub])

  return containerRef
}

/**
 * Hero parallax with scale and opacity
 */
export function useHeroParallax() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })

  return {
    ref,
    y: smoothY,
    scale: smoothScale,
    opacity: smoothOpacity,
    progress: scrollYProgress,
  }
}

/**
 * Scroll-linked rotation
 */
export function useScrollRotation(
  rotations: number = 1,
  axis: 'x' | 'y' | 'z' = 'z'
): { ref: React.RefObject<HTMLDivElement>; rotate: MotionValue<string> } {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const rotateValue = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 360 * rotations]
  )

  const smoothRotate = useSpring(rotateValue, { stiffness: 100, damping: 30 })

  const rotate = useTransform(smoothRotate, (value) => {
    switch (axis) {
      case 'x':
        return `rotateX(${value}deg)`
      case 'y':
        return `rotateY(${value}deg)`
      default:
        return `rotateZ(${value}deg)`
    }
  })

  return { ref, rotate }
}

/**
 * Refresh ScrollTrigger (call after layout changes)
 */
export function refreshScrollTrigger(): void {
  if (isServer) return
  ScrollTrigger.refresh()
}

/**
 * Kill all ScrollTriggers (cleanup)
 */
export function killAllScrollTriggers(): void {
  if (isServer) return
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
}
