import { act, renderHook } from '@testing-library/react'
import { useControllableState } from './useControllableState.ts'

describe('useControllableState', () => {
  it('starts with the default value when uncontrolled', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: ['a'] }))
    expect(result.current[0]).toEqual(['a'])
  })

  it('updates its own state and notifies when uncontrolled', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllableState({ defaultValue: ['a'], onChange }))

    act(() => result.current[1](['a', 'b']))

    expect(result.current[0]).toEqual(['a', 'b'])
    expect(onChange).toHaveBeenCalledWith(['a', 'b'])
  })

  it('reflects the provided value and does not store its own when controlled', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControllableState({ value: ['x'], defaultValue: [] as string[], onChange }),
    )

    act(() => result.current[1](['y']))

    expect(result.current[0]).toEqual(['x'])
    expect(onChange).toHaveBeenCalledWith(['y'])
  })

  it('follows the controlled value when it changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: [] as string[] }),
      { initialProps: { value: ['a'] } },
    )

    rerender({ value: ['b'] })

    expect(result.current[0]).toEqual(['b'])
  })
})
