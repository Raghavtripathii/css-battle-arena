
import type { ReactNode, ButtonHTMLAttributes } from 'react'

export const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2.5 px-12 py-5 text-xl font-semibold rounded-full transition-colors'

export const BUTTON_VARIANTS = {
  primary:   'bg-purple-600 hover:bg-purple-500 text-white',
  secondary: 'border border-white/15 text-gray-300 hover:text-white',
} as const

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS
  children: ReactNode
}

export default function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  return (
    <button className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}