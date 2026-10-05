import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameReducer } from './hooks/useGameReducer'
import { useScoreAnimation } from './hooks/useScoreAnimation'
import GameScreen from './components/GameScreen'
import SolutionPanel from './components/SolutionPanel'
import ProgressStats from './components/ProgressStats'
import ErrorBoundary from './components/ErrorBoundary'
import Button from './components/Button'
import { BUTTON_BASE, BUTTON_VARIANTS, PRIMARY_STYLE } from './components/buttonStyles'
import { LEVELS } from './data/levels'
import type { GameAction } from './types'

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

// Exact literal values copied from redesign-mockup.html's <style> block — not
// re-derived, not estimated from a screenshot. Every color/size below is a
// 1:1 copy of that file's .diff-tag / .card rules.
const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   '#34d399',
  medium: '#fbbf24',
  hard:   '#f87171',
}

export default function App() {
  const [state, dispatch] = useGameReducer()
  const currentLevel = LEVELS.find(l => l.id === state.currentLevelId)
  const animatedFailScore = useScoreAnimation(state.score, 700)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <AnimatePresence mode="wait">

          {state.screen === 'home' && (
            <motion.div key="home" {...fade}
              className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
              style={{ paddingTop: 100, paddingBottom: 100, paddingLeft: 24, paddingRight: 24 }}
            >
              {/* radial glow — exact mockup params: 700x500, top:-20%, centered, rgba(124,106,247,0.20) */}
              <div className="absolute pointer-events-none"
                style={{
                  top: '-20%', left: '50%', transform: 'translateX(-50%)',
                  width: 700, height: 500,
                  background: 'radial-gradient(ellipse, rgba(124,106,247,0.20) 0%, transparent 70%)',
                }}
              />

              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative z-10" style={{ fontSize: 64 }}>
                ⚔️
              </motion.div>

              <div aria-hidden="true" style={{ height: 28 }} />

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 font-extrabold"
                style={{ fontSize: 56, letterSpacing: '-0.02em' }}
              >
                <span style={{ color: '#f0f0f8' }}>CSS Battle </span>
                <span style={{ background: 'linear-gradient(135deg, #f0f0f8 20%, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Arena
                </span>
              </motion.h1>

              <div aria-hidden="true" style={{ height: 18 }} />

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10"
                style={{ color: '#8a8a9c', fontSize: 17, maxWidth: 460, lineHeight: 1.6 }}>
                Match target designs by writing CSS.
                Scored by pixel-perfect comparison not guesswork.
              </motion.p>

              <div aria-hidden="true" style={{ height: 40 }} />

              <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                transition={{ delay: 0.4 }}
                onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
                className={`${BUTTON_BASE} ${BUTTON_VARIANTS.primary} relative z-10`}
                style={PRIMARY_STYLE}>
                Start Playing
                <span aria-hidden="true">→</span>
              </motion.button>

              <div aria-hidden="true" style={{ height: 48 }} />

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative z-10" style={{ display: 'flex', gap: 32 }}>
                <div className="text-center">
                  <div className="font-extrabold" style={{ fontSize: 22, color: '#d8d4fb' }}>{LEVELS.length}</div>
                  <div className="uppercase" style={{ fontSize: 11, color: '#5c5c70', letterSpacing: '0.08em', marginTop: 2 }}>Levels</div>
                </div>
                <div className="text-center">
                  <div className="font-extrabold" style={{ fontSize: 22, color: '#d8d4fb' }}>3</div>
                  <div className="uppercase" style={{ fontSize: 11, color: '#5c5c70', letterSpacing: '0.08em', marginTop: 2 }}>Difficulties</div>
                </div>
                <div className="text-center">
                  <div className="font-extrabold" style={{ fontSize: 22, color: '#d8d4fb' }}>100%</div>
                  <div className="uppercase" style={{ fontSize: 11, color: '#5c5c70', letterSpacing: '0.08em', marginTop: 2 }}>Precision scoring</div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {state.screen === 'levelSelect' && (
            <motion.div key="levelSelect" {...fade}
              style={{ minHeight: '100vh', padding: '40px 0', borderBottom: '4px dashed #1c1c2a', boxSizing: 'border-box' }}
            >
              <div style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 40px', boxSizing: 'border-box' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
                  <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4, color: '#f0f0f8' }}>Choose a Level</h2>
                    <p style={{ color: '#6a6a7e', fontSize: 13 }}>{LEVELS.length} challenges · easy to hard</p>
                  </div>
                  <button onClick={() => dispatch({ type: 'GO_HOME' })}
                    style={{
                      color: '#6a6a7e', fontSize: 13, padding: '8px 14px', borderRadius: 8,
                      background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#a0a0b4' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#6a6a7e' }}
                  >
                    ← Home
                  </button>
                </div>

                <ProgressStats />

                <LevelGrid dispatch={dispatch} />
              </div>
            </motion.div>
          )}

          {state.screen === 'playing' && state.currentLevelId !== null && (
            <motion.div key={`playing-${state.currentLevelId}`} {...fade} className="h-screen">
              <GameScreen state={state} dispatch={dispatch} />
            </motion.div>
          )}

          {state.screen === 'complete' && currentLevel && (
            <motion.div key="complete" {...fade}>
              <SolutionPanel
                targetCSS={currentLevel.targetCSS}
                userCSS={state.userCSS}
                score={state.score}
                levelTitle={currentLevel.title}
                hasNextLevel={LEVELS.some(l => l.id === currentLevel.id + 1)}
                onNext={() => {
                  const next = LEVELS.find(l => l.id === currentLevel.id + 1)
                  if (next) {
                    dispatch({ type: 'START_LEVEL', levelId: next.id })
                  } else {
                    // last level — nothing to advance to, send them back to browse
                    dispatch({ type: 'GO_LEVEL_SELECT' })
                  }
                }}
                onRetry={() => dispatch({ type: 'RETRY_LEVEL' })}
              />
            </motion.div>
          )}

          {state.screen === 'failed' && (
            <motion.div key="failed" {...fade} className="min-h-screen flex items-center justify-center px-6 py-14">
              <div className="text-center max-w-md w-full">
                <div className="text-6xl mb-6">{state.timeLeft <= 0 ? '⏰' : '📉'}</div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-3">
                  {state.timeLeft <= 0 ? "Time's Up" : 'Not Quite There'}
                </h2>
                <p className="text-gray-400 mb-3">You reached</p>
                <div className="text-6xl font-black text-rose-400 tabular-nums">{animatedFailScore}%</div>
                <div className="flex flex-wrap gap-36 justify-center my-12">
                  <Button variant="primary" onClick={() => dispatch({ type: 'RETRY_LEVEL' })}>
                    Try Again
                  </Button>
                  <Button variant="secondary" onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}>
                    Level Select
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'

const DIFFICULTY_FILTERS: { value: DifficultyFilter; label: string }[] = [
  { value: 'all',    label: 'All' },
  { value: 'easy',   label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard',   label: 'Hard' },
]

function LevelGrid({ dispatch }: { dispatch: React.Dispatch<GameAction> }) {
  const [query, setQuery]         = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')

  const filtered = LEVELS.filter(level => {
    const matchesQuery = level.title.toLowerCase().includes(query.trim().toLowerCase())
    const matchesDifficulty = difficulty === 'all' || level.difficulty === difficulty
    return matchesQuery && matchesDifficulty
  })

  return (
    <div>
      {/* .toolbar / .search / .pills — literal copy of redesign-mockup.html */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search levels…"
            aria-label="Search levels by name"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#12121c', border: '1px solid #1e1e2c', borderRadius: 10,
              padding: '10px 14px 10px 36px', fontSize: 13, color: '#f0f0f8',
              fontFamily: 'inherit', outline: 'none',
            }}
          />
          <span aria-hidden="true" style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: '#4a4a5c', fontSize: 13, pointerEvents: 'none',
          }}>
            ⌕
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6 }} role="group" aria-label="Filter by difficulty">
          {DIFFICULTY_FILTERS.map(f => {
            const active = difficulty === f.value
            return (
              <button
                key={f.value}
                onClick={() => setDifficulty(f.value)}
                aria-pressed={active}
                style={{
                  padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  fontFamily: 'inherit', cursor: 'pointer',
                  background: active ? '#7c6af7' : '#12121c',
                  color: active ? '#ffffff' : '#6a6a7e',
                  border: `1px solid ${active ? '#7c6af7' : '#1e1e2c'}`,
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#6a6a7e', fontSize: 13 }}>
          No levels match "{query}"{difficulty !== 'all' ? ` in ${difficulty}` : ''}.
        </div>
      ) : (
        // .grid — literal copy: display:grid; grid-template-columns:repeat(4,1fr); gap:14px
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {filtered.map((level, i) => {
            const completed = localStorage.getItem(`completed_${level.id}`) === 'true'
            const best = parseInt(localStorage.getItem(`personal_best_${level.id}`) ?? '0', 10)
            const accent = DIFFICULTY_COLORS[level.difficulty]
            return (
              <motion.button key={level.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ delay: Math.min(i, 12) * 0.03 }}
                onClick={() => dispatch({ type: 'START_LEVEL', levelId: level.id })}
                style={{
                  position: 'relative', overflow: 'hidden', textAlign: 'left',
                  background: '#12121c', border: '1px solid #1e1e2c', borderRadius: 14,
                  padding: 18, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {/* .card::before left accent bar */}
                <span aria-hidden="true" style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: accent,
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: '#2c2c3c' }}>
                    {String(level.id).padStart(2, '0')}
                  </span>
                  {completed && (
                    <span style={{
                      fontSize: 9, background: 'rgba(52,211,153,0.15)', color: '#34d399',
                      padding: '3px 8px', borderRadius: 999, fontWeight: 700,
                    }}>
                      ✓ Done
                    </span>
                  )}
                </div>

                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: '#f0f0f8' }}>
                  {level.title}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', color: accent }}>
                    {level.difficulty}
                  </span>
                  {best > 0 && (
                    <span style={{ fontSize: 10, color: '#52526a', fontFamily: 'monospace' }}>
                      {best}%
                    </span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}