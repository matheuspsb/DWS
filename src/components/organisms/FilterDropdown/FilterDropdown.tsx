import { useCallback, useId, useRef, useState, type FocusEvent } from 'react'
import { useControllableState } from '../../../hooks/useControllableState.ts'
import { useDismiss, type DismissReason } from '../../../hooks/useDismiss.ts'
import { toggleItem } from '../../../utils/toggleItem.ts'
import DropdownButton from '../../molecules/DropdownButton/DropdownButton.tsx'
import FilterOption from '../../molecules/FilterOption/FilterOption.tsx'
import './FilterDropdown.scss'

export interface FilterOptionItem {
  id: string
  label: string
}

interface FilterDropdownProps {
  label: string
  options: FilterOptionItem[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
}

export default function FilterDropdown({
  label,
  options,
  value,
  defaultValue = [],
  onChange,
}: FilterDropdownProps) {
  const [selectedIds, setSelectedIds] = useControllableState({ value, defaultValue, onChange })
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  const handleDismiss = useCallback((reason: DismissReason) => {
    setIsOpen(false)
    if (reason === 'escape') toggleRef.current?.focus()
  }, [])
  useDismiss(rootRef, isOpen, handleDismiss)

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocus = event.relatedTarget
    if (nextFocus instanceof Node && !event.currentTarget.contains(nextFocus)) setIsOpen(false)
  }

  const toggleOption = (id: string) => {
    setSelectedIds(toggleItem(selectedIds, id))
  }

  const clearSelection = () => {
    setSelectedIds([])
    setIsOpen(false)
    toggleRef.current?.focus()
  }

  const selectedLabels = options
    .filter((option) => selectedIds.includes(option.id))
    .map((option) => option.label)

  return (
    <div ref={rootRef} className="filter-dropdown" onBlur={handleBlur}>
      <DropdownButton
        ref={toggleRef}
        label={label}
        selectedLabels={selectedLabels}
        isOpen={isOpen}
        panelId={panelId}
        onToggle={() => setIsOpen((open) => !open)}
        onClear={clearSelection}
      />
      {isOpen && (
        <div id={panelId} role="group" aria-label={label} className="filter-dropdown__panel">
          <ul className="filter-dropdown__list">
            {options.map((option) => (
              <li key={option.id}>
                <FilterOption
                  label={option.label}
                  checked={selectedIds.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
