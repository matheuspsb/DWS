import type { ComponentProps, ReactNode } from 'react'
import { classNames } from '../../../utils/classNames.ts'
import './Button.scss'

interface ButtonProps extends Omit<ComponentProps<'button'>, 'className'> {
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
  compactOnMobile?: boolean
  startIcon?: ReactNode
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  compactOnMobile = false,
  startIcon,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        'button',
        `button--${variant}`,
        fullWidth && 'button--full-width',
        compactOnMobile && 'button--compact-on-mobile',
      )}
      {...rest}
    >
      {startIcon}
      {children}
    </button>
  )
}
