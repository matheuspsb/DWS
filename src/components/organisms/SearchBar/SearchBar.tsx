import { useModalDialog } from '../../../hooks/useModalDialog.ts'
import Icon from '../../atoms/Icon/Icon.tsx'
import IconButton from '../../atoms/IconButton/IconButton.tsx'
import SearchField from '../../molecules/SearchField/SearchField.tsx'
import { useSearchBar } from './hooks/useSearchBar.ts'
import './SearchBar.scss'

interface SearchBarProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  onSubmit?: (query: string) => void
  suggestions?: string[]
  suggestionsLabel?: string
  debounceMs?: number
}

export default function SearchBar({
  value,
  defaultValue,
  onChange,
  onSearch,
  onSubmit,
  suggestions = [],
  suggestionsLabel = 'Suggestions',
  debounceMs,
}: SearchBarProps) {
  const { query, updateQuery, submit, searchFor, clear, commit } = useSearchBar({
    value,
    defaultValue,
    onChange,
    onSearch,
    onSubmit,
    debounceMs,
  })
  const sheet = useModalDialog({ initialFocus: 'input', onClose: commit })

  const submitAndClose = (text: string) => {
    submit(text)
    sheet.close()
  }

  const pickSuggestion = (text: string) => {
    searchFor(text)
    sheet.close()
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
        <IconButton label="Open search" onClick={sheet.open}>
          <Icon name="search" />
        </IconButton>
      </div>

      {sheet.isOpen && (
        <dialog {...sheet.dialogProps} className="search-bar__sheet" aria-label="Search">
          <div className="search-bar__sheet-header">
            <SearchField
              size="compact"
              value={query}
              onChange={updateQuery}
              onSubmit={submitAndClose}
              startAdornment={
                <IconButton label="Close search" variant="plain" onClick={sheet.close}>
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
          <ul className="search-bar__suggestions" aria-label={suggestionsLabel}>
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  className="search-bar__suggestion"
                  onClick={() => pickSuggestion(suggestion)}
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
