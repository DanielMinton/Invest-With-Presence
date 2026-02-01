// Authentication
export { useAuth } from './use-auth'

// Device detection
export {
  useDevice,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsTouchDevice,
  usePrefersReducedMotion,
  type DeviceType,
  type Orientation,
} from './use-device'

// Scroll utilities
export {
  useScroll,
  useScrolledPast,
  useScrollDirection,
  useScrollLock,
  useInView,
  useOnInView,
} from './use-scroll'
