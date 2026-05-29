// hooks/useGameReducer.ts
// all game state lives here — useReducer keeps it predictable

import { useReducer } from 'react'
import type { GameState, GameAction } from '../types'
import { LEVELS } from '../data/levels'

const initialState: GameState = {
  screen:         'home',
  currentLevelId: null,
  score:          0,
  timeLeft:       0,
  userCSS:        '',
  hintsRevealed:  0,
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
      const saved = localStorage.getItem(`level_code_${action.levelId}`) ?? ''

      return {
        ...state,
        screen:         'playing',
        currentLevelId: action.levelId,
        score:          0,
        timeLeft:       level.timeLimit,
        userCSS:        saved,
        hintsRevealed:  0,
        isTimerRunning: true,
      }
    }

    case 'UPDATE_CSS':
      // autosave on every change
      if (state.currentLevelId !== null) {
        localStorage.setItem(`level_code_${state.currentLevelId}`, action.css)
      }
      return { ...state, userCSS: action.css }

    case 'UPDATE_SCORE': {
      const level = LEVELS.find(l => l.id === state.currentLevelId)
      if (!level) return { ...state, score: action.score }

      if (action.score >= level.pointsToWin) {
        // update personal best
        const key = `personal_best_${state.currentLevelId}`
        const existing = parseInt(localStorage.getItem(key) ?? '0', 10)
        if (action.score > existing) {
          localStorage.setItem(key, String(action.score))
        }
        localStorage.setItem(`completed_${state.currentLevelId}`, 'true')

        return {
          ...state,
          score:          action.score,
          screen:         'complete',
          isTimerRunning: false,
        }
      }

      return { ...state, score: action.score }
    }

    case 'TICK': {
      if (!state.isTimerRunning) return state
      if (state.timeLeft <= 1) {
        return { ...state, timeLeft: 0, screen: 'failed', isTimerRunning: false }
      }
      return { ...state, timeLeft: state.timeLeft - 1 }
    }

    case 'REVEAL_HINT':
      return { ...state, hintsRevealed: state.hintsRevealed + 1 }

    case 'COMPLETE_LEVEL':
      return {
        ...state,
        screen:         'complete',
        isTimerRunning: false,
        score:          action.finalScore,
      }

    case 'FAIL_LEVEL':
      return { ...state, screen: 'failed', isTimerRunning: false }

    case 'RETRY_LEVEL': {
      const level = LEVELS.find(l => l.id === state.currentLevelId)
      if (!level) return state
      // keep their css so they don't lose progress on retry
      const saved = localStorage.getItem(`level_code_${state.currentLevelId}`) ?? ''
      return {
        ...state,
        screen:         'playing',
        score:          0,
        timeLeft:       level.timeLimit,
        userCSS:        saved,
        hintsRevealed:  0,
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