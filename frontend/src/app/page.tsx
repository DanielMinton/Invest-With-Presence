import { Metadata } from 'next'
import { HeroSection } from '@/components/public/hero-section'
import { PhilosophySection } from '@/components/public/philosophy-section'
import { SecuritySection } from '@/components/public/security-section'
import { CTASection } from '@/components/public/cta-section'
import { PublicHeader } from '@/components/public/public-header'
import { PublicFooter } from '@/components/public/public-footer'

export const metadata: Metadata = {
  title: 'Bastion | Private Wealth & Equity',
  description:
    'A disciplined, security-first approach to private wealth management. Experience clarity, transparency, and institutional-grade protection.',
}

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main>
        <HeroSection />
        <PhilosophySection />
        <SecuritySection />
        <CTASection />
      </main>
      <PublicFooter />
    </>
  )
}
