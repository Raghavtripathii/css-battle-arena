
import type { CSSProperties } from 'react'

export const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2.5 px-10 py-4 font-semibold rounded-full transition-all'

const BUTTON_TEXT_STYLE: CSSProperties = { fontSize: 17 }

export const BUTTON_VARIANTS = {
  primary:   'text-white hover:brightness-110',
  secondary: 'border border-white/15 text-gray-300 hover:text-white',
} as const

export const PRIMARY_STYLE: CSSProperties = {
  background: 'linear-gradient(135deg, #7c6af7, #6355d6)',
  boxShadow: '0 8px 30px rgba(124,106,247,0.35)',
  ...BUTTON_TEXT_STYLE,
}

export const SECONDARY_STYLE: CSSProperties = { ...BUTTON_TEXT_STYLE }