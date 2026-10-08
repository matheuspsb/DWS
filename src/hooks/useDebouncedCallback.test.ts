import { act, renderHook } from '@testing-library/react'
import { useDebouncedCallback } from './useDebouncedCallback.ts'

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls the callback once the delay has passed', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    act(() => result.current.debounced('a'))
    act(() => vi.advanceTimersByTime(299))
    expect(callback).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('a')
  })

  it('restarts the wait on every call and uses the last arguments', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    act(() => result.current.debounced('a'))
    act(() => vi.advanceTimersByTime(200))
    act(() => result.current.debounced('b'))
    act(() => vi.advanceTimersByTime(200))
    expect(callback).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(100))
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('b')
  })

  it('can be called again after it has run', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    act(() => result.current.debounced('a'))
    act(() => vi.advanceTimersByTime(300))
    act(() => result.current.debounced('b'))
    act(() => vi.advanceTimersByTime(300))

    expect(callback.mock.calls).toEqual([['a'], ['b']])
  })

  it('cancels the pending call', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    act(() => result.current.debounced('a'))
    act(() => result.current.cancel())
    act(() => vi.advanceTimersByTime(1000))

    expect(callback).not.toHaveBeenCalled()
  })

  it('cancels the pending call when the component unmounts', () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300))

    act(() => result.current.debounced('a'))
    unmount()
    act(() => vi.advanceTimersByTime(1000))

    expect(callback).not.toHaveBeenCalled()
  })

  it('does nothing when cancelled with nothing pending', () => {
    const { result } = renderHook(() => useDebouncedCallback(vi.fn(), 300))

    expect(() => act(() => result.current.cancel())).not.toThrow()
  })
})
