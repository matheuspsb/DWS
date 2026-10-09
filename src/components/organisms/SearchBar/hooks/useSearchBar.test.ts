import { act, renderHook } from '@testing-library/react'
import type { MouseEvent } from 'react'
import { useSearchBar } from './useSearchBar.ts'

const clickEvent = (form: HTMLFormElement | null = null) =>
  ({ currentTarget: { form } }) as unknown as MouseEvent<HTMLButtonElement>

describe('useSearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('query', () => {
    it('starts empty, or with the default value', () => {
      expect(renderHook(() => useSearchBar({})).result.current.query).toBe('')
      expect(renderHook(() => useSearchBar({ defaultValue: 'react' })).result.current.query).toBe(
        'react',
      )
    })

    it('updates as the user types and reports it', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onChange }))

      act(() => result.current.updateQuery('rea'))

      expect(result.current.query).toBe('rea')
      expect(onChange).toHaveBeenCalledWith('rea')
    })

    it('shows what the parent says when controlled', () => {
      const { result } = renderHook(() => useSearchBar({ value: 'fixed' }))

      act(() => result.current.updateQuery('other'))

      expect(result.current.query).toBe('fixed')
    })
  })

  describe('searching while typing', () => {
    it('waits for a pause before searching', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSearch }))

      act(() => result.current.updateQuery('react'))
      act(() => vi.advanceTimersByTime(299))
      expect(onSearch).not.toHaveBeenCalled()

      act(() => vi.advanceTimersByTime(1))
      expect(onSearch).toHaveBeenCalledTimes(1)
      expect(onSearch).toHaveBeenCalledWith('react')
    })

    it('restarts the wait on every keystroke', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSearch }))

      act(() => result.current.updateQuery('r'))
      act(() => vi.advanceTimersByTime(200))
      act(() => result.current.updateQuery('re'))
      act(() => vi.advanceTimersByTime(299))
      expect(onSearch).not.toHaveBeenCalled()

      act(() => vi.advanceTimersByTime(1))
      expect(onSearch).toHaveBeenCalledWith('re')
    })

    it('uses the given delay', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSearch, debounceMs: 500 }))

      act(() => result.current.updateQuery('react'))
      act(() => vi.advanceTimersByTime(499))
      expect(onSearch).not.toHaveBeenCalled()

      act(() => vi.advanceTimersByTime(1))
      expect(onSearch).toHaveBeenCalledTimes(1)
    })

    it('searches the text without the spaces around it', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSearch }))

      act(() => result.current.updateQuery('  react  '))
      act(() => vi.advanceTimersByTime(300))

      expect(onSearch).toHaveBeenCalledWith('react')
    })

    it('does not repeat a search for text that was already searched', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSearch }))

      act(() => result.current.updateQuery('ab'))
      act(() => vi.advanceTimersByTime(300))
      act(() => result.current.updateQuery('abc'))
      act(() => result.current.updateQuery('ab'))
      act(() => vi.advanceTimersByTime(300))

      expect(onSearch).toHaveBeenCalledTimes(1)
    })

    it('treats the initial value as already searched', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ defaultValue: 'react', onSearch }))

      act(() => result.current.updateQuery('react '))
      act(() => vi.advanceTimersByTime(1000))

      expect(onSearch).not.toHaveBeenCalled()
    })

    it('stops waiting when the component unmounts', () => {
      const onSearch = vi.fn()
      const { result, unmount } = renderHook(() => useSearchBar({ onSearch }))

      act(() => result.current.updateQuery('react'))
      unmount()
      act(() => vi.advanceTimersByTime(1000))

      expect(onSearch).not.toHaveBeenCalled()
    })
  })

  describe('searching right away', () => {
    it('submits immediately and drops the pending search', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSearch }))

      act(() => result.current.updateQuery('react'))
      act(() => result.current.submit('react'))
      expect(onSearch).toHaveBeenCalledTimes(1)

      act(() => vi.advanceTimersByTime(1000))
      expect(onSearch).toHaveBeenCalledTimes(1)
    })

    it('submits even when the text was already searched', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ defaultValue: 'react', onSearch }))

      act(() => result.current.submit('react'))

      expect(onSearch).toHaveBeenCalledWith('react')
    })

    it('searches for the empty text as soon as the field is emptied', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ defaultValue: 'react', onSearch }))

      act(() => result.current.updateQuery(''))

      expect(onSearch).toHaveBeenCalledTimes(1)
      expect(onSearch).toHaveBeenCalledWith('')
    })

    it('sets the text and searches for it, like picking a suggestion', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSearch }))

      act(() => result.current.searchFor('Design'))

      expect(result.current.query).toBe('Design')
      expect(onSearch).toHaveBeenCalledWith('Design')
    })
  })

  describe('reporting submitted searches', () => {
    it('reports what was submitted, without the spaces around it', () => {
      const onSubmit = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSubmit }))

      act(() => result.current.submit('  react '))

      expect(onSubmit).toHaveBeenCalledWith('react')
    })

    it('reports a picked suggestion', () => {
      const onSubmit = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSubmit }))

      act(() => result.current.searchFor('Design'))

      expect(onSubmit).toHaveBeenCalledWith('Design')
    })

    it('does not report what was only typed', () => {
      const onSubmit = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSubmit }))

      act(() => result.current.updateQuery('react'))
      act(() => vi.advanceTimersByTime(1000))

      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  describe('clearing', () => {
    it('empties the field and searches for the empty text', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ defaultValue: 'react', onSearch }))

      act(() => result.current.clear(clickEvent()))

      expect(result.current.query).toBe('')
      expect(onSearch).toHaveBeenCalledWith('')
    })

    it('does not search when there was nothing to clear', () => {
      const onSearch = vi.fn()
      const { result } = renderHook(() => useSearchBar({ onSearch }))

      act(() => result.current.clear(clickEvent()))

      expect(onSearch).not.toHaveBeenCalled()
    })

    it('puts the focus back in the field of the form', () => {
      const form = document.createElement('form')
      const input = document.createElement('input')
      form.append(input)
      document.body.append(form)
      const { result } = renderHook(() => useSearchBar({ defaultValue: 'react' }))

      act(() => result.current.clear(clickEvent(form)))

      expect(input).toHaveFocus()
      form.remove()
    })
  })
})
