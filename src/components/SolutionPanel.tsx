// components/SolutionPanel.tsx
// shown after a level is passed — score, reference solution, next-level flow

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScoreAnimation } from '../hooks/useScoreAnimation'
import Confetti from './Confetti'
import Button from './Button'

interface Props {
  targetCSS:    string
  userCSS:      string
  score:        number
  levelTitle:   string
  hasNextLevel: boolean
  onNext:       () => void
  onRetry:      () => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard permission denied — fail silently, button just won't confirm
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function SolutionPanel({
  targetCSS,
  userCSS,
  score,
  levelTitle,
  hasNextLevel,
  onNext,
  onRetry,
}: Props) {
  const [showSolution, setShowSolution] = useState(false)
  const animatedScore = useScoreAnimation(score, 900)

  const isPerfect   = score === 100
  const isGood      = score >= 90
  const scoreColor  = isPerfect ? 'text-green-400' : isGood ? 'text-yellow-400' : 'text-red-400'
  const emoji       = isPerfect ? '🏆' : isGood ? '🎉' : '💪'
  const headline    = isPerfect ? 'Perfect Match!' : isGood ? 'Level Complete!' : 'Close Enough!'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center gap-12 px-6 py-16">
      {isPerfect && <Confetti />}

      {/* hero — centered both horizontally and vertically, generous rhythm between each piece */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center"
      >
        <div className="text-6xl mb-6">{emoji}</div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">{headline}</h1>
        <p className="text-gray-500 text-base mb-6">{levelTitle}</p>
        <div className={`text-7xl font-black tabular-nums ${scoreColor}`}>
          {animatedScore}%
        </div>

        <div className="flex flex-wrap items-center justify-center gap-36 mt-12">
          <Button variant="primary" onClick={onNext}>
            {hasNextLevel ? (
              <>Next Level <span aria-hidden="true">→</span></>
            ) : (
              'All Levels ✓'
            )}
          </Button>
          <Button variant="secondary" onClick={onRetry}>
            Beat my score
          </Button>
        </div>
      </motion.div>

      {/* solution reveal — its own centered card, clearly separated from the hero above */}
      <div className="w-full max-w-3xl">
        <button
          onClick={() => setShowSolution(v => !v)}
          className="w-full flex items-center justify-between gap-4 px-6 py-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">📖</span>
            <div>
              <div className="font-semibold text-sm text-white">See target solution</div>
              <div className="text-xs text-gray-500 mt-0.5">Compare your CSS to the intended approach</div>
            </div>
          </div>
          <motion.span
            animate={{ rotate: showSolution ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-500 flex-shrink-0"
            aria-hidden="true"
          >
            ↓
          </motion.span>
        </button>

        <AnimatePresence>
          {showSolution && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-6">
                <p className="text-sm text-gray-500 mb-4">
                  There is no single correct answer in CSS — this is just one clean way to solve it. Your approach might be equally valid or even better.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/[0.08] bg-[#0d0d12] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your CSS</span>
                      <CopyButton text={userCSS} />
                    </div>
                    <pre className="text-xs text-gray-300 font-mono p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {userCSS}
                    </pre>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-[#0d0d12] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target CSS</span>
                      <CopyButton text={targetCSS} />
                    </div>
                    <pre className="text-xs text-gray-300 font-mono p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {targetCSS}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}