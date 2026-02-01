'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usersApi, type User } from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'
import {
  Users,
  Search,
  Plus,
  Filter,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  MoreVertical,
  Key,
  X,
  Check,
  AlertCircle,
} from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [searchQuery, roleFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const params: Record<string, string> = {}
      if (searchQuery) params.search = searchQuery
      if (roleFilter) params.role = roleFilter
      const response = await usersApi.list(params)
      setUsers(response.results)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (id: string) => {
    try {
      setActionLoading(id)
      await usersApi.deactivate(id)
      loadUsers()
    } catch (error) {
      console.error('Failed to deactivate user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = async (id: string) => {
    try {
      setActionLoading(id)
      await usersApi.activate(id)
      loadUsers()
    } catch (error) {
      console.error('Failed to activate user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleResetPassword = async (id: string) => {
    try {
      setActionLoading(id)
      await usersApi.resetPassword(id)
      alert('Password reset email sent')
    } catch (error) {
      console.error('Failed to reset password:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const roles = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'advisor', label: 'Advisor' },
    { value: 'client', label: 'Client' },
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheck className="w-4 h-4" />
      case 'advisor': return <Shield className="w-4 h-4" />
      case 'client': return <UserCheck className="w-4 h-4" />
      default: return <UserCheck className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400'
      case 'advisor': return 'bg-brand-100 text-brand-700 dark:bg-brand-700 dark:text-brand-300'
      case 'client': return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
      default: return 'bg-brand-100 text-brand-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-900 dark:text-white">
            User Management
          </h1>
          <p className="text-brand-500 dark:text-brand-400 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Add User
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       transition-all duration-200 outline-none text-sm"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       outline-none text-sm"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-brand-500">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-brand-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brand-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-brand-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'Add your first user to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-100 dark:border-brand-800">
                  <th className="text-left py-3 px-4 text-xs font-medium text-brand-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-brand-500 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-brand-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-brand-500 uppercase tracking-wide">
                    MFA
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-brand-500 uppercase tracking-wide">
                    Last Login
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-brand-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800">
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {user.first_name[0]}{user.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-brand-900 dark:text-white">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-brand-500 dark:text-brand-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1',
                        getRoleColor(user.role)
                      )}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        user.is_active
                          ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                          : 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
                      )}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.mfa_enabled ? (
                        <Check className="w-4 h-4 text-success-500" />
                      ) : (
                        <X className="w-4 h-4 text-brand-300" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-brand-500 dark:text-brand-400">
                      {user.last_login ? formatDate(user.last_login) : 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          disabled={actionLoading === user.id}
                          className="p-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4 text-brand-500" />
                        </button>
                        {user.is_active ? (
                          <button
                            onClick={() => handleDeactivate(user.id)}
                            disabled={actionLoading === user.id}
                            className="p-1.5 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors"
                            title="Deactivate"
                          >
                            <UserX className="w-4 h-4 text-danger-500" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(user.id)}
                            disabled={actionLoading === user.id}
                            className="p-1.5 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
                            title="Activate"
                          >
                            <UserCheck className="w-4 h-4 text-success-500" />
                          </button>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors">
                          <MoreVertical className="w-4 h-4 text-brand-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false)
            loadUsers()
          }}
        />
      )}
    </div>
  )
}

function CreateUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'advisor' as 'admin' | 'advisor' | 'client',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      await usersApi.create(formData)
      onCreated()
    } catch (err: unknown) {
      console.error('Failed to create user:', err)
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white dark:bg-brand-900 rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800"
        >
          <X className="w-5 h-5 text-brand-500" />
        </button>

        <h2 className="text-xl font-semibold text-brand-900 dark:text-white mb-6">
          Add New User
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                         bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                         focus:ring-2 focus:ring-accent-500 focus:border-transparent
                         outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                         bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                         focus:ring-2 focus:ring-accent-500 focus:border-transparent
                         outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as typeof formData.role })}
              className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       outline-none text-sm"
            >
              <option value="admin">Admin</option>
              <option value="advisor">Advisor</option>
              <option value="client">Client</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       outline-none text-sm"
            />
            <p className="text-xs text-brand-500 mt-1">Minimum 8 characters</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 disabled:opacity-50"
            >
              {loading && (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              )}
              Create User
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
