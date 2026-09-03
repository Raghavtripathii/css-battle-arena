import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameReducer } from './hooks/useGameReducer'
import { useScoreAnimation } from './hooks/useScoreAnimation'
import GameScreen from './components/GameScreen'
import SolutionPanel from './components/SolutionPanel'
import ProgressStats from './components/ProgressStats'
import ErrorBoundary from './components/ErrorBoundary'
import { LEVELS } from './data/levels'
import type { GameAction } from './types'

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

const DIFFICULTY_STYLES: Record<string, string> = {
  easy:   'bg-emerald-500/15 text-emerald-400',
  medium: 'bg-amber-500/15 text-amber-400',
  hard:   'bg-rose-500/15 text-rose-400',
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
              className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20"
            >
              <div className="fixed inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 40% at 50% -5%, rgba(124,106,247,0.18) 0%, transparent 65%)' }}
              />

              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }} className="text-7xl mb-8 relative z-10">
                ⚔️
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-5 relative z-10"
                style={{ background: 'linear-gradient(135deg, #f0f0f8 20%, #7c6af7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                CSS Battle Arena
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed relative z-10">
                Match target designs by writing CSS.
                Scored by pixel-perfect comparison — not guesswork.
              </motion.p>

              <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                transition={{ delay: 0.4 }}
                onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
                className="inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-lg rounded-full transition-all relative z-10"
                style={{ boxShadow: '0 8px 30px rgba(124,106,247,0.4)' }}>
                Start Playing
                <span aria-hidden="true">→</span>
              </motion.button>
            </motion.div>
          )}

          {state.screen === 'levelSelect' && (
            <motion.div key="levelSelect" {...fade} className="min-h-screen px-6 sm:px-10 py-14">
              <div className="max-w-5xl mx-auto">

                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-1.5">Choose a Level</h2>
                    <p className="text-gray-500 text-sm">{LEVELS.length} challenges · easy to hard</p>
                  </div>
                  <button onClick={() => dispatch({ type: 'GO_HOME' })}
                    className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/[0.04]">
                    ← Home
                  </button>
                </div>

                {/* only renders once the player has completed at least one level */}
                <div className="mb-10">
                  <ProgressStats />
                </div>

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
                <div className="text-6xl font-black text-rose-400 mb-12 tabular-nums">{animatedFailScore}%</div>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => dispatch({ type: 'RETRY_LEVEL' })}
                    className="px-7 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors">
                    Try Again
                  </button>
                  <button onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
                    className="px-7 py-3.5 border border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl transition-colors">
                    Level Select
                  </button>
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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search levels…"
            aria-label="Search levels by name"
            className="w-full text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          <svg aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div className="flex gap-2" role="group" aria-label="Filter by difficulty">
          {DIFFICULTY_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setDifficulty(f.value)}
              aria-pressed={difficulty === f.value}
              className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors ${
                difficulty === f.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/[0.04] text-gray-500 hover:text-gray-300 hover:bg-white/[0.07]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600 text-sm">
          No levels match "{query}"{difficulty !== 'all' ? ` in ${difficulty}` : ''}.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((level, i) => {
            const completed = localStorage.getItem(`completed_${level.id}`) === 'true'
            const best = parseInt(localStorage.getItem(`personal_best_${level.id}`) ?? '0', 10)
            return (
              <motion.button key={level.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ delay: Math.min(i, 12) * 0.03 }}
                onClick={() => dispatch({ type: 'START_LEVEL', levelId: level.id })}
                className="text-left p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-500/40 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl font-black text-white/20 font-mono tracking-tight">
                    {String(level.id).padStart(2, '0')}
                  </span>
                  {completed && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
                      ✓ Done
                    </span>
                  )}
                </div>

                <div className="font-semibold text-sm text-white mb-3 leading-snug group-hover:text-purple-300 transition-colors">
                  {level.title}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${DIFFICULTY_STYLES[level.difficulty]}`}>
                    {level.difficulty}
                  </span>
                  {best > 0 && (
                    <span className="text-[11px] text-gray-600 font-mono">
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