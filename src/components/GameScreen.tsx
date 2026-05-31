// components/GameScreen.tsx

import { useEffect, useRef, useState, useCallback } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { defaultKeymap, indentWithTab, historyKeymap, history } from '@codemirror/commands'
import { css } from '@codemirror/lang-css'
import { oneDark } from '@codemirror/theme-one-dark'
import { motion } from 'framer-motion'

import type { GameState, GameAction, Level } from '../types'
import { LEVELS } from '../data/levels'

const PREVIEW_W  = 400
const PREVIEW_H  = 300
const SCORE_DELAY = 600

function buildDoc(html: string, userCSS: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
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
  if (!doc) return null

  const canvas  = document.createElement('canvas')
  canvas.width  = PREVIEW_W
  canvas.height = PREVIEW_H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  return new Promise(resolve => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PREVIEW_W}" height="${PREVIEW_H}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml"
             style="width:${PREVIEW_W}px;height:${PREVIEW_H}px;overflow:hidden;">
          ${doc.documentElement.outerHTML}
        </div>
      </foreignObject>
    </svg>`

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const img  = new Image()

    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)

      // if canvas is completely blank the render failed — return null
      // so we don't report a false 100% match on two empty canvases
      const data = ctx.getImageData(0, 0, PREVIEW_W, PREVIEW_H).data
      let sum = 0
      for (let i = 0; i < data.length; i += 4) sum += data[i] + data[i+1] + data[i+2]
      resolve(sum === 0 ? null : canvas)
    }

    img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
    img.src = url
  })
}

function compareCanvases(a: HTMLCanvasElement, b: HTMLCanvasElement): number {
  const ac = a.getContext('2d')
  const bc = b.getContext('2d')
  if (!ac || !bc) return 0

  const ad = ac.getImageData(0, 0, PREVIEW_W, PREVIEW_H).data
  const bd = bc.getImageData(0, 0, PREVIEW_W, PREVIEW_H).data

  const total = PREVIEW_W * PREVIEW_H
  let matched = 0

  for (let i = 0; i < ad.length; i += 4) {
    if (
      Math.abs(ad[i]   - bd[i])   <= 10 &&
      Math.abs(ad[i+1] - bd[i+1]) <= 10 &&
      Math.abs(ad[i+2] - bd[i+2]) <= 10
    ) matched++
  }

  return Math.round((matched / total) * 100)
}

function Timer({ seconds, dispatch }: { seconds: number; dispatch: React.Dispatch<GameAction> }) {
  useEffect(() => {
    if (seconds <= 0) return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [seconds, dispatch])

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
    <div className="flex-shrink-0 h-9 flex items-center px-5 border-t border-white/[0.06] bg-[#0d0d12] gap-4">
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: hasInput ? `${score}%` : '0%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <span className="font-mono text-xs font-bold w-10 text-right" style={{ color: hasInput ? color : '#374151' }}>
        {hasInput ? `${score}%` : '—'}
      </span>
      <span className="text-[10px] text-gray-700">
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
  const level = LEVELS.find(l => l.id === state.currentLevelId) as Level

  const editorRef    = useRef<HTMLDivElement>(null)
  const editorView   = useRef<EditorView | null>(null)
  const targetIframe = useRef<HTMLIFrameElement>(null)
  const userIframe   = useRef<HTMLIFrameElement>(null)
  const scoreTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestCSS    = useRef(state.userCSS)
  const isScoring    = useRef(false)

  const [showHint, setShowHint]   = useState(false)
  const [diffMode, setDiffMode]   = useState(false)
  const diffCanvas                = useRef<HTMLCanvasElement>(null)

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

    const score = compareCanvases(tCanvas, uCanvas)
    dispatch({ type: 'UPDATE_SCORE', score })

    if (diffMode && diffCanvas.current) {
      const tCtx = tCanvas.getContext('2d')!
      const uCtx = uCanvas.getContext('2d')!
      const oCtx = diffCanvas.current.getContext('2d')!
      const td   = tCtx.getImageData(0, 0, PREVIEW_W, PREVIEW_H)
      const ud   = uCtx.getImageData(0, 0, PREVIEW_W, PREVIEW_H)
      const diff = oCtx.createImageData(PREVIEW_W, PREVIEW_H)

      for (let i = 0; i < td.data.length; i += 4) {
        const wrong =
          Math.abs(td.data[i]   - ud.data[i])   > 10 ||
          Math.abs(td.data[i+1] - ud.data[i+1]) > 10 ||
          Math.abs(td.data[i+2] - ud.data[i+2]) > 10
        diff.data[i]   = wrong ? 239 : 0
        diff.data[i+1] = wrong ? 68  : 0
        diff.data[i+2] = wrong ? 68  : 0
        diff.data[i+3] = wrong ? 160 : 0
      }

      oCtx.clearRect(0, 0, PREVIEW_W, PREVIEW_H)
      oCtx.putImageData(diff, 0, 0)
    }
  }, [dispatch, diffMode])

  const scheduleAutoScore = useCallback((css: string) => {
    latestCSS.current = css
    if (scoreTimer.current) clearTimeout(scoreTimer.current)
    scoreTimer.current = setTimeout(() => {
      runScore(latestCSS.current)
    }, SCORE_DELAY)
  }, [runScore])

  function handleSubmit() {
    if (scoreTimer.current) clearTimeout(scoreTimer.current)
    runScore(latestCSS.current || state.userCSS)
  }

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

  const hints        = level.hints ?? []
  const currentHint  = hints[state.hintsRevealed - 1]
  const hasMoreHints = state.hintsRevealed < hints.length

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">

      <header className="flex items-center gap-3 px-4 h-11 border-b border-white/[0.06] bg-[#0d0d12] flex-shrink-0">
        <button
          onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
          className="text-gray-600 hover:text-gray-400 text-xs transition-colors shrink-0"
        >
          ← Levels
        </button>

        <div className="font-semibold text-sm text-white shrink-0">{level.title}</div>

        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
          level.difficulty === 'easy'   ? 'bg-green-500/15 text-green-400' :
          level.difficulty === 'medium' ? 'bg-yellow-500/15 text-yellow-400' :
                                          'bg-red-500/15 text-red-400'
        }`}>
          {level.difficulty}
        </span>

        <span className="text-xs text-gray-700 truncate hidden md:block flex-1">
          {level.description}
        </span>

        <div className="flex items-center gap-3 ml-auto shrink-0">
          <Timer seconds={state.timeLeft} dispatch={dispatch} />

          {hasMoreHints && (
            <button
              onClick={() => { dispatch({ type: 'REVEAL_HINT' }); setShowHint(true) }}
              className="text-[11px] px-2.5 py-1 border border-purple-500/25 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all"
            >
              hint ({hints.length - state.hintsRevealed})
            </button>
          )}

          <button
            onClick={() => setDiffMode(v => !v)}
            className={`text-[11px] px-2.5 py-1 border rounded-lg transition-all ${
              diffMode
                ? 'border-orange-400/40 text-orange-400 bg-orange-500/10'
                : 'border-white/10 text-gray-600 hover:text-gray-400'
            }`}
          >
            diff
          </button>

          <button
            onClick={handleSubmit}
            disabled={!hasInput}
            className="text-[11px] px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Submit ↵
          </button>
        </div>
      </header>

      {showHint && currentHint && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="flex items-center justify-between px-4 py-2 bg-purple-500/10 border-b border-purple-500/20 flex-shrink-0"
        >
          <span className="text-purple-300 text-xs">💡 {currentHint}</span>
          <button onClick={() => setShowHint(false)} className="text-gray-600 hover:text-gray-400 text-xs ml-4">✕</button>
        </motion.div>
      )}

      <div className="flex border-b border-white/[0.05] bg-[#0d0d12] flex-shrink-0">
        <div className="px-4 py-1.5 text-[10px] font-bold text-gray-700 uppercase tracking-widest md:w-[42%]">
          Your CSS
        </div>
        <div className="px-4 py-1.5 text-[10px] font-bold text-gray-700 uppercase tracking-widest border-l border-white/[0.05] md:w-[29%]">
          Target
        </div>
        <div
          className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border-l border-white/[0.05] md:w-[29%]"
          style={{ color: diffMode ? '#f97316' : '#374151' }}
        >
          {diffMode ? 'Yours (diff on)' : 'Yours'}
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
            {diffMode && (
              <canvas
                ref={diffCanvas}
                width={PREVIEW_W}
                height={PREVIEW_H}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
              />
            )}
          </div>
        </div>

      </div>

      <ScoreBar score={state.score} target={level.pointsToWin} hasInput={hasInput} />

    </div>
  )
}