'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { cn, formatCurrency, formatPercent, formatCompact } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  FileText,
  CheckSquare,
  Clock,
  ArrowRight,
  BarChart3,
  Activity,
} from 'lucide-react'

// Mock data - would come from API
const metrics = [
  {
    label: 'Total AUM',
    value: formatCompact(45600000),
    change: 2.4,
    trend: 'up' as const,
    icon: BarChart3,
  },
  {
    label: 'Active Clients',
    value: '24',
    change: 0,
    trend: 'neutral' as const,
    icon: Users,
  },
  {
    label: 'Portfolio Risk',
    value: 'Moderate',
    change: null,
    trend: 'neutral' as const,
    icon: Activity,
    statusColor: 'warning',
  },
  {
    label: 'Pending Tasks',
    value: '7',
    change: null,
    trend: 'neutral' as const,
    icon: CheckSquare,
    urgent: 3,
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'briefing',
    title: 'Weekly Briefing Generated',
    client: 'Johnson Family Trust',
    time: '2 hours ago',
    status: 'pending_review',
  },
  {
    id: 2,
    type: 'alert',
    title: 'Risk Alert: VIX Spike',
    description: 'Volatility index exceeded threshold',
    time: '4 hours ago',
    status: 'acknowledged',
  },
  {
    id: 3,
    type: 'document',
    title: 'Q4 Statement Uploaded',
    client: 'Smith Holdings',
    time: '1 day ago',
    status: 'complete',
  },
  {
    id: 4,
    type: 'task',
    title: 'Quarterly Review Due',
    client: 'Anderson Capital',
    time: 'Due in 3 days',
    status: 'upcoming',
  },
]

const upcomingTasks = [
  {
    id: 1,
    title: 'Prepare Monthly Briefings',
    dueDate: 'Today',
    priority: 'high',
    clients: 8,
  },
  {
    id: 2,
    title: 'Review Risk Allocations',
    dueDate: 'Tomorrow',
    priority: 'medium',
    clients: 3,
  },
  {
    id: 3,
    title: 'Client Meeting: Johnson Family',
    dueDate: 'Wed, Feb 5',
    priority: 'high',
    clients: 1,
  },
]

export function HubDashboard() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-brand-900 dark:text-white">
            Good morning, Bastion
          </h1>
          <p className="text-brand-500 dark:text-brand-400 mt-1">
            Here's what needs your attention today.
          </p>
        </motion.div>
        <motion.div variants={fadeInUp} className="flex items-center gap-3">
          <button className="btn btn-secondary px-4 py-2 rounded-lg text-sm">
            <FileText size={16} />
            Generate Report
          </button>
          <button className="btn btn-primary px-4 py-2 rounded-lg text-sm">
            <AlertTriangle size={16} />
            Risk Check
          </button>
        </motion.div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            variants={fadeInUp}
            className={cn(
              'card p-5 relative overflow-hidden group',
              'hover:shadow-md transition-shadow duration-300'
            )}
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/0 to-accent-500/0 group-hover:from-accent-500/5 group-hover:to-transparent transition-all duration-500 -z-10" />

            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                'p-2 rounded-lg',
                'bg-brand-100 dark:bg-brand-800',
                'group-hover:bg-accent-100 dark:group-hover:bg-accent-900/30',
                'transition-colors duration-300'
              )}>
                <metric.icon className="w-5 h-5 text-brand-600 dark:text-brand-300 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors" />
              </div>
              {metric.change !== null && (
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  metric.trend === 'up' && 'text-success-600',
                  metric.trend === 'down' && 'text-danger-600',
                  metric.trend === 'neutral' && 'text-brand-400'
                )}>
                  {metric.trend === 'up' && <TrendingUp size={14} />}
                  {metric.trend === 'down' && <TrendingDown size={14} />}
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              )}
              {metric.urgent && (
                <span className="px-2 py-0.5 text-xs font-medium bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400 rounded-full">
                  {metric.urgent} urgent
                </span>
              )}
              {metric.statusColor && (
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  metric.statusColor === 'success' && 'bg-success-100 text-success-700',
                  metric.statusColor === 'warning' && 'bg-warning-100 text-warning-700',
                  metric.statusColor === 'danger' && 'bg-danger-100 text-danger-700'
                )}>
                  Active
                </span>
              )}
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-brand-900 dark:text-white mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-brand-500 dark:text-brand-400">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="lg:col-span-2 card"
        >
          <div className="p-5 border-b border-brand-100 dark:border-brand-800 flex items-center justify-between">
            <h2 className="font-semibold text-brand-900 dark:text-white">
              Recent Activity
            </h2>
            <button className="text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 font-medium flex items-center gap-1">
              View all
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-brand-100 dark:divide-brand-800">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Activity icon */}
                  <div className={cn(
                    'p-2 rounded-lg flex-shrink-0',
                    activity.type === 'briefing' && 'bg-accent-100 dark:bg-accent-900/30',
                    activity.type === 'alert' && 'bg-warning-100 dark:bg-warning-900/30',
                    activity.type === 'document' && 'bg-brand-100 dark:bg-brand-800',
                    activity.type === 'task' && 'bg-success-100 dark:bg-success-900/30'
                  )}>
                    {activity.type === 'briefing' && <FileText size={16} className="text-accent-600 dark:text-accent-400" />}
                    {activity.type === 'alert' && <AlertTriangle size={16} className="text-warning-600 dark:text-warning-400" />}
                    {activity.type === 'document' && <FileText size={16} className="text-brand-600 dark:text-brand-400" />}
                    {activity.type === 'task' && <CheckSquare size={16} className="text-success-600 dark:text-success-400" />}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-brand-900 dark:text-white truncate">
                        {activity.title}
                      </h3>
                      {activity.status === 'pending_review' && (
                        <span className="px-2 py-0.5 text-xs bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400 rounded-full">
                          Review
                        </span>
                      )}
                    </div>
                    {activity.client && (
                      <p className="text-sm text-brand-500 dark:text-brand-400 truncate">
                        {activity.client}
                      </p>
                    )}
                    {activity.description && (
                      <p className="text-sm text-brand-500 dark:text-brand-400 truncate">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  {/* Time */}
                  <div className="text-xs text-brand-400 flex-shrink-0">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="card"
        >
          <div className="p-5 border-b border-brand-100 dark:border-brand-800 flex items-center justify-between">
            <h2 className="font-semibold text-brand-900 dark:text-white">
              Upcoming Tasks
            </h2>
            <button className="text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 font-medium flex items-center gap-1">
              See all
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  'p-3 rounded-xl border transition-colors cursor-pointer',
                  'border-brand-100 dark:border-brand-800',
                  'hover:border-brand-200 dark:hover:border-brand-700',
                  'hover:bg-brand-50 dark:hover:bg-brand-800/50'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-brand-900 dark:text-white text-sm">
                    {task.title}
                  </h3>
                  <span className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0',
                    task.priority === 'high' && 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
                    task.priority === 'medium' && 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
                    task.priority === 'low' && 'bg-brand-100 text-brand-600 dark:bg-brand-700 dark:text-brand-300'
                  )}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-brand-500 dark:text-brand-400">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {task.dueDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    {task.clients} client{task.clients !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
