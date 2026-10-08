import type { ReactNode, SubmitEvent } from 'react'
import { useControllableState } from '../../../hooks/useControllableState.ts'
import { classNames } from '../../../utils/classNames.ts'
import './SearchField.scss'

interface SearchFieldProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  label?: string
  placeholder?: string
  size?: 'regular' | 'compact'
  startAdornment?: ReactNode
  endAdornment?: ReactNode
}

export default function SearchField({
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  label = 'Search',
  placeholder = 'Search',
  size = 'regular',
  startAdornment,
  endAdornment,
}: SearchFieldProps) {
  const [query, setQuery] = useControllableState({ value, defaultValue, onChange })

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit?.(query)
  }

  return (
    <form
      role="search"
      className={classNames('search-field', `search-field--${size}`)}
      onSubmit={handleSubmit}
    >
      {startAdornment}
      <input
        type="search"
        className="search-field__input"
        aria-label={label}
        placeholder={placeholder}
        enterKeyHint="search"
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {endAdornment}
    </form>
  )
}
