import { useRef, useState, type MouseEvent } from 'react'
import { useControllableState } from '../../../hooks/useControllableState.ts'
import { useDebouncedCallback } from '../../../hooks/useDebouncedCallback.ts'
import Icon from '../../atoms/Icon/Icon.tsx'
import IconButton from '../../atoms/IconButton/IconButton.tsx'
import SearchField from '../../molecules/SearchField/SearchField.tsx'
import './SearchBar.scss'

interface SearchBarProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  suggestions?: string[]
  debounceMs?: number
}

export default function SearchBar({
  value,
  defaultValue = '',
  onChange,
  onSearch,
  suggestions = [],
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useControllableState({ value, defaultValue, onChange })
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const sheetRef = useRef<HTMLDialogElement | null>(null)

  const closeSheet = () => sheetRef.current?.close()

  const lastSearch = useRef(query.trim())

  const search = (text: string) => {
    lastSearch.current = text.trim()
    onSearch?.(lastSearch.current)
  }

  const searchIfChanged = (text: string) => {
    if (text.trim() !== lastSearch.current) search(text)
  }

  const { debounced: searchLater, cancel: cancelSearch } = useDebouncedCallback(
    searchIfChanged,
    debounceMs,
  )

  const searchNow = (text: string) => {
    cancelSearch()
    searchIfChanged(text)
  }

  const submit = (text: string) => {
    cancelSearch()
    search(text)
    closeSheet()
  }

  const updateQuery = (text: string) => {
    setQuery(text)
    if (text.trim() === '') searchNow(text)
    else searchLater(text)
  }

  const clear = (event: MouseEvent<HTMLButtonElement>) => {
    setQuery('')
    searchNow('')
    event.currentTarget.form?.querySelector('input')?.focus()
  }

  const attachSheet = (dialog: HTMLDialogElement | null) => {
    sheetRef.current = dialog
    if (!dialog || dialog.open) return
    dialog.showModal()
    dialog.querySelector('input')?.focus()
  }

  return (
    <div className="search-bar">
      <div className="search-bar__inline">
        <SearchField
          value={query}
          onChange={updateQuery}
          onSubmit={submit}
          endAdornment={
            <IconButton label="Search" type="submit">
              <Icon name="search" />
            </IconButton>
          }
        />
      </div>

      <div className="search-bar__open">
        <IconButton label="Open search" onClick={() => setIsSheetOpen(true)}>
          <Icon name="search" />
        </IconButton>
      </div>

      {isSheetOpen && (
        <dialog
          ref={attachSheet}
          className="search-bar__sheet"
          aria-label="Search"
          onClose={() => setIsSheetOpen(false)}
        >
          <div className="search-bar__sheet-header">
            <SearchField
              size="compact"
              value={query}
              onChange={updateQuery}
              onSubmit={submit}
              startAdornment={
                <IconButton label="Close search" variant="plain" onClick={closeSheet}>
                  <Icon name="arrow-left" />
                </IconButton>
              }
              endAdornment={
                <IconButton label="Clear search" variant="plain" subtle onClick={clear}>
                  <Icon name="close" />
                </IconButton>
              }
            />
          </div>
          <ul className="search-bar__suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={`${suggestion}-${index}`}>
                <button
                  type="button"
                  className="search-bar__suggestion"
                  onClick={() => {
                    setQuery(suggestion)
                    submit(suggestion)
                  }}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </dialog>
      )}
    </div>
  )
}
