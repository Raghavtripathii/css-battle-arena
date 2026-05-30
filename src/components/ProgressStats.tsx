// components/ProgressStats.tsx
// overall progress summary at the top of level select — reads from localStorage

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { LEVELS } from '../data/levels'

interface StatBoxProps {
  label: string
  value: string | number
  sub?:  string
  color?: string
  delay?: number
}

function StatBox({ label, value, sub, color = 'text-white', delay = 0 }: StatBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-1"
    >
      <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
        {label}
      </div>
      <div className={`text-2xl font-extrabold font-mono ${color}`}>
        {value}
      </div>
      {sub && (
        <div className="text-[11px] text-gray-700">{sub}</div>
      )}
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      <StatBox
        label="Completed"
        value={`${stats.completed} / ${LEVELS.length}`}
        color="text-purple-400"
        delay={0}
      />
      <StatBox
        label="Win streak"
        value={stats.streak}
        sub={stats.streak >= 3 ? '🔥 On fire' : 'consecutive levels'}
        color={stats.streak >= 3 ? 'text-orange-400' : 'text-white'}
        delay={0.05}
      />
      <StatBox
        label="Avg score"
        value={`${stats.avgScore}%`}
        color={stats.avgScore >= 90 ? 'text-green-400' : 'text-yellow-400'}
        delay={0.1}
      />
      <StatBox
        label="Best score"
        value={`${stats.bestScore}%`}
        color="text-green-400"
        delay={0.15}
      />
    </div>
  )
}