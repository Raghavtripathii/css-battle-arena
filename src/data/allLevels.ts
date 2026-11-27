import type { Level } from '../types'
import { LEVELS as CORE_LEVELS } from './levels'
import { EXPERT_LEVELS } from './expertLevels'

// Single source of truth for the whole game: the 41 core levels followed by
// the Expert pack. Everything in the app imports LEVELS from here.
export const LEVELS: Level[] = [...CORE_LEVELS, ...EXPERT_LEVELS]
