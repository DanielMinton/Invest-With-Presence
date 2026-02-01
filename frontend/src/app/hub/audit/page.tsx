'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { auditApi, type AuditLog } from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'
import {
  Shield,
  Search,
  Filter,
  Download,
  Clock,
  User,
  FileText,
  Key,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('')
  const [severityFilter, setSeverityFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 20

  useEffect(() => {
    loadLogs()
  }, [searchQuery, eventTypeFilter, severityFilter, page])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const params: Record<string, string> = {
        page: page.toString(),
        page_size: pageSize.toString(),
      }
      if (searchQuery) params.search = searchQuery
      if (eventTypeFilter) params.event_type = eventTypeFilter
      if (severityFilter) params.severity = severityFilter
      const response = await auditApi.list(params)
      setLogs(response.results)
      setTotalCount(response.count)
    } catch (error) {
      console.error('Failed to load audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const params: Record<string, string> = {}
      if (eventTypeFilter) params.event_type = eventTypeFilter
      if (severityFilter) params.severity = severityFilter
      const data = await auditApi.export(params)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export logs:', error)
    }
  }

  const eventTypes = [
    { value: '', label: 'All Events' },
    { value: 'auth.login', label: 'Login' },
    { value: 'auth.logout', label: 'Logout' },
    { value: 'auth.failed_login', label: 'Failed Login' },
    { value: 'data.create', label: 'Data Created' },
    { value: 'data.update', label: 'Data Updated' },
    { value: 'data.delete', label: 'Data Deleted' },
    { value: 'document.upload', label: 'Document Upload' },
    { value: 'document.download', label: 'Document Download' },
    { value: 'admin.user_create', label: 'User Created' },
  ]

  const severities = [
    { value: '', label: 'All Severities' },
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'critical', label: 'Critical' },
  ]

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info': return <Info className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'error': return <XCircle className="w-4 h-4" />
      case 'critical': return <AlertTriangle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-brand-100 text-brand-600 dark:bg-brand-700 dark:text-brand-300'
      case 'warning': return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
      case 'error': return 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
      case 'critical': return 'bg-danger-200 text-danger-800 dark:bg-danger-900/50 dark:text-danger-300'
      default: return 'bg-brand-100 text-brand-600'
    }
  }

  const getEventIcon = (eventType: string) => {
    if (eventType.startsWith('auth')) return <Key className="w-5 h-5" />
    if (eventType.startsWith('document')) return <FileText className="w-5 h-5" />
    if (eventType.startsWith('admin')) return <User className="w-5 h-5" />
    return <Shield className="w-5 h-5" />
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-900 dark:text-white">
            Audit Log
          </h1>
          <p className="text-brand-500 dark:text-brand-400 mt-1">
            Security and compliance activity tracking
          </p>
        </div>
        <button
          onClick={handleExport}
          className="btn btn-secondary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
        >
          <Download size={16} />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              placeholder="Search by user, description, or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       transition-all duration-200 outline-none text-sm"
            />
          </div>

          {/* Event Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-400" />
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       outline-none text-sm"
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                     bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                     focus:ring-2 focus:ring-accent-500 focus:border-transparent
                     outline-none text-sm"
          >
            {severities.map((sev) => (
              <option key={sev.value} value={sev.value}>
                {sev.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-brand-500">Loading audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="w-12 h-12 text-brand-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brand-900 dark:text-white mb-2">
              No audit logs found
            </h3>
            <p className="text-brand-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'Activity logs will appear here'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-brand-100 dark:divide-brand-800">
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="p-4 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-800 text-brand-600 dark:text-brand-300">
                    {getEventIcon(log.event_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-brand-900 dark:text-white">
                        {log.event_type}
                      </span>
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center gap-1',
                        getSeverityColor(log.severity)
                      )}>
                        {getSeverityIcon(log.severity)}
                        {log.severity}
                      </span>
                    </div>
                    <p className="text-sm text-brand-600 dark:text-brand-300 mt-1">
                      {log.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-brand-500 dark:text-brand-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.user_email || 'System'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(log.timestamp)}
                      </span>
                      {log.ip_address && (
                        <span>IP: {log.ip_address}</span>
                      )}
                      {log.target_repr && (
                        <span className="truncate">Target: {log.target_repr}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-brand-100 dark:border-brand-800 flex items-center justify-between">
            <span className="text-sm text-brand-500">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-brand-700 dark:text-brand-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
