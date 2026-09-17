// components/ProgressStats.tsx
// overall progress summary at the top of level select — reads from localStorage

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { LEVELS } from '../data/levels'

interface StatCardProps {
  icon:      string
  iconBg:    string
  label:     string
  value:     string | number
  valueColor?: string
  delay?:    number
}

function StatCard({ icon, iconBg, label, value, valueColor = 'text-white', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-3"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${iconBg}`} aria-hidden="true">
        {icon}
      </div>
      <div className="min-w-0">
        <div className={`text-lg font-extrabold font-mono leading-tight truncate ${valueColor}`}>
          {value}
        </div>
        <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
          {label}
        </div>
      </div>
    </motion.div>
  )
}

export default function ProgressStats() {
  const stats = useMemo(() => {
    const completed: number[] = []
    const scores:    number[] = []
    let streak = 0
    let counting = true

    // streak breaks on first incomplete level
    for (const level of LEVELS) {
      const isDone = localStorage.getItem(`completed_${level.id}`) === 'true'
      const best   = parseInt(localStorage.getItem(`personal_best_${level.id}`) ?? '0', 10)
      if (isDone) {
        completed.push(level.id)
        if (best > 0) scores.push(best)
        if (counting) streak++
      } else {
        counting = false
      }
    }

    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0

    return { completed: completed.length, streak, avgScore, bestScore }
  }, [])

  if (stats.completed === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        icon="✓"
        iconBg="bg-purple-500/15"
        label="Completed"
        value={`${stats.completed} / ${LEVELS.length}`}
        valueColor="text-purple-300"
        delay={0}
      />
      <StatCard
        icon="🔥"
        iconBg="bg-amber-500/15"
        label="Win streak"
        value={stats.streak}
        valueColor={stats.streak >= 3 ? 'text-amber-300' : 'text-white'}
        delay={0.05}
      />
      <StatCard
        icon="◎"
        iconBg="bg-emerald-500/15"
        label="Avg score"
        value={`${stats.avgScore}%`}
        valueColor={stats.avgScore >= 90 ? 'text-emerald-300' : 'text-yellow-300'}
        delay={0.1}
      />
      <StatCard
        icon="★"
        iconBg="bg-pink-500/15"
        label="Best score"
        value={`${stats.bestScore}%`}
        valueColor="text-pink-300"
        delay={0.15}
      />
    </div>
  )
}