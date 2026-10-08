import type { ComponentProps } from 'react'
import { classNames } from '../../../utils/classNames.ts'
import './IconButton.scss'

interface IconButtonProps extends Omit<ComponentProps<'button'>, 'className' | 'aria-label'> {
  label: string
  variant?: 'solid' | 'plain'
  subtle?: boolean
}

export default function IconButton({
  label,
  variant = 'solid',
  subtle = false,
  type = 'button',
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={classNames(
        'icon-button',
        `icon-button--${variant}`,
        subtle && 'icon-button--subtle',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
