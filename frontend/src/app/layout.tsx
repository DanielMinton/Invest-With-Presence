import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { SmoothScrollProvider } from '@/lib/providers/smooth-scroll'
import '@/styles/globals.css'

// Fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Optional: Premium display font for headings
const displayFont = localFont({
  src: [
    {
      path: '../../public/fonts/display-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/display-semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/display-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['var(--font-inter)', 'system-ui', 'sans-serif'],
})

// Metadata
export const metadata: Metadata = {
  title: {
    default: 'Bastion | Private Wealth & Equity',
    template: '%s | Bastion',
  },
  description:
    'A disciplined approach to private wealth management. Security-first, transparency-driven.',
  keywords: ['wealth management', 'private equity', 'investment advisory', 'financial planning'],
  authors: [{ name: 'Bastion' }],
  creator: 'Bastion',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Bastion',
    title: 'Bastion | Private Wealth & Equity',
    description:
      'A disciplined approach to private wealth management. Security-first, transparency-driven.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bastion | Private Wealth & Equity',
    description:
      'A disciplined approach to private wealth management. Security-first, transparency-driven.',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1929' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Security: Prevent clickjacking in older browsers */}
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />

        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-white dark:bg-brand-950 font-sans antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
