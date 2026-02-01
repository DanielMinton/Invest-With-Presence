'use client'

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'
import { isServer } from '@/lib/utils'

interface SmoothScrollContextValue {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
})

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

interface SmoothScrollProviderProps {
  children: ReactNode
  options?: {
    duration?: number
    easing?: (t: number) => number
    smoothWheel?: boolean
    smoothTouch?: boolean
  }
}

/**
 * Smooth scrolling provider using Lenis
 * Provides buttery-smooth scrolling experience
 */
export function SmoothScrollProvider({
  children,
  options = {},
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (isServer) return

    // Default options for smooth, premium feel
    const lenis = new Lenis({
      duration: options.duration ?? 1.2,
      easing: options.easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      smoothWheel: options.smoothWheel ?? true,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    // Add class to html for CSS targeting
    document.documentElement.classList.add('lenis')

    // RAF loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenis.destroy()
      document.documentElement.classList.remove('lenis')
    }
  }, [options.duration, options.easing, options.smoothWheel, options.smoothTouch])

  const scrollTo = (
    target: string | number | HTMLElement,
    opts?: { offset?: number; duration?: number }
  ) => {
    lenisRef.current?.scrollTo(target, {
      offset: opts?.offset ?? 0,
      duration: opts?.duration ?? 1,
    })
  }

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

/**
 * Hook to stop/start Lenis (for modals, etc.)
 */
export function useLenisControl() {
  const { lenis } = useSmoothScroll()

  const stop = () => lenis?.stop()
  const start = () => lenis?.start()

  return { stop, start }
}
