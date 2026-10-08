import { useCallback, useEffect, useRef } from 'react'

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const cancel = useCallback(() => clearTimeout(timer.current), [])

  const debounced = (...args: Args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => callback(...args), delay)
  }

  useEffect(() => cancel, [cancel])

  return { debounced, cancel }
}
