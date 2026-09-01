
import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#7c6af7', '#a78bfa', '#f472b6', '#34d399', '#fbbf24']
const PARTICLE_COUNT = 60

interface Particle {
  id:       number
  x:        number   // vw offset from center at rest
  dx:       number    // horizontal drift during fall
  delay:    number
  duration: number
  size:     number
  color:    string
  rotate:   number
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    x:        (Math.random() - 0.5) * 90,
    dx:       (Math.random() - 0.5) * 30,
    delay:    Math.random() * 0.25,
    duration: 1.6 + Math.random() * 1.1,
    size:     5 + Math.random() * 6,
    color:    COLORS[id % COLORS.length],
    rotate:   Math.random() * 360,
  }))
}

export default function Confetti() {
  const particles = useMemo(() => generateParticles(), [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <motion.span
          key={p.id}
          initial={{
            opacity: 1,
            x: `calc(50vw + ${p.x}vw)`,
            y: '-5vh',
            rotate: 0,
          }}
          animate={{
            opacity: [1, 1, 0],
            x: `calc(50vw + ${p.x + p.dx}vw)`,
            y: '105vh',
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  )
}