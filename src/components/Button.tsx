import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { BUTTON_BASE, BUTTON_VARIANTS, PRIMARY_STYLE, SECONDARY_STYLE } from './buttonStyles'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS
  children: ReactNode
}

export default function Button({ variant = 'primary', children, className = '', style, ...rest }: Props) {
  const variantStyle = variant === 'primary' ? PRIMARY_STYLE : SECONDARY_STYLE
  return (
    <button
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`}
      style={{ ...variantStyle, ...style }}
      {...rest}
    >
      {children}
    </button>
  )
}