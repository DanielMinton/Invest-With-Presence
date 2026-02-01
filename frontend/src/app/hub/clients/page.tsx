'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { clientsApi, type Client } from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'
import {
  Users,
  Search,
  Plus,
  Filter,
  ChevronRight,
  Mail,
  Phone,
  Building2,
  User,
  MoreVertical,
} from 'lucide-react'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('')

  useEffect(() => {
    loadClients()
  }, [searchQuery, filterType])

  const loadClients = async () => {
    try {
      setLoading(true)
      const params: Record<string, string> = {}
      if (searchQuery) params.search = searchQuery
      if (filterType) params.client_type = filterType
      const response = await clientsApi.list(params)
      setClients(response.results)
    } catch (error) {
      console.error('Failed to load clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const clientTypes = [
    { value: '', label: 'All Types' },
    { value: 'individual', label: 'Individual' },
    { value: 'joint', label: 'Joint' },
    { value: 'trust', label: 'Trust' },
    { value: 'entity', label: 'Entity' },
    { value: 'ira', label: 'IRA' },
  ]

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <User className="w-4 h-4" />
      case 'joint': return <Users className="w-4 h-4" />
      case 'trust':
      case 'entity': return <Building2 className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-900 dark:text-white">
            Clients
          </h1>
          <p className="text-brand-500 dark:text-brand-400 mt-1">
            Manage your client relationships
          </p>
        </div>
        <button className="btn btn-primary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
          <Plus size={16} />
          Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       transition-all duration-200 outline-none text-sm"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       outline-none text-sm"
            >
              {clientTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-brand-500">Loading clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-brand-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brand-900 dark:text-white mb-2">
              No clients found
            </h3>
            <p className="text-brand-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'Add your first client to get started'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-brand-100 dark:divide-brand-800">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/hub/clients/${client.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium">
                      {client.first_name[0]}{client.last_name[0]}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-brand-900 dark:text-white truncate">
                        {client.full_name}
                      </h3>
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center gap-1',
                        client.is_active
                          ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                          : 'bg-brand-100 text-brand-600 dark:bg-brand-700 dark:text-brand-300'
                      )}>
                        {getClientTypeIcon(client.client_type)}
                        {client.client_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-brand-500 dark:text-brand-400">
                      {client.email && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3" />
                          {client.email}
                        </span>
                      )}
                      {client.household_name && (
                        <span className="flex items-center gap-1 truncate">
                          <Building2 className="w-3 h-3" />
                          {client.household_name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="hidden sm:flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <div className="text-brand-900 dark:text-white font-medium">
                        {client.account_count} accounts
                      </div>
                      <div className="text-brand-500 dark:text-brand-400">
                        {client.risk_tolerance || 'No risk profile'}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-brand-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
