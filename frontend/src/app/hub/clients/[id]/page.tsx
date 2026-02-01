'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { clientsApi, type Client, type Account } from '@/lib/api'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Shield,
  Clock,
  Edit,
  MoreVertical,
  CreditCard,
  TrendingUp,
  FileText,
} from 'lucide-react'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'documents' | 'activity'>('overview')

  useEffect(() => {
    if (params.id) {
      loadClient(params.id as string)
    }
  }, [params.id])

  const loadClient = async (id: string) => {
    try {
      setLoading(true)
      const [clientData, accountsData] = await Promise.all([
        clientsApi.get(id),
        clientsApi.getAccounts(id),
      ])
      setClient(clientData)
      setAccounts(accountsData)
    } catch (error) {
      console.error('Failed to load client:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-brand-900 dark:text-white mb-2">
          Client not found
        </h2>
        <Link href="/hub/clients" className="text-accent-500 hover:text-accent-600">
          Back to clients
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'accounts', label: 'Accounts', count: accounts.length },
    { id: 'documents', label: 'Documents' },
    { id: 'activity', label: 'Activity' },
  ]

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/hub/clients"
        className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to clients</span>
      </Link>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Client Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-semibold">
                {client.first_name[0]}{client.last_name[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-display font-bold text-brand-900 dark:text-white">
                  {client.full_name}
                </h1>
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  client.is_active
                    ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                    : 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
                )}>
                  {client.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-brand-500 dark:text-brand-400">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {client.client_type.charAt(0).toUpperCase() + client.client_type.slice(1)}
                </span>
                {client.household_name && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {client.household_name}
                  </span>
                )}
                {client.onboarded_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Client since {formatDate(client.onboarded_at)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
              <Edit size={16} />
              Edit
            </button>
            <button className="p-2 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors">
              <MoreVertical className="w-5 h-5 text-brand-500" />
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-brand-100 dark:border-brand-800">
          {client.email && (
            <a
              href={`mailto:${client.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-50 dark:bg-brand-800 hover:bg-brand-100 dark:hover:bg-brand-700 transition-colors"
            >
              <Mail className="w-4 h-4 text-brand-500" />
              <span className="text-sm text-brand-700 dark:text-brand-300">{client.email}</span>
            </a>
          )}
          {client.phone && (
            <a
              href={`tel:${client.phone}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-50 dark:bg-brand-800 hover:bg-brand-100 dark:hover:bg-brand-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-500" />
              <span className="text-sm text-brand-700 dark:text-brand-300">{client.phone}</span>
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-brand-200 dark:border-brand-700">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'pb-3 px-1 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                  : 'border-transparent text-brand-500 hover:text-brand-700 dark:hover:text-brand-300'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-brand-100 dark:bg-brand-700 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Risk Profile */}
          <div className="card p-6">
            <h3 className="font-semibold text-brand-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-500" />
              Risk Profile
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-brand-500 dark:text-brand-400">Risk Tolerance</dt>
                <dd className="text-brand-900 dark:text-white font-medium">
                  {client.risk_tolerance || 'Not set'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-brand-500 dark:text-brand-400">Time Horizon</dt>
                <dd className="text-brand-900 dark:text-white font-medium">
                  {client.time_horizon || 'Not set'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Account Summary */}
          <div className="card p-6">
            <h3 className="font-semibold text-brand-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent-500" />
              Account Summary
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-brand-500 dark:text-brand-400">Total Accounts</dt>
                <dd className="text-2xl text-brand-900 dark:text-white font-bold">
                  {client.account_count}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-brand-500 dark:text-brand-400">Portal Access</dt>
                <dd className={cn(
                  'font-medium',
                  client.portal_enabled ? 'text-success-600' : 'text-brand-500'
                )}>
                  {client.portal_enabled ? 'Enabled' : 'Disabled'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="font-semibold text-brand-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors flex items-center gap-3">
                <FileText className="w-5 h-5 text-brand-500" />
                <span className="text-sm text-brand-700 dark:text-brand-300">Generate Report</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-500" />
                <span className="text-sm text-brand-700 dark:text-brand-300">Send Briefing</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-brand-500" />
                <span className="text-sm text-brand-700 dark:text-brand-300">View Performance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="card">
          {accounts.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-brand-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-brand-900 dark:text-white mb-2">
                No accounts
              </h3>
              <p className="text-brand-500">This client has no linked accounts.</p>
            </div>
          ) : (
            <div className="divide-y divide-brand-100 dark:divide-brand-800">
              {accounts.map((account) => (
                <div key={account.id} className="p-4 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-brand-900 dark:text-white">
                        {account.name}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-brand-500 dark:text-brand-400">
                        <span>{account.account_number}</span>
                        <span className="capitalize">{account.account_type.replace('_', ' ')}</span>
                        <span>{account.custodian}</span>
                      </div>
                    </div>
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded-full',
                      account.is_active
                        ? 'bg-success-100 text-success-700'
                        : 'bg-brand-100 text-brand-600'
                    )}>
                      {account.is_active ? 'Active' : 'Closed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="card p-8 text-center">
          <FileText className="w-12 h-12 text-brand-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-brand-900 dark:text-white mb-2">
            Documents
          </h3>
          <p className="text-brand-500 mb-4">View and manage client documents.</p>
          <Link
            href={`/hub/documents?client=${client.id}`}
            className="btn btn-primary px-4 py-2 rounded-lg text-sm"
          >
            View Documents
          </Link>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card p-8 text-center">
          <Clock className="w-12 h-12 text-brand-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-brand-900 dark:text-white mb-2">
            Activity Log
          </h3>
          <p className="text-brand-500">Recent activity will appear here.</p>
        </div>
      )}
    </div>
  )
}
