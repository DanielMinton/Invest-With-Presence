'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { isServer, throttle } from '@/lib/utils'

interface ScrollState {
  x: number
  y: number
  direction: 'up' | 'down' | 'none'
  progress: number // 0 to 1, page scroll progress
  velocity: number
  isScrolling: boolean
}

const defaultScrollState: ScrollState = {
  x: 0,
  y: 0,
  direction: 'none',
  progress: 0,
  velocity: 0,
  isScrolling: false,
}

/**
 * Hook to track scroll position and behavior
 */
export function useScroll(throttleMs = 16): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>(defaultScrollState)
  const lastY = useRef(0)
  const lastTime = useRef(Date.now())
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>()

  const updateScroll = useCallback(() => {
    if (isServer) return

    const x = window.scrollX
    const y = window.scrollY
    const now = Date.now()
    const timeDelta = now - lastTime.current

    // Calculate velocity (pixels per second)
    const velocity = timeDelta > 0 ? Math.abs(y - lastY.current) / (timeDelta / 1000) : 0

    // Calculate page progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? y / docHeight : 0

    // Determine direction
    let direction: 'up' | 'down' | 'none' = 'none'
    if (y > lastY.current) direction = 'down'
    else if (y < lastY.current) direction = 'up'

    setScrollState({
      x,
      y,
      direction,
      progress,
      velocity,
      isScrolling: true,
    })

    lastY.current = y
    lastTime.current = now

    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    // Set scrolling to false after scroll ends
    scrollTimeout.current = setTimeout(() => {
      setScrollState((prev) => ({ ...prev, isScrolling: false, velocity: 0 }))
    }, 150)
  }, [])

  useEffect(() => {
    if (isServer) return

    const throttledUpdate = throttle(updateScroll, throttleMs)

    window.addEventListener('scroll', throttledUpdate, { passive: true })

    // Initial check
    updateScroll()

    return () => {
      window.removeEventListener('scroll', throttledUpdate)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [updateScroll, throttleMs])

  return scrollState
}

/**
 * Hook to detect if user has scrolled past a threshold
 */
export function useScrolledPast(threshold: number): boolean {
  const { y } = useScroll()
  return y > threshold
}

/**
 * Hook to track scroll direction with hysteresis
 */
export function useScrollDirection(hysteresis = 10): 'up' | 'down' | null {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)
  const lastY = useRef(0)
  const lastDirection = useRef<'up' | 'down' | null>(null)

  useEffect(() => {
    if (isServer) return

    const handleScroll = () => {
      const y = window.scrollY
      const diff = y - lastY.current

      // Only change direction if scroll amount exceeds hysteresis
      if (Math.abs(diff) > hysteresis) {
        const newDirection = diff > 0 ? 'down' : 'up'
        if (newDirection !== lastDirection.current) {
          setDirection(newDirection)
          lastDirection.current = newDirection
        }
        lastY.current = y
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hysteresis])

  return direction
}

/**
 * Hook to lock/unlock body scroll
 */
export function useScrollLock() {
  const lock = useCallback(() => {
    if (isServer) return

    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'
  }, [])

  const unlock = useCallback(() => {
    if (isServer) return

    const scrollY = document.body.style.top
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.overflow = ''
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
  }, [])

  return { lock, unlock }
}

/**
 * Hook for element visibility detection
 */
export function useInView(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref.current || isServer) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    }, options)

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, options])

  return isInView
}

/**
 * Hook to trigger callback when element comes into view
 */
export function useOnInView(
  ref: React.RefObject<Element>,
  callback: () => void,
  options: IntersectionObserverInit & { once?: boolean } = {}
): void {
  const { once = true, ...observerOptions } = options
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (!ref.current || isServer) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && (!once || !hasTriggered.current)) {
        callback()
        hasTriggered.current = true
        if (once) {
          observer.disconnect()
        }
      }
    }, observerOptions)

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, callback, once, observerOptions])
}
