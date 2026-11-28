// lib/daily.ts
// Daily challenge: one level per calendar day, the same for every player, picked
// deterministically from the date (no server needed). Completing it on
// consecutive days builds a streak.

import { safeGet, safeSet, safeRemove } from './storage'

const LAST_KEY   = 'daily_last_done'
const STREAK_KEY = 'daily_streak'

// strides tried in order; the first one that shares no factor with the level count
// walks through every level before repeating, and never repeats on back-to-back days
const STRIDES = [7, 11, 13, 17, 19, 23, 29, 31]

const MS_PER_DAY = 86_400_000

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

// local calendar date as YYYY-MM-DD — the daily level flips at the player's midnight
export function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function dayNumber(d: Date): number {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / MS_PER_DAY)
}

function yesterdayKey(now: Date): string {
  return dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
}

// which level is today's daily challenge
export function getDailyLevelId(levels: readonly { id: number }[], now: Date = new Date()): number {
  const n = levels.length
  if (n === 0) throw new Error('getDailyLevelId needs at least one level')
  const stride = STRIDES.find(s => gcd(s, n) === 1) ?? 1
  const index = (((dayNumber(now) * stride) % n) + n) % n
  return levels[index].id
}

export function isDailyDone(now: Date = new Date()): boolean {
  return safeGet(LAST_KEY) === dateKey(now)
}

// current streak in days — shows 0 once a day has been missed
export function getDailyStreak(now: Date = new Date()): number {
  const last = safeGet(LAST_KEY)
  if (last !== dateKey(now) && last !== yesterdayKey(now)) return 0
  const n = parseInt(safeGet(STREAK_KEY) ?? '0', 10)
  return Number.isNaN(n) ? 0 : Math.max(0, n)
}

// call after a level is passed. Returns true only when it was today's daily
// level and counted for the first time today.
export function recordDailyCompletion(
  levelId: number,
  levels: readonly { id: number }[],
  now: Date = new Date(),
): boolean {
  if (levelId !== getDailyLevelId(levels, now)) return false

  const today = dateKey(now)
  const last  = safeGet(LAST_KEY)
  if (last === today) return false

  const previous = parseInt(safeGet(STREAK_KEY) ?? '0', 10)
  const base     = Number.isNaN(previous) ? 0 : Math.max(0, previous)
  const streak   = last === yesterdayKey(now) ? base + 1 : 1

  safeSet(STREAK_KEY, String(streak))
  safeSet(LAST_KEY, today)
  return true
}

export function resetDaily(): void {
  safeRemove(LAST_KEY)
  safeRemove(STREAK_KEY)
}
