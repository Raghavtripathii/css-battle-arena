// App.tsx
// added SolutionPanel after completion, ProgressStats on level select,
// ErrorBoundary wrapping the whole app

import { AnimatePresence, motion } from 'framer-motion'
import { useGameReducer } from './hooks/useGameReducer'
import GameScreen from './components/GameScreen'
import SolutionPanel from './components/SolutionPanel'
import ProgressStats from './components/ProgressStats'
import ErrorBoundary from './components/ErrorBoundary'
import { LEVELS } from './data/levels'
import type { GameAction } from './types'

const fade = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1, transition: { duration: 0.3 } },
  exit:     { opacity: 0, transition: { duration: 0.2 } },
}

export default function App() {
  const [state, dispatch] = useGameReducer()

  const currentLevel = LEVELS.find(l => l.id === state.currentLevelId)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <AnimatePresence mode="wait">

          {state.screen === 'home' && (
            <motion.div key="home" {...fade}
              className="min-h-screen flex flex-col items-center justify-center text-center px-6"
            >
              <div className="fixed inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 40% at 50% -5%, rgba(124,106,247,0.18) 0%, transparent 65%)' }}
              />
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }} className="text-7xl mb-6 relative z-10">
                ⚔️
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-extrabold tracking-tight mb-4 relative z-10"
                style={{ background: 'linear-gradient(135deg, #f0f0f8 20%, #7c6af7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                CSS Battle Arena
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-lg max-w-md mb-10 leading-relaxed relative z-10">
                Match target designs by writing CSS.
                Scored by pixel-perfect comparison — not guesswork.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-3 mb-12 relative z-10">
                {[
                  '🎯 Pixel comparison engine',
                  '🔴 Visual diff overlay',
                  '💡 Progressive hints',
                  '⏱️ Timed challenges',
                  '🏆 Personal bests',
                  '💾 Auto-saves progress',
                  '📖 Solution reveal',
                  '🔥 Win streaks',
                ].map(f => (
                  <span key={f} className="text-sm px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400">{f}</span>
                ))}
              </motion.div>
              <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
                className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg rounded-xl transition-colors relative z-10"
                style={{ boxShadow: '0 0 40px rgba(124,106,247,0.35)' }}>
                Start Playing →
              </motion.button>
            </motion.div>
          )}

          {state.screen === 'levelSelect' && (
            <motion.div key="levelSelect" {...fade} className="min-h-screen px-8 py-10">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Choose a Level</h2>
                    <p className="text-gray-500 text-sm mt-1">10 challenges · easy to hard</p>
                  </div>
                  <button onClick={() => dispatch({ type: 'GO_HOME' })}
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    ← Home
                  </button>
                </div>

                {/* only shows after first completion */}
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
                onNext={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
                onRetry={() => dispatch({ type: 'RETRY_LEVEL' })}
              />
            </motion.div>
          )}

          {state.screen === 'failed' && (
            <motion.div key="failed" {...fade} className="min-h-screen flex items-center justify-center">
              <div className="text-center max-w-md px-6">
                <div className="text-6xl mb-4">⏰</div>
                <h2 className="text-3xl font-extrabold mb-2">Time's Up</h2>
                <p className="text-gray-400 mb-2">You reached</p>
                <div className="text-5xl font-black text-red-400 mb-8">{state.score}%</div>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => dispatch({ type: 'RETRY_LEVEL' })}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors">
                    Try Again
                  </button>
                  <button onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
                    className="px-6 py-3 border border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl transition-colors">
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

function LevelGrid({ dispatch }: { dispatch: React.Dispatch<GameAction> }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {LEVELS.map((level, i) => {
        const completed = localStorage.getItem(`completed_${level.id}`) === 'true'
        const best = parseInt(localStorage.getItem(`personal_best_${level.id}`) ?? '0', 10)
        return (
          <motion.button key={level.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => dispatch({ type: 'START_LEVEL', levelId: level.id })}
            className="text-left p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-500/40 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl font-black text-white/20 font-mono">{String(level.id).padStart(2, '0')}</span>
              {completed && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-semibold">✓ Done</span>
              )}
            </div>
            <div className="font-semibold text-sm text-white mb-1 group-hover:text-purple-300 transition-colors">
              {level.title}
            </div>
            <div className={`text-[10px] font-semibold uppercase tracking-wide mb-3 ${
              level.difficulty === 'easy' ? 'text-green-500' :
              level.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {level.difficulty}
            </div>
            {best > 0 && (
              <div className="text-[11px] text-gray-600 font-mono">
                Best: <span className="text-gray-400">{best}%</span>
              </div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}