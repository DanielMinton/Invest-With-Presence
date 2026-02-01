'use client'

import { AuthGuard } from '@/components/auth'
import { HubShell } from '@/components/hub/hub-shell'

interface HubLayoutClientProps {
  children: React.ReactNode
}

export function HubLayoutClient({ children }: HubLayoutClientProps) {
  return (
    <AuthGuard>
      <HubShell>{children}</HubShell>
    </AuthGuard>
  )
}
