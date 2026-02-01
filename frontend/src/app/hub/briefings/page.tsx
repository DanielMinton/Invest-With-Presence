'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { briefingsApi, type Briefing } from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'
import {
  FileText,
  Search,
  Plus,
  Filter,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  MoreVertical,
  Mail,
  Globe,
} from 'lucide-react'

export default function BriefingsPage() {
  const [briefings, setBriefings] = useState<Briefing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    loadBriefings()
  }, [searchQuery, statusFilter])

  const loadBriefings = async () => {
    try {
      setLoading(true)
      const params: Record<string, string> = {}
      if (searchQuery) params.search = searchQuery
      if (statusFilter) params.status = statusFilter
      const response = await briefingsApi.list(params)
      setBriefings(response.results)
    } catch (error) {
      console.error('Failed to load briefings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await briefingsApi.approve(id)
      loadBriefings()
    } catch (error) {
      console.error('Failed to approve briefing:', error)
    }
  }

  const handleSend = async (id: string) => {
    try {
      await briefingsApi.send(id)
      loadBriefings()
    } catch (error) {
      console.error('Failed to send briefing:', error)
    }
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'sent', label: 'Sent' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />
      case 'pending_review': return <AlertCircle className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'sent': return <Send className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-brand-100 text-brand-600 dark:bg-brand-700 dark:text-brand-300'
      case 'pending_review': return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
      case 'approved': return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
      case 'sent': return 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400'
      case 'failed': return 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
      default: return 'bg-brand-100 text-brand-600'
    }
  }

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'portal': return <Globe className="w-4 h-4" />
      case 'both': return <Send className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-900 dark:text-white">
            Briefings
          </h1>
          <p className="text-brand-500 dark:text-brand-400 mt-1">
            Client communications and reports
          </p>
        </div>
        <button className="btn btn-primary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
          <Plus size={16} />
          New Briefing
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
              placeholder="Search briefings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       transition-all duration-200 outline-none text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       outline-none text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Briefings List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-brand-500">Loading briefings...</p>
          </div>
        ) : briefings.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-brand-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brand-900 dark:text-white mb-2">
              No briefings found
            </h3>
            <p className="text-brand-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'Create your first briefing to get started'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-brand-100 dark:divide-brand-800">
            {briefings.map((briefing, index) => (
              <motion.div
                key={briefing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400">
                    <FileText className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-brand-900 dark:text-white truncate">
                        {briefing.title}
                      </h3>
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center gap-1',
                        getStatusColor(briefing.status)
                      )}>
                        {getStatusIcon(briefing.status)}
                        {briefing.status_display}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-brand-500 dark:text-brand-400">
                      <span className="truncate">
                        {briefing.client_name || briefing.household_name || 'No recipient'}
                      </span>
                      <span className="flex items-center gap-1">
                        {getDeliveryIcon(briefing.delivery_method)}
                        {briefing.delivery_method_display}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(briefing.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {briefing.status === 'pending_review' && (
                      <button
                        onClick={() => handleApprove(briefing.id)}
                        className="btn btn-secondary px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                    )}
                    {briefing.status === 'approved' && (
                      <button
                        onClick={() => handleSend(briefing.id)}
                        className="btn btn-primary px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1"
                      >
                        <Send size={14} />
                        Send
                      </button>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors">
                      <Eye className="w-4 h-4 text-brand-500" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors">
                      <MoreVertical className="w-4 h-4 text-brand-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
