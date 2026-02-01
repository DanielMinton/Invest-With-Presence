import { Metadata } from 'next'
import { HubDashboard } from '@/components/hub/hub-dashboard'

export const metadata: Metadata = {
  title: 'Dashboard | Hub',
}

export default function HubPage() {
  return <HubDashboard />
}
