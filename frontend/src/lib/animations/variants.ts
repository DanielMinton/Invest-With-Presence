import { Variants } from 'framer-motion'

/**
 * Animation variants for Framer Motion
 * Consistent, reusable animation presets
 */

// Easing functions
export const easings = {
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  spring: { type: 'spring', stiffness: 100, damping: 15 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 25 },
  springSmooth: { type: 'spring', stiffness: 80, damping: 20 },
} as const

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: easings.easeOutExpo },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easings.easeOutExpo },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easings.easeOutExpo },
  },
  exit: { opacity: 0, y: 10, transition: { duration: 0.3 } },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easings.easeOutExpo },
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easings.easeOutExpo },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
}

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easings.easeOutExpo },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
}

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easings.springBouncy,
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}

// Slide animations (for modals, sidebars, etc.)
export const slideInRight: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.4, ease: easings.easeOutExpo },
  },
  exit: { x: '100%', transition: { duration: 0.3, ease: easings.easeInExpo } },
}

export const slideInLeft: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { duration: 0.4, ease: easings.easeOutExpo },
  },
  exit: { x: '-100%', transition: { duration: 0.3, ease: easings.easeInExpo } },
}

export const slideInUp: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { duration: 0.4, ease: easings.easeOutExpo },
  },
  exit: { y: '100%', transition: { duration: 0.3, ease: easings.easeInExpo } },
}

export const slideInDown: Variants = {
  hidden: { y: '-100%' },
  visible: {
    y: 0,
    transition: { duration: 0.4, ease: easings.easeOutExpo },
  },
  exit: { y: '-100%', transition: { duration: 0.3, ease: easings.easeInExpo } },
}

// Stagger containers
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

// Page transitions
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.easeOutExpo,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: easings.easeInExpo },
  },
}

// Card hover effects
export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: easings.easeOutExpo },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: easings.easeOutExpo },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

// Button press effect
export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
}

// Reveal animations (for scroll)
export const revealFromBottom: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    clipPath: 'inset(100% 0% 0% 0%)',
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: 0.8,
      ease: easings.easeOutExpo,
    },
  },
}

export const revealScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easings.easeOutExpo,
    },
  },
}

// Text reveal (word by word)
export const textRevealContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
}

export const textRevealWord: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: easings.easeOutExpo,
    },
  },
}

// Parallax-ready variants (for use with scroll progress)
export const parallaxSlow = (progress: number) => ({
  y: progress * -50,
})

export const parallaxMedium = (progress: number) => ({
  y: progress * -100,
})

export const parallaxFast = (progress: number) => ({
  y: progress * -200,
})

// Floating animation
export const floating: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Pulse glow
export const pulseGlow: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Notification/badge pop
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easings.springBouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.2 },
  },
}
