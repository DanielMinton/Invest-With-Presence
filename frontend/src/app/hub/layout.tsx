import type { Metadata } from 'next'
import { HubShell } from '@/components/hub/hub-shell'

export const metadata: Metadata = {
  title: 'Hub',
  description: 'Bastion Operations Hub - Internal management console',
  robots: {
    index: false,
    follow: false,
  },
}

interface HubLayoutProps {
  children: React.ReactNode
}

export default function HubLayout({ children }: HubLayoutProps) {
  return <HubShell>{children}</HubShell>
}
