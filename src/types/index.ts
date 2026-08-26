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
  isTimerRunning: boolean
}

export type GameAction =
  | { type: 'GO_HOME' }
  | { type: 'GO_LEVEL_SELECT' }
  | { type: 'START_LEVEL';    levelId: number }
  | { type: 'UPDATE_CSS';     css: string }
  | { type: 'UPDATE_SCORE';   score: number }
  | { type: 'SUBMIT_RESULT';  score: number }
  | { type: 'TICK' }
  | { type: 'RETRY_LEVEL' }