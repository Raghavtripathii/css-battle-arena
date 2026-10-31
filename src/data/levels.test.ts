import { describe, it, expect } from 'vitest'
import { LEVELS } from './levels'

describe('LEVELS data', () => {
  it('has unique, consecutive ids starting at 1', () => {
    LEVELS.forEach((l, i) => expect(l.id).toBe(i + 1))
  })

  it('has valid difficulty values', () => {
    for (const l of LEVELS) expect(['easy', 'medium', 'hard']).toContain(l.difficulty)
  })

  it('has non-empty text fields', () => {
    for (const l of LEVELS) {
      expect(l.title.trim(), `level ${l.id} title`).not.toBe('')
      expect(l.description.trim(), `level ${l.id} description`).not.toBe('')
      expect(l.html.trim(), `level ${l.id} html`).not.toBe('')
      expect(l.targetCSS.trim(), `level ${l.id} targetCSS`).not.toBe('')
    }
  })

  it('has exactly 3 non-empty hints per level', () => {
    for (const l of LEVELS) {
      expect(l.hints, `level ${l.id} hints`).toHaveLength(3)
      l.hints.forEach(h => expect(h.trim()).not.toBe(''))
    }
  })

  it('has sane pointsToWin and timeLimit', () => {
    for (const l of LEVELS) {
      expect(l.pointsToWin, `level ${l.id} pointsToWin`).toBeGreaterThanOrEqual(50)
      expect(l.pointsToWin, `level ${l.id} pointsToWin`).toBeLessThanOrEqual(100)
      expect(l.timeLimit, `level ${l.id} timeLimit`).toBeGreaterThanOrEqual(30)
      expect(l.timeLimit, `level ${l.id} timeLimit`).toBeLessThanOrEqual(600)
    }
  })

  it('has unique titles', () => {
    const titles = LEVELS.map(l => l.title)
    expect(new Set(titles).size).toBe(titles.length)
  })
})