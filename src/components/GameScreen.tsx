import { useEffect, useRef, useState, useCallback } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { defaultKeymap, indentWithTab, historyKeymap, history } from '@codemirror/commands'
import { css } from '@codemirror/lang-css'
import { oneDark } from '@codemirror/theme-one-dark'
import { motion } from 'framer-motion'

import type { GameState, GameAction, Level } from '../types'
import { LEVELS } from '../data/levels'
import { compareCanvases } from '../lib/scoring'
import { BUTTON_BASE, BUTTON_VARIANTS, PRIMARY_STYLE } from './buttonStyles'

import html2canvas from 'html2canvas'

const PREVIEW_W  = 400
const PREVIEW_H  = 300
const SCORE_DELAY = 600

// on the Level Select cards, kept consistent app-wide
const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   '#34d399',
  medium: '#fbbf24',
  hard:   '#f87171',
}

function buildDoc(html: string, userCSS: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: ${PREVIEW_W}px; height: ${PREVIEW_H}px; overflow: hidden; }
  ${userCSS}
</style>
</head>
<body>${html}</body>
</html>`
}
async function renderToCanvas(iframe: HTMLIFrameElement): Promise<HTMLCanvasElement | null> {
  const doc = iframe.contentDocument
  if (!doc || !doc.body) return null

  try {
    const canvas = await html2canvas(doc.body, {
      width:  PREVIEW_W,
      height: PREVIEW_H,
      backgroundColor: null,
      logging: false,
      scale: 1,
    })

    // if the canvas is completely blank the render failed — return null so
    // we don't report a false 100% match on two empty canvases
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let sum = 0
    for (let i = 0; i < data.length; i += 4) sum += data[i] + data[i + 1] + data[i + 2]
    return sum === 0 ? null : canvas
  } catch {
    // an unreadable/failed render — treat as a failed capture rather than crash
    return null
  }
}

function Timer({ seconds, dispatch }: { seconds: number; dispatch: React.Dispatch<GameAction> }) {
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [dispatch])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const danger = seconds <= 20
  const warn   = !danger && seconds <= 60
  const color  = danger ? '#f87171' : warn ? '#fbbf24' : '#f0f0f8'

  return (
    <motion.span
      animate={danger ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
      transition={danger ? { duration: 1, repeat: Infinity } : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color,
      }}
    >
      ⏱ {mins}:{secs.toString().padStart(2, '0')}
    </motion.span>
  )
}

// ---- precision bar — exact copy of the mockup's .precision / .precision-fill ----
function PrecisionBar({ score, target, hasInput }: { score: number; target: number; hasInput: boolean }) {
  const passed = score >= target
  const color  = passed ? '#34d399' : target - score <= 20 ? '#fbbf24' : '#7c6af7'
  const fillWidth = hasInput ? Math.min(100, Math.max(0, score)) : 0

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 10, width: 220, flexShrink: 0 }}
      aria-label={`Match score ${hasInput ? score : 0}%, pass at ${target}%`}
      title={`Match score ${hasInput ? score : 0}% — pass at ${target}%`}
    >
      <div style={{ position: 'relative', flex: 1, height: 6, borderRadius: 999, background: '#16161f' }}>
        <motion.div
          style={{ position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 999, background: color }}
          animate={{ width: `${fillWidth}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        <div aria-hidden="true" style={{ position: 'absolute', top: -3, bottom: -3, width: 2, background: '#4a4a5c', left: `${target}%` }} />
      </div>
      <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: hasInput ? color : '#52526a', width: 40, textAlign: 'right' }}>
        {hasInput ? `${score}%` : '—'}
      </span>
    </div>
  )
}

interface Props {
  state:    GameState
  dispatch: React.Dispatch<GameAction>
}

export default function GameScreen({ state, dispatch }: Props) {
  const level = LEVELS.find(l => l.id === state.currentLevelId)
  if (!level) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#050508', color: '#f0f0f8', textAlign: 'center', padding: '0 24px',
      }}>
        <div>
          <p style={{ color: '#8a8a9c', marginBottom: 16 }}>That level couldn't be found.</p>
          <button
            onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
            className={`${BUTTON_BASE} ${BUTTON_VARIANTS.primary}`}
            style={PRIMARY_STYLE}
          >
            Back to levels
          </button>
        </div>
      </div>
    )
  }

  return <Play level={level} state={state} dispatch={dispatch} />
}

function Play({ level, state, dispatch }: Props & { level: Level }) {

  const editorRef    = useRef<HTMLDivElement>(null)
  const editorView   = useRef<EditorView | null>(null)
  const targetIframe = useRef<HTMLIFrameElement>(null)
  const userIframe   = useRef<HTMLIFrameElement>(null)
  const scoreTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestCSS    = useRef(state.userCSS)
  const isScoring    = useRef(false)

  const hasInput = state.userCSS.trim().length >= 10
  const diffColor = DIFFICULTY_COLORS[level.difficulty]

  // target only needs to load once
  useEffect(() => {
    if (targetIframe.current) {
      targetIframe.current.srcdoc = buildDoc(level.html, level.targetCSS)
    }
  }, [level])

  // update user preview on every css change
  useEffect(() => {
    if (userIframe.current) {
      userIframe.current.srcdoc = buildDoc(level.html, state.userCSS)
    }
  }, [state.userCSS, level.html])

  const runScore = useCallback(async (cssToScore: string) => {
    if (isScoring.current) return
    if (cssToScore.trim().length < 10) {
      dispatch({ type: 'UPDATE_SCORE', score: 0 })
      return
    }

    isScoring.current = true
    await new Promise(r => setTimeout(r, 180))

    const [tCanvas, uCanvas] = await Promise.all([
      renderToCanvas(targetIframe.current!),
      renderToCanvas(userIframe.current!),
    ])

    isScoring.current = false
    if (!tCanvas || !uCanvas) return

    const score = compareCanvases(tCanvas, uCanvas, PREVIEW_W, PREVIEW_H)
    dispatch({ type: 'UPDATE_SCORE', score })
  }, [dispatch])

  const scheduleAutoScore = useCallback((css: string) => {
    latestCSS.current = css
    if (scoreTimer.current) clearTimeout(scoreTimer.current)
    scoreTimer.current = setTimeout(() => {
      runScore(latestCSS.current)
    }, SCORE_DELAY)
  }, [runScore])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return
    if (scoreTimer.current) clearTimeout(scoreTimer.current)

    const cssToScore = latestCSS.current || state.userCSS
    if (cssToScore.trim().length < 10) return

    setIsSubmitting(true)

    // wait a tick for the iframe to reflect the very latest keystroke, then capture both frames
    await new Promise(r => setTimeout(r, 180))

    const [tCanvas, uCanvas] = await Promise.all([
      renderToCanvas(targetIframe.current!),
      renderToCanvas(userIframe.current!),
    ])

    setIsSubmitting(false)

    // if either preview failed to render, still surface a result instead of doing nothing
    const finalScore = (tCanvas && uCanvas) ? compareCanvases(tCanvas, uCanvas, PREVIEW_W, PREVIEW_H) : 0
    dispatch({ type: 'SUBMIT_RESULT', score: finalScore })
  }, [isSubmitting, state.userCSS, dispatch])

  const resetEditor = useCallback(() => {
    const view = editorView.current
    if (!view) return
    const { doc } = view.state
    if (doc.length === 0) return
    view.dispatch({ changes: { from: 0, to: doc.length, insert: '' } })
    view.focus()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
        return
      }
      if (e.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false)
          return
        }
        dispatch({ type: 'GO_LEVEL_SELECT' })
        return
      }
      if (e.key === '?') {
        const target = e.target as HTMLElement | null
        if (target?.closest('.cm-content')) return
        e.preventDefault()
        setShowShortcuts(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSubmit, dispatch, showShortcuts])

  // codemirror setup — runs once on mount
  useEffect(() => {
    if (!editorRef.current || editorView.current) return

    const view = new EditorView({
      state: EditorState.create({
        doc: state.userCSS,
        extensions: [
          history(),
          lineNumbers(),
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          css(),
          oneDark,
          EditorView.updateListener.of(update => {
            if (!update.docChanged) return
            const newCSS = update.state.doc.toString()
            dispatch({ type: 'UPDATE_CSS', css: newCSS })
            scheduleAutoScore(newCSS)
          }),
          EditorView.theme({
            '&': {
              height: '100%',
              fontSize: '13px',
              backgroundColor: '#050508',
            },
            '.cm-content': {
              fontFamily: "'JetBrains Mono', monospace",
              padding: '12px 0',
              caretColor: '#7c6af7',
            },
            '.cm-line': { padding: '0 4px' },
            '.cm-gutters': {
              backgroundColor: '#050508',
              borderRight: '1px solid #1a1a26',
              color: '#3f3f50',
            },
            '.cm-activeLineGutter': { backgroundColor: 'rgba(124,106,247,0.07)' },
            '.cm-activeLine':       { backgroundColor: 'rgba(124,106,247,0.05)' },
            '.cm-cursor':           { borderLeftColor: '#7c6af7' },
            '.cm-selectionBackground': { backgroundColor: 'rgba(124,106,247,0.22) !important' },
          }),
        ],
      }),
      parent: editorRef.current,
    })

    editorView.current = view
    view.focus()

    return () => {
      view.destroy()
      editorView.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#050508', overflow: 'hidden' }}>

      {/* top bar — literal copy of the mockup's .topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20, padding: '14px 24px',
        borderBottom: '1px solid #1a1a26', flexShrink: 0, background: '#08080c',
      }}>
        <button
          onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
          style={{
            color: '#6a6a7e', fontSize: 13, fontWeight: 500, flexShrink: 0,
            background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#a0a0b4' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#6a6a7e' }}
        >
          ← Levels
        </button>

        <div aria-hidden="true" style={{ width: 1, height: 24, background: '#1e1e2c', flexShrink: 0 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: '#f0f0f8' }}>{level.title}</h1>
          <span style={{
            fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
            padding: '3px 8px', borderRadius: 999,
            background: `${diffColor}26`, color: diffColor,
          }}>
            {level.difficulty}
          </span>
        </div>

        <div style={{
          fontSize: 13, color: '#6a6a7e', overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', flex: 1, minWidth: 40,
        }}>
          {level.description}
        </div>

        <PrecisionBar score={state.score} target={level.pointsToWin} hasInput={hasInput} />

        <div style={{ flexShrink: 0 }}>
          <Timer seconds={state.timeLeft} dispatch={dispatch} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!hasInput || isSubmitting}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 22px', fontSize: 13, fontWeight: 600, borderRadius: 999,
            background: 'linear-gradient(135deg, #7c6af7, #6355d6)', color: 'white',
            boxShadow: '0 4px 18px rgba(124,106,247,0.3)', flexShrink: 0,
            border: 'none', cursor: (!hasInput || isSubmitting) ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', opacity: (!hasInput || isSubmitting) ? 0.4 : 1,
          }}
        >
          {isSubmitting ? 'Scoring…' : 'Submit'}
          <kbd style={{ fontSize: 10, opacity: 0.7, fontFamily: 'inherit' }}>⌘⏎</kbd>
        </button>
      </div>

      {/* workspace — literal copy of the mockup's equal-thirds .workspace grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', overflow: 'hidden' }}>

        {/* col 1 — editor */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: '1px solid #1a1a26' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px', borderBottom: '1px solid #1a1a26', flexShrink: 0,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8a8a9c' }}>style.css</span>
            <button
              onClick={resetEditor}
              style={{
                fontSize: 11, color: '#52526a', background: 'transparent', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', padding: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#9a9ab0' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#52526a' }}
            >
              Reset
            </button>
          </div>
          <div ref={editorRef} style={{ flex: 1, overflow: 'hidden' }} />
        </div>

        {/* col 2 — target */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: '1px solid #1a1a26' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #1a1a26', flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8a8a9c' }}>Target</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a10' }}>
            <div style={{ transform: 'scale(0.66)', transformOrigin: 'center' }}>
              <iframe
                ref={targetIframe}
                title="Target"
                sandbox="allow-same-origin"
                scrolling="no"
                style={{ width: PREVIEW_W, height: PREVIEW_H, border: 'none', display: 'block', pointerEvents: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* col 3 — yours */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #1a1a26', flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#8a8a9c' }}>Yours</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a10' }}>
            <div style={{ transform: 'scale(0.66)', transformOrigin: 'center' }}>
              <iframe
                ref={userIframe}
                title="Yours"
                sandbox="allow-same-origin"
                scrolling="no"
                style={{ width: PREVIEW_W, height: PREVIEW_H, border: 'none', display: 'block', pointerEvents: 'none' }}
              />
            </div>
          </div>
        </div>

      </div>

      <button
        onClick={() => setShowShortcuts(true)}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts"
        className="fixed bottom-5 right-5 w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-gray-400 hover:text-white text-sm font-bold transition-colors flex items-center justify-center z-40"
      >
        ?
      </button>

      {showShortcuts && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
          onClick={() => setShowShortcuts(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#14141f] border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-white">Keyboard shortcuts</h3>
              <button
                onClick={() => setShowShortcuts(false)}
                aria-label="Close"
                className="text-gray-600 hover:text-gray-300 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <dl className="space-y-3">
              {[
                { keys: ['Ctrl/⌘', 'Enter'], desc: 'Submit your CSS' },
                { keys: ['Esc'],           desc: 'Back to level select' },
                { keys: ['?'],             desc: 'Toggle this panel' },
              ].map(({ keys, desc }) => (
                <div key={desc} className="flex items-center justify-between">
                  <dt className="text-sm text-gray-400">{desc}</dt>
                  <dd className="flex gap-1">
                    {keys.map(k => (
                      <kbd key={k} className="text-[11px] font-mono px-2 py-1 rounded-md bg-white/[0.06] border border-white/10 text-gray-300">
                        {k}
                      </kbd>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      )}

    </div>
  )
}