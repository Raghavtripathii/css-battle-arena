// components/ProgressStats.tsx
// overall progress summary at the top of level select — reads from localStorage

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { LEVELS } from '../data/levels'

interface StatCardProps {
  icon:    string
  iconBg:  string
  label:   string
  value:   string | number
  delay?:  number
}

function StatCard({ icon, iconBg, label, value, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        background: '#12121c', border: '1px solid #1e1e2c', borderRadius: 14,
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
        minWidth: 0,
      }}
    >
      <div aria-hidden="true" style={{
        width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 16, flexShrink: 0, background: iconBg,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 19, fontWeight: 800, lineHeight: 1.1, color: '#f0f0f8',
          fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {value}
        </div>
        <div style={{ fontSize: 10, color: '#62627a', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
      <StatCard
        icon="✓"
        iconBg="rgba(124,106,247,0.15)"
        label="Completed"
        value={`${stats.completed} / ${LEVELS.length}`}
        delay={0}
      />
      <StatCard
        icon="🔥"
        iconBg="rgba(251,191,36,0.15)"
        label="Win streak"
        value={stats.streak}
        delay={0.05}
      />
      <StatCard
        icon="◎"
        iconBg="rgba(52,211,153,0.15)"
        label="Avg score"
        value={`${stats.avgScore}%`}
        delay={0.1}
      />
      <StatCard
        icon="★"
        iconBg="rgba(244,114,182,0.15)"
        label="Best score"
        value={`${stats.bestScore}%`}
        delay={0.15}
      />
    </div>
  )
}