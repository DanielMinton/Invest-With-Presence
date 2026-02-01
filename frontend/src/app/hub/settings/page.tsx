'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { settingsApi, type Settings } from '@/lib/api'
import {
  Settings as SettingsIcon,
  Building2,
  Clock,
  DollarSign,
  Bell,
  Shield,
  Key,
  Save,
  Check,
  AlertCircle,
} from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.get()
      setSettings(data)
    } catch (err) {
      console.error('Failed to load settings:', err)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return
    try {
      setSaving(true)
      setError(null)
      await settingsApi.update(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Phoenix',
    'Pacific/Honolulu',
    'UTC',
  ]

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' },
  ]

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-brand-900 dark:text-white mb-2">
          Failed to load settings
        </h2>
        <button
          onClick={loadSettings}
          className="btn btn-primary px-4 py-2 rounded-lg text-sm"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-900 dark:text-white">
            Settings
          </h1>
          <p className="text-brand-500 dark:text-brand-400 mt-1">
            Configure system preferences and security settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : saved ? (
            <Check size={16} />
          ) : (
            <Save size={16} />
          )}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold text-brand-900 dark:text-white mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-accent-500" />
          General Settings
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={settings.company_name}
              onChange={(e) => updateSetting('company_name', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       outline-none text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                         bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                         focus:ring-2 focus:ring-accent-500 focus:border-transparent
                         outline-none text-sm"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                Date Format
              </label>
              <select
                value={settings.date_format}
                onChange={(e) => updateSetting('date_format', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                         bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                         focus:ring-2 focus:ring-accent-500 focus:border-transparent
                         outline-none text-sm"
              >
                {dateFormats.map((fmt) => (
                  <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              className="w-full max-w-xs px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       outline-none text-sm"
            >
              {currencies.map((cur) => (
                <option key={cur.value} value={cur.value}>{cur.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold text-brand-900 dark:text-white mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-accent-500" />
          Notifications
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-lg bg-brand-50 dark:bg-brand-800/50 cursor-pointer">
            <div>
              <span className="font-medium text-brand-900 dark:text-white">Email Notifications</span>
              <p className="text-sm text-brand-500 mt-0.5">
                Receive email alerts for important system events
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.email_notifications}
              onChange={(e) => updateSetting('email_notifications', e.target.checked)}
              className="w-5 h-5 rounded border-brand-300 text-accent-500 focus:ring-accent-500"
            />
          </label>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold text-brand-900 dark:text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent-500" />
          Security
        </h2>
        <div className="space-y-6">
          <label className="flex items-center justify-between p-4 rounded-lg bg-brand-50 dark:bg-brand-800/50 cursor-pointer">
            <div>
              <span className="font-medium text-brand-900 dark:text-white">Require MFA</span>
              <p className="text-sm text-brand-500 mt-0.5">
                Require multi-factor authentication for all users
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.mfa_required}
              onChange={(e) => updateSetting('mfa_required', e.target.checked)}
              className="w-5 h-5 rounded border-brand-300 text-accent-500 focus:ring-accent-500"
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min={5}
                max={480}
                value={settings.session_timeout_minutes}
                onChange={(e) => updateSetting('session_timeout_minutes', parseInt(e.target.value) || 30)}
                className="w-full px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                         bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                         focus:ring-2 focus:ring-accent-500 focus:border-transparent
                         outline-none text-sm"
              />
              <p className="text-xs text-brand-500 mt-1">
                Inactive sessions will be logged out after this period
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                <Key className="w-4 h-4 inline mr-1" />
                Password Expiry (days)
              </label>
              <input
                type="number"
                min={0}
                max={365}
                value={settings.password_expiry_days}
                onChange={(e) => updateSetting('password_expiry_days', parseInt(e.target.value) || 90)}
                className="w-full px-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                         bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                         focus:ring-2 focus:ring-accent-500 focus:border-transparent
                         outline-none text-sm"
              />
              <p className="text-xs text-brand-500 mt-1">
                Set to 0 to disable password expiration
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
