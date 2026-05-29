// types/index.ts

export interface Level {
  id:          number
  title:       string
  difficulty:  'easy' | 'medium' | 'hard'
  description: string
  html:        string
  targetCSS:   string
  hints:       string[]
  pointsToWin: number        // usually 90
  timeLimit:   number        // in seconds
}

// per-level progress — persisted to localStorage
export interface LevelProgress {
  completed:    boolean
  personalBest: number
  savedCode:    string
  hintsUsed:    number
}

export type GameScreen =
  | 'home'
  | 'levelSelect'
  | 'playing'
  | 'complete'
  | 'failed'

export interface GameState {
  screen:         GameScreen
  currentLevelId: number | null
  score:          number
  timeLeft:       number
  userCSS:        string
  hintsRevealed:  number
  isTimerRunning: boolean
}

export type GameAction =
  | { type: 'GO_HOME' }
  | { type: 'GO_LEVEL_SELECT' }
  | { type: 'START_LEVEL';    levelId: number }
  | { type: 'UPDATE_CSS';     css: string }
  | { type: 'UPDATE_SCORE';   score: number }
  | { type: 'TICK' }
  | { type: 'REVEAL_HINT' }
  | { type: 'COMPLETE_LEVEL'; finalScore: number }
  | { type: 'FAIL_LEVEL' }
  | { type: 'RETRY_LEVEL' }