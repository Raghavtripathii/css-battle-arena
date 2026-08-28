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

import html2canvas from 'html2canvas'

const PREVIEW_W  = 400
const PREVIEW_H  = 300
const SCORE_DELAY = 600

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
  const isLow = seconds <= 30

  return (
    <span className={`font-mono text-sm font-bold tabular-nums ${isLow ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
      {mins}:{secs.toString().padStart(2, '0')}
    </span>
  )
}

function ScoreBar({ score, target, hasInput }: { score: number; target: number; hasInput: boolean }) {
  const passed = score >= target
  const color  = passed ? '#34d399' : score >= 70 ? '#fbbf24' : '#7c6af7'

  return (
    <div className="flex-shrink-0 h-10 flex items-center px-5 border-t border-white/[0.06] bg-[#0d0d12] gap-4">
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: hasInput ? `${score}%` : '0%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <span className="font-mono text-xs font-bold w-11 text-right tabular-nums" style={{ color: hasInput ? color : '#374151' }}>
        {hasInput ? `${score}%` : '—'}
      </span>
      <span className="text-[10px] text-gray-700 shrink-0">
        pass at {target}%
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-center px-6">
        <div>
          <p className="text-gray-400 mb-4">That level couldn't be found.</p>
          <button
            onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'GO_LEVEL_SELECT' })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSubmit, dispatch])

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
              backgroundColor: '#0d0d12',
            },
            '.cm-content': {
              fontFamily: "'JetBrains Mono', monospace",
              padding: '12px 0',
              caretColor: '#7c6af7',
            },
            '.cm-line': { padding: '0 4px' },
            '.cm-gutters': {
              backgroundColor: '#0d0d12',
              borderRight: '1px solid rgba(255,255,255,0.06)',
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
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">

      <header className="flex items-center gap-4 px-5 h-14 border-b border-white/[0.06] bg-[#0d0d12] flex-shrink-0">
        <button
          onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
          className="text-gray-600 hover:text-gray-300 text-xs font-medium transition-colors shrink-0 px-2 py-1 rounded-md hover:bg-white/[0.05]"
        >
          ← Levels
        </button>

        <div className="w-px h-5 bg-white/[0.08] shrink-0" />

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="font-semibold text-sm text-white">{level.title}</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            level.difficulty === 'easy'   ? 'bg-green-500/15 text-green-400' :
            level.difficulty === 'medium' ? 'bg-yellow-500/15 text-yellow-400' :
                                            'bg-red-500/15 text-red-400'
          }`}>
            {level.difficulty}
          </span>
        </div>

        <span className="text-xs text-gray-700 truncate hidden md:block flex-1">
          {level.description}
        </span>

        <div className="flex items-center gap-2.5 ml-auto shrink-0">
          <div className="px-2.5 py-1 rounded-lg bg-white/[0.04]">
            <Timer seconds={state.timeLeft} dispatch={dispatch} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!hasInput || isSubmitting}
            className="text-[11px] font-semibold px-4 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isSubmitting ? 'Scoring…' : 'Submit ↵'}
          </button>
        </div>
      </header>

      <div className="flex border-b border-white/[0.05] bg-[#0d0d12] flex-shrink-0">
        <div className="px-4 py-1.5 text-[10px] font-bold text-gray-700 uppercase tracking-widest md:w-[42%]">
          Your CSS
        </div>
        <div className="px-4 py-1.5 text-[10px] font-bold text-gray-700 uppercase tracking-widest border-l border-white/[0.05] md:w-[29%]">
          Target
        </div>
        <div className="px-4 py-1.5 text-[10px] font-bold text-gray-700 uppercase tracking-widest border-l border-white/[0.05] md:w-[29%]">
          Yours
        </div>
      </div>

      {/* 3 columns — stacked on mobile, side by side on desktop */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">

        {/* col 1 — editor */}
        <div className="border-r border-white/[0.06] md:w-[42%] h-1/3 md:h-auto">
          <div ref={editorRef} className="h-full overflow-hidden" />
        </div>

        {/* col 2 — target */}
        <div className="border-r border-white/[0.06] md:w-[29%] h-1/3 md:h-auto bg-[#0d0d12] flex items-center justify-center">
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

        {/* col 3 — yours */}
        <div className="md:w-[29%] h-1/3 md:h-auto bg-[#0d0d12] flex items-center justify-center">
          <div className="relative" style={{ transform: 'scale(0.66)', transformOrigin: 'center' }}>
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

      <ScoreBar score={state.score} target={level.pointsToWin} hasInput={hasInput} />

    </div>
  )
}