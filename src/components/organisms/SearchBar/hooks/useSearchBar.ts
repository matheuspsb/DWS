import { useRef, type MouseEvent } from 'react'
import { useControllableState } from '../../../../hooks/useControllableState.ts'
import { useDebouncedCallback } from '../../../../hooks/useDebouncedCallback.ts'

interface UseSearchBarOptions {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  onSubmit?: (query: string) => void
  debounceMs?: number
}

export function useSearchBar({
  value,
  defaultValue = '',
  onChange,
  onSearch,
  onSubmit,
  debounceMs = 300,
}: UseSearchBarOptions) {
  const [query, setQuery] = useControllableState({ value, defaultValue, onChange })
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
    onSubmit?.(lastSearch.current)
  }

  const searchFor = (text: string) => {
    setQuery(text)
    submit(text)
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

  return { query, updateQuery, submit, searchFor, clear }
}
