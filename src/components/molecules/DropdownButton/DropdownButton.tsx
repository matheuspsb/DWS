import type { Ref } from 'react'
import { classNames } from '../../../utils/classNames.ts'
import Icon from '../../atoms/Icon/Icon.tsx'
import './DropdownButton.scss'

interface DropdownButtonProps {
  label: string
  selectedLabels?: string[]
  isOpen?: boolean
  panelId?: string
  onToggle: () => void
  onClear?: () => void
  ref?: Ref<HTMLButtonElement>
}

export default function DropdownButton({
  label,
  selectedLabels = [],
  isOpen = false,
  panelId,
  onToggle,
  onClear,
  ref,
}: DropdownButtonProps) {
  const hasSelection = selectedLabels.length > 0
  const selectedText = selectedLabels.join(', ')

  return (
    <div
      className={classNames(
        'dropdown-button',
        isOpen && 'dropdown-button--open',
        hasSelection && 'dropdown-button--selected',
      )}
    >
      <button
        ref={ref}
        type="button"
        className="dropdown-button__toggle"
        aria-label={hasSelection ? `${label}: ${selectedText}` : undefined}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={onToggle}
      >
        <span className="dropdown-button__label">{hasSelection ? selectedText : label}</span>
        {!hasSelection && <Icon name="chevron-down" />}
      </button>
      {hasSelection && (
        <button
          type="button"
          className="dropdown-button__clear"
          aria-label={`Clear ${label} filter`}
          onClick={onClear}
        >
          <Icon name="close" />
        </button>
      )}
    </div>
  )
}
