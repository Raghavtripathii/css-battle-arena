import { useMemo, useState } from 'react'
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

const RING_RADIUS = 78
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS 

interface DiffLine {
  raw:   string
  match: boolean
}

function buildDiff(a: string, b: string): { left: DiffLine[]; right: DiffLine[] } {
  const aLines = a.split('\n')
  const bLines = b.split('\n')
  const len = Math.max(aLines.length, bLines.length)
  const left:  DiffLine[] = []
  const right: DiffLine[] = []
  for (let i = 0; i < len; i++) {
    const aLine = aLines[i] ?? ''
    const bLine = bLines[i] ?? ''
    const match = aLine.trim() === bLine.trim() && aLine.trim() !== ''
    left.push({ raw: aLine, match })
    right.push({ raw: bLine, match })
  }
  return { left, right }
}

function CodeLine({ line }: { line: DiffLine }) {
  const leadingMatch = line.raw.match(/^(\s*)(.*)$/s)
  const leading = leadingMatch?.[1] ?? ''
  const content = (leadingMatch?.[2] ?? line.raw).trimEnd()

  let body: React.ReactNode
  if (content === '') {
    body = ' '
  } else if (content === '}') {
    body = <span style={{ color: '#4a4a5c' }}>{'}'}</span>
  } else if (content.endsWith('{')) {
    body = <>{content.slice(0, -1).trim()} <span style={{ color: '#4a4a5c' }}>{'{'}</span></>
  } else if (content.includes(':')) {
    const colonIndex = content.indexOf(':')
    const prop = content.slice(0, colonIndex).trim()
    const rest = content.slice(colonIndex + 1).trim()
    const hasSemi = rest.endsWith(';')
    const value = hasSemi ? rest.slice(0, -1).trim() : rest
    body = (
      <>
        <span style={{ color: '#8b8bd8' }}>{prop}</span>
        <span style={{ color: '#4a4a5c' }}>: </span>
        <span style={{ color: '#d8d4fb' }}>{value}</span>
        {hasSemi && <span style={{ color: '#4a4a5c' }}>;</span>}
      </>
    )
  } else {
    body = <span style={{ color: '#d8d4fb' }}>{content}</span>
  }

  return (
    <div style={{
      display: 'flex', gap: 10, paddingLeft: 2,
      borderLeft: `2px solid ${line.match ? '#2b5c45' : '#6b5420'}`,
    }}>
      <span aria-hidden="true" style={{ width: 10, flexShrink: 0, color: line.match ? '#34d399' : '#fbbf24' }}>
        {line.match ? '✓' : '·'}
      </span>
      <span style={{ whiteSpace: 'pre' }}>{leading}</span>
      <span>{body}</span>
    </div>
  )
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
      style={{
        fontSize: 11, color: '#6a6a7e', background: 'transparent', border: 'none',
        cursor: 'pointer', fontFamily: 'inherit', padding: 0,
      }}
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
  const isPerfect = score === 100

  const ringScore  = Math.max(0, Math.min(100, animatedScore))
  const ringOffset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * ringScore) / 100

  const kicker   = isPerfect ? 'Pixel-perfect' : 'Level complete'
  const subtitle = isPerfect
    ? 'Every pixel lines up with the target.'
    : `You matched ${score}% of the target.`

  const diff = useMemo(() => buildDiff(userCSS, targetCSS), [userCSS, targetCSS])

  return (
    <div style={{
      minHeight: '100vh', background: '#050508', color: '#f0f0f8',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '72px 24px 64px', boxSizing: 'border-box',
    }}>
      {isPerfect && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        {/* precision-ring gauge — literal copy of the mockup's SVG geometry */}
        <div style={{ position: 'relative', width: 180, height: 180, marginBottom: 28 }}>
          <div aria-hidden="true" style={{
            position: 'absolute', inset: -40,
            background: 'radial-gradient(ellipse, rgba(52,211,153,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'relative', transform: 'rotate(-90deg)' }}>
            <circle cx="90" cy="90" r={RING_RADIUS} fill="none" stroke="#16161f" strokeWidth="8" />
            <circle
              cx="90" cy="90" r={RING_RADIUS} fill="none" stroke="#34d399" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE} strokeDashoffset={ringOffset}
              style={{ transition: 'stroke-dashoffset 0.9s ease-out' }}
            />
            {[0, 90, 180, 270].map(angle => (
              <line key={angle} x1="90" y1="4" x2="90" y2="16" stroke="#2a2a38" strokeWidth="2"
                transform={`rotate(${angle} 90 90)`} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#34d399', lineHeight: 1, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
              {animatedScore}%
            </div>
            <div style={{ fontSize: 11, color: '#52526a', marginTop: 6 }}>Match</div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: '#34d399', fontWeight: 600, marginBottom: 10 }}>{kicker}</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 8 }}>{levelTitle}</h1>
        <div style={{ color: '#6a6a7e', fontSize: 15, marginBottom: 36 }}>{subtitle}</div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginBottom: 56 }}>
          <Button variant="primary" onClick={onNext}>
            {hasNextLevel ? (
              <>Next level <span aria-hidden="true">→</span></>
            ) : (
              'All levels ✓'
            )}
          </Button>
          <Button variant="secondary" onClick={onRetry}>
            {isPerfect ? 'Try to beat 100%' : 'Beat my score'}
          </Button>
        </div>

        {/* Inspector — literal copy of the mockup's card, with real diff ticks */}
        <div style={{ width: '100%', background: '#12121c', border: '1px solid #1e1e2c', borderRadius: 16, overflow: 'hidden', textAlign: 'left' }}>
          <button
            onClick={() => setShowSolution(v => !v)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 22px', borderBottom: showSolution ? '1px solid #1e1e2c' : 'none',
              background: 'transparent', border: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer', fontFamily: 'inherit', color: 'inherit', textAlign: 'left',
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Compare your CSS</div>
              <div style={{ fontSize: 12, color: '#6a6a7e', marginTop: 2 }}>Yours vs. the target — matching lines are ticked green</div>
            </div>
            <motion.span
              animate={{ rotate: showSolution ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
              style={{ color: '#52526a', fontSize: 13, flexShrink: 0 }}
            >
              ▾
            </motion.span>
          </button>

          <AnimatePresence>
            {showSolution && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#8a8a9c' }}>Your CSS</span>
                      <CopyButton text={userCSS} />
                    </div>
                    <div style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 12.5, lineHeight: 1.85 }}>
                      {diff.left.map((l, i) => <CodeLine key={i} line={l} />)}
                    </div>
                  </div>
                  <div style={{ padding: '18px 20px', borderLeft: '1px solid #1e1e2c' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#8a8a9c' }}>Target CSS</span>
                      <CopyButton text={targetCSS} />
                    </div>
                    <div style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 12.5, lineHeight: 1.85 }}>
                      {diff.right.map((l, i) => <CodeLine key={i} line={l} />)}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '14px 22px', fontSize: 11, color: '#4a4a5c', borderTop: '1px solid #1e1e2c' }}>
                  There's no single correct answer — this is one clean way to solve it. Yours might be equally valid.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}