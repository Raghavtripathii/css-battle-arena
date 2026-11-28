// lib/share.ts
// "Share my score": opens the native share sheet on phones, and copies the
// text to the clipboard everywhere else.

export interface ShareInfo {
  levelId: number
  title:   string
  score:   number
  daily?:  boolean
}

export function buildShareText({ levelId, title, score, daily = false }: ShareInfo): string {
  const lead = daily ? 'Daily Challenge' : `Level ${levelId}`
  const perfect = score === 100 ? ' — pixel-perfect!' : ''
  return `⚔️ I matched ${score}% on ${lead}: ${title} in CSS Battle Arena${perfect}\nThink you can beat it?`
}

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed'

// phones get the native sheet; desktops get a plain copy (the desktop share
// dialog on some browsers is more confusing than helpful)
function prefersNativeShare(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(pointer: coarse)').matches
}

export async function shareResult(text: string, url: string): Promise<ShareOutcome> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function' && prefersNativeShare()) {
    try {
      await navigator.share({ text, url })
      return 'shared'
    } catch (err) {
      // closing the share sheet isn't an error — don't fall through to copying
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      // any other failure: try the clipboard below
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`)
    return 'copied'
  } catch {
    return 'failed'
  }
}
