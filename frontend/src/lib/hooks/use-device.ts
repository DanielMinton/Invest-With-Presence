'use client'

import { useState, useEffect, useCallback } from 'react'
import { isServer } from '@/lib/utils'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'
export type Orientation = 'portrait' | 'landscape'

interface DeviceInfo {
  type: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
  orientation: Orientation
  width: number
  height: number
  pixelRatio: number
  isReducedMotion: boolean
}

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const

function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.mobile) return 'mobile'
  if (width < BREAKPOINTS.tablet) return 'tablet'
  return 'desktop'
}

function getOrientation(width: number, height: number): Orientation {
  return width > height ? 'landscape' : 'portrait'
}

function isTouchDevice(): boolean {
  if (isServer) return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE-specific
    navigator.msMaxTouchPoints > 0
  )
}

function prefersReducedMotion(): boolean {
  if (isServer) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const defaultDeviceInfo: DeviceInfo = {
  type: 'desktop',
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isTouchDevice: false,
  orientation: 'landscape',
  width: 1920,
  height: 1080,
  pixelRatio: 1,
  isReducedMotion: false,
}

/**
 * Hook to detect device type and characteristics
 * Updates on window resize and orientation change
 */
export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(defaultDeviceInfo)

  const updateDeviceInfo = useCallback(() => {
    if (isServer) return

    const width = window.innerWidth
    const height = window.innerHeight
    const type = getDeviceType(width)

    setDeviceInfo({
      type,
      isMobile: type === 'mobile',
      isTablet: type === 'tablet',
      isDesktop: type === 'desktop',
      isTouchDevice: isTouchDevice(),
      orientation: getOrientation(width, height),
      width,
      height,
      pixelRatio: window.devicePixelRatio || 1,
      isReducedMotion: prefersReducedMotion(),
    })
  }, [])

  useEffect(() => {
    // Initial check
    updateDeviceInfo()

    // Listen for resize
    window.addEventListener('resize', updateDeviceInfo)

    // Listen for orientation change
    window.addEventListener('orientationchange', updateDeviceInfo)

    // Listen for reduced motion preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
      motionQuery.removeEventListener('change', updateDeviceInfo)
    }
  }, [updateDeviceInfo])

  return deviceInfo
}

/**
 * Hook for responsive breakpoint matching
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (isServer) return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Predefined media query hooks
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`)
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`
  )
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.tablet}px)`)
}

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(isTouchDevice())
  }, [])

  return isTouch
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
