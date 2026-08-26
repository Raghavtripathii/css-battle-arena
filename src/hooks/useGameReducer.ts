
import { useReducer } from 'react'
import type { GameState, GameAction } from '../types'
import { LEVELS } from '../data/levels'

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // best-effort only — progress just won't persist this session
  }
}

const initialState: GameState = {
  screen:         'home',
  currentLevelId: null,
  score:          0,
  timeLeft:       0,
  userCSS:        '',
  isTimerRunning: false,
}

// pure function — never mutates state directly
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'GO_HOME':
      return { ...initialState }

    case 'GO_LEVEL_SELECT':
      return { ...state, screen: 'levelSelect', currentLevelId: null }

    case 'START_LEVEL': {
      const level = LEVELS.find(l => l.id === action.levelId)
      if (!level) return state

      // restore editor content if they were here before
      const saved = safeGet(`level_code_${action.levelId}`) ?? ''

      return {
        ...state,
        screen:         'playing',
        currentLevelId: action.levelId,
        score:          0,
        timeLeft:       level.timeLimit,
        userCSS:        saved,
        isTimerRunning: true,
      }
    }

    case 'UPDATE_CSS':
      // autosave on every change
      if (state.currentLevelId !== null) {
        safeSet(`level_code_${state.currentLevelId}`, action.css)
      }
      return { ...state, userCSS: action.css }
    case 'UPDATE_SCORE':
      return { ...state, score: action.score }

    case 'SUBMIT_RESULT': {
      const level = LEVELS.find(l => l.id === state.currentLevelId)
      if (!level) return { ...state, score: action.score }

      const passed = action.score >= level.pointsToWin

      if (passed) {
        const key = `personal_best_${state.currentLevelId}`
        const existing = parseInt(safeGet(key) ?? '0', 10)
        if (action.score > existing) {
          safeSet(key, String(action.score))
        }
        safeSet(`completed_${state.currentLevelId}`, 'true')
      }

      return {
        ...state,
        score:          action.score,
        screen:         passed ? 'complete' : 'failed',
        isTimerRunning: false,
      }
    }

    case 'TICK': {
      if (!state.isTimerRunning) return state
      if (state.timeLeft <= 1) {
        return { ...state, timeLeft: 0, screen: 'failed', isTimerRunning: false }
      }
      return { ...state, timeLeft: state.timeLeft - 1 }
    }

    case 'RETRY_LEVEL': {
      const level = LEVELS.find(l => l.id === state.currentLevelId)
      if (!level) return state
      // keep their css so they don't lose progress on retry
      const saved = safeGet(`level_code_${state.currentLevelId}`) ?? ''
      return {
        ...state,
        screen:         'playing',
        score:          0,
        timeLeft:       level.timeLimit,
        userCSS:        saved,
        isTimerRunning: true,
      }
    }

    default:
      return state
  }
}

export function useGameReducer() {
  return useReducer(gameReducer, initialState)
}