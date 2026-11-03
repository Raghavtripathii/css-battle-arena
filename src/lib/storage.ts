export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // best-effort only — progress just won't persist this session
  }
}

export function isLevelCompleted(levelId: number): boolean {
  return safeGet(`completed_${levelId}`) === 'true'
}

export function getPersonalBest(levelId: number): number {
  const n = parseInt(safeGet(`personal_best_${levelId}`) ?? '0', 10)
  return Number.isNaN(n) ? 0 : n
}