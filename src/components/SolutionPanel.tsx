// components/SolutionPanel.tsx
// shown after level complete — lets player compare their css to the target

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  targetCSS:  string
  userCSS:    string
  score:      number
  levelTitle: string
  onNext:     () => void
  onRetry:    () => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-3 py-1 rounded-md border border-white/10 text-gray-500 hover:text-gray-300 transition-colors font-mono"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
          {label}
        </span>
        <CopyButton text={code.trim()} />
      </div>
      <div className="bg-[#0d0d12] border border-white/[0.07] rounded-xl overflow-auto max-h-64">
        <pre className="p-4 text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
          {code.trim()}
        </pre>
      </div>
    </div>
  )
}

export default function SolutionPanel({
  targetCSS,
  userCSS,
  score,
  levelTitle,
  onNext,
  onRetry,
}: Props) {
  const [showSolution, setShowSolution] = useState(false)

  const isPerfect   = score === 100
  const isGood      = score >= 90
  const scoreColor  = isPerfect ? 'text-green-400' : isGood ? 'text-yellow-400' : 'text-red-400'
  const emoji       = isPerfect ? '🏆' : isGood ? '🎉' : '💪'
  const headline    = isPerfect ? 'Perfect Match!' : isGood ? 'Level Complete!' : 'Close Enough!'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="min-h-screen px-6 py-10 bg-[#0a0a0f]"
    >
      <div className="max-w-3xl mx-auto">

        {/* score header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">{emoji}</div>
          <h2 className="text-3xl font-extrabold mb-1">{headline}</h2>
          <p className="text-gray-500 text-sm mb-4">{levelTitle}</p>
          <div className={`text-6xl font-black ${scoreColor} mb-6`}>{score}%</div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onNext}
              className="px-7 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors"
            >
              Next Level →
            </button>
            <button
              onClick={onRetry}
              className="px-7 py-3 border border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl transition-colors"
            >
              Beat my score
            </button>
          </div>
        </div>

        {/* solution reveal */}
        <div className="border border-white/[0.07] rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowSolution(v => !v)}
            className="w-full px-6 py-4 flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-purple-400 text-lg">📖</span>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">
                  See target solution
                </div>
                <div className="text-xs text-gray-600">
                  Compare your CSS to the intended approach
                </div>
              </div>
            </div>
            <span className="text-gray-600 text-lg transition-transform"
              style={{ transform: showSolution ? 'rotate(180deg)' : 'none' }}>
              ↓
            </span>
          </button>

          <AnimatePresence>
            {showSolution && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 border-t border-white/[0.07]">
                  <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                    There is no single correct answer in CSS — this is just one clean way to solve it.
                    Your approach might be equally valid or even better.
                  </p>

                  <div className="flex gap-5 flex-col sm:flex-row">
                    <CodeBlock code={userCSS || '/* you wrote nothing */'} label="Your CSS" />
                    <CodeBlock code={targetCSS} label="Target CSS" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  )
}