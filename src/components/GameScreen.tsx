// components/GameScreen.tsx
// main game screen — editor on the left, target + user previews on the right
// pixel comparison runs 300ms after the user stops typing

import { useEffect, useRef, useCallback, useState } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { css } from '@codemirror/lang-css'
import { oneDark } from '@codemirror/theme-one-dark'
import { motion } from 'framer-motion'

import type { GameState, GameAction, Level } from '../types'
import { buildIframeDocument, compareCanvases, SCORE_DEBOUNCE_MS } from '../hooks/usePixelScore'
import { LEVELS } from '../data/levels'

// both iframes render at this size so pixel counts always match
const PREVIEW_W = 400
const PREVIEW_H = 300

interface Props {
  state:    GameState
  dispatch: React.Dispatch<GameAction>
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
    <div className={`font-mono text-xl font-bold tabular-nums ${isLow ? 'text-red-400' : 'text-gray-300'}`}>
      {mins}:{secs.toString().padStart(2, '0')}
    </div>
  )
}

function ScoreRing({ score, target }: { score: number; target: number }) {
  const size   = 56
  const r      = 22
  const circ   = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const passed = score >= target

  const color = passed
    ? '#34d399'
    : score >= 70 ? '#fbbf24' : '#f87171'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1c1c26" strokeWidth="4" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }}
        />
      </svg>
      <div
        className="absolute text-xs font-bold font-mono"
        style={{ color }}
      >
        {score}%
      </div>
    </div>
  )
}

export default function GameScreen({ state, dispatch }: Props) {
  const level = LEVELS.find(l => l.id === state.currentLevelId) as Level

  const editorRef     = useRef<HTMLDivElement>(null)
  const editorView    = useRef<EditorView | null>(null)
  const targetIframe  = useRef<HTMLIFrameElement>(null)
  const userIframe    = useRef<HTMLIFrameElement>(null)
  const scoreTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [showHint, setShowHint]   = useState(false)
  const [diffMode, setDiffMode]   = useState(false)

  // update user iframe whenever css changes
  useEffect(() => {
    if (!userIframe.current) return
    userIframe.current.srcdoc = buildIframeDocument(level.html, state.userCSS)
  }, [state.userCSS, level.html])

  // target iframe only needs to load once
  useEffect(() => {
    if (!targetIframe.current) return
    targetIframe.current.srcdoc = buildIframeDocument(level.html, level.targetCSS)
  }, [level])

  // debounced pixel comparison
  const runScoreCheck = useCallback(() => {
    if (scoreTimer.current) clearTimeout(scoreTimer.current)
    scoreTimer.current = setTimeout(async () => {
      const tFrame = targetIframe.current
      const uFrame = userIframe.current
      if (!tFrame || !uFrame) return

      // small delay to let iframes finish rendering after srcdoc update
      await new Promise(r => setTimeout(r, 80))

      const tCanvas = document.createElement('canvas')
      const uCanvas = document.createElement('canvas')
      tCanvas.width  = PREVIEW_W
      tCanvas.height = PREVIEW_H
      uCanvas.width  = PREVIEW_W
      uCanvas.height = PREVIEW_H

      const tCtx = tCanvas.getContext('2d')
      const uCtx = uCanvas.getContext('2d')
      if (!tCtx || !uCtx) return

      try {
        const tDoc = tFrame.contentDocument
        const uDoc = uFrame.contentDocument
        if (!tDoc || !uDoc) return

        // render each iframe into a canvas via svg foreignObject
        const renderDoc = (doc: Document, ctx: CanvasRenderingContext2D) => {
          return new Promise<void>(resolve => {
            const svg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="${PREVIEW_W}" height="${PREVIEW_H}">
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
              resolve()
            }
            img.onerror = () => { URL.revokeObjectURL(url); resolve() }
            img.src = url
          })
        }

        await Promise.all([
          renderDoc(tDoc, tCtx),
          renderDoc(uDoc, uCtx),
        ])

        const score = compareCanvases(tCanvas, uCanvas)
        dispatch({ type: 'UPDATE_SCORE', score })
      } catch {
        // scoring fails silently if iframes aren't ready yet
      }
    }, SCORE_DEBOUNCE_MS)
  }, [dispatch])

  // set up codemirror
  useEffect(() => {
    if (!editorRef.current || editorView.current) return

    const startState = EditorState.create({
      doc: state.userCSS,
      extensions: [
        lineNumbers(),
        keymap.of([...defaultKeymap, indentWithTab]),
        css(),
        oneDark,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            const newCSS = update.state.doc.toString()
            dispatch({ type: 'UPDATE_CSS', css: newCSS })
            runScoreCheck()
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            backgroundColor: '#0d0d12',
            fontFamily: "'JetBrains Mono', monospace",
          },
          '.cm-content': { padding: '12px 0' },
          '.cm-gutters': { backgroundColor: '#0d0d12', borderRight: '1px solid #1c1c26' },
          '.cm-activeLineGutter': { backgroundColor: '#13131a' },
          '.cm-activeLine': { backgroundColor: 'rgba(124,106,247,0.06)' },
        }),
      ],
    })

    editorView.current = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    return () => {
      editorView.current?.destroy()
      editorView.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ctrl+enter to manually trigger score check
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        runScoreCheck()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [runScoreCheck])

  const hintsForLevel  = level.hints ?? []
  const currentHint    = hintsForLevel[state.hintsRevealed - 1]
  const hasMoreHints   = state.hintsRevealed < hintsForLevel.length

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">

      {/* top bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07] bg-[#0d0d12] flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            ← Levels
          </button>
          <div className="text-white font-semibold text-sm">{level.title}</div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            level.difficulty === 'easy'   ? 'bg-green-500/15 text-green-400' :
            level.difficulty === 'medium' ? 'bg-yellow-500/15 text-yellow-400' :
                                            'bg-red-500/15 text-red-400'
          }`}>
            {level.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <ScoreRing score={state.score} target={level.pointsToWin} />
          <Timer seconds={state.timeLeft} dispatch={dispatch} />

          {hasMoreHints && (
            <button
              onClick={() => {
                dispatch({ type: 'REVEAL_HINT' })
                setShowHint(true)
              }}
              className="text-xs px-3 py-1.5 border border-purple-500/40 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all"
            >
              Hint ({hintsForLevel.length - state.hintsRevealed} left)
            </button>
          )}

          <button
            onClick={() => setDiffMode(v => !v)}
            className={`text-xs px-3 py-1.5 border rounded-lg transition-all ${
              diffMode
                ? 'border-orange-500/60 text-orange-400 bg-orange-500/10'
                : 'border-white/10 text-gray-500 hover:text-gray-300'
            }`}
          >
            {diffMode ? 'Diff ON' : 'Diff'}
          </button>
        </div>
      </header>

      {/* hint bar */}
      {showHint && currentHint && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-purple-500/10 border-b border-purple-500/20 px-5 py-2.5 flex items-center justify-between flex-shrink-0"
        >
          <span className="text-purple-300 text-sm">💡 {currentHint}</span>
          <button onClick={() => setShowHint(false)} className="text-gray-500 hover:text-gray-300 text-xs">
            Dismiss
          </button>
        </motion.div>
      )}

      {/* level description */}
      <div className="px-5 py-2 text-xs text-gray-500 border-b border-white/[0.05] flex-shrink-0">
        {level.description}
        <span className="ml-4 text-gray-600">Pass at {level.pointsToWin}% match · Ctrl+Enter to score</span>
      </div>

      {/* 3-column layout */}
      <div className="flex flex-1 min-h-0">

        {/* col 1 — editor */}
        <div className="flex flex-col border-r border-white/[0.07]" style={{ width: '38%' }}>
          <div className="px-4 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-widest border-b border-white/[0.05] bg-[#0d0d12] flex-shrink-0">
            Your CSS
          </div>
          <div ref={editorRef} className="flex-1 overflow-hidden" />
        </div>

        {/* col 2 — target */}
        <div className="flex flex-col border-r border-white/[0.07]" style={{ width: '31%' }}>
          <div className="px-4 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-widest border-b border-white/[0.05] bg-[#0d0d12] flex-shrink-0">
            Target
          </div>
          <div className="flex-1 bg-[#111118] flex items-center justify-center overflow-hidden">
            <div style={{ width: PREVIEW_W, height: PREVIEW_H, transform: 'scale(0.7)', transformOrigin: 'center' }}>
              <iframe
                ref={targetIframe}
                title="Target preview"
                sandbox="allow-same-origin"
                scrolling="no"
                style={{ width: PREVIEW_W, height: PREVIEW_H, border: 'none', display: 'block' }}
              />
            </div>
          </div>
        </div>

        {/* col 3 — yours, with optional diff overlay */}
        <div className="flex flex-col" style={{ width: '31%' }}>
          <div className="px-4 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-widest border-b border-white/[0.05] bg-[#0d0d12] flex-shrink-0">
            Yours {diffMode && <span className="text-orange-400 ml-1">· diff mode</span>}
          </div>
          <div className="flex-1 bg-[#111118] flex items-center justify-center overflow-hidden relative">
            <div style={{ width: PREVIEW_W, height: PREVIEW_H, transform: 'scale(0.7)', transformOrigin: 'center', position: 'relative' }}>
              <iframe
                ref={userIframe}
                title="Your preview"
                sandbox="allow-same-origin"
                scrolling="no"
                style={{ width: PREVIEW_W, height: PREVIEW_H, border: 'none', display: 'block' }}
              />
              {diffMode && (
                <DiffOverlay
                  targetIframe={targetIframe}
                  userIframe={userIframe}
                  width={PREVIEW_W}
                  height={PREVIEW_H}
                  userCSS={state.userCSS}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DiffProps {
  targetIframe: React.RefObject<HTMLIFrameElement | null>
  userIframe:   React.RefObject<HTMLIFrameElement | null>
  width:        number
  height:       number
  userCSS:      string
}

// red overlay on pixels that don't match — re-runs whenever css changes
function DiffOverlay({ targetIframe, userIframe, width, height, userCSS }: DiffProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const timer = setTimeout(async () => {
      const tFrame = targetIframe.current
      const uFrame = userIframe.current
      if (!tFrame?.contentDocument || !uFrame?.contentDocument) return

      const render = (doc: Document) => new Promise<ImageData | null>(resolve => {
        const tmpCanvas = document.createElement('canvas')
        tmpCanvas.width  = width
        tmpCanvas.height = height
        const tmpCtx = tmpCanvas.getContext('2d')
        if (!tmpCtx) { resolve(null); return }

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;overflow:hidden;">
              ${doc.documentElement.outerHTML}
            </div>
          </foreignObject>
        </svg>`
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
        const url  = URL.createObjectURL(blob)
        const img  = new Image()
        img.onload = () => {
          tmpCtx.drawImage(img, 0, 0)
          URL.revokeObjectURL(url)
          resolve(tmpCtx.getImageData(0, 0, width, height))
        }
        img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
        img.src = url
      })

      const [tData, uData] = await Promise.all([
        render(tFrame.contentDocument),
        render(uFrame.contentDocument),
      ])

      if (!tData || !uData) return

      // red where pixels differ, transparent where they match
      const diffData = ctx.createImageData(width, height)
      for (let i = 0; i < tData.data.length; i += 4) {
        const rDiff = Math.abs(tData.data[i]     - uData.data[i])
        const gDiff = Math.abs(tData.data[i + 1] - uData.data[i + 1])
        const bDiff = Math.abs(tData.data[i + 2] - uData.data[i + 2])
        const wrong = rDiff > 10 || gDiff > 10 || bDiff > 10

        diffData.data[i]     = wrong ? 239 : 0
        diffData.data[i + 1] = wrong ? 68  : 0
        diffData.data[i + 2] = wrong ? 68  : 0
        diffData.data[i + 3] = wrong ? 140 : 0
      }

      ctx.clearRect(0, 0, width, height)
      ctx.putImageData(diffData, 0, 0)
    }, 400)

    return () => clearTimeout(timer)
  }, [userCSS, targetIframe, userIframe, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}