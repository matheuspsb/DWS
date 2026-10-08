import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar.tsx'

const setup = () => userEvent.setup({ delay: null })
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))

describe('SearchBar debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.assign(globalThis, { jest: { advanceTimersByTime: vi.advanceTimersByTime } })
  })

  afterEach(() => {
    vi.useRealTimers()
    Reflect.deleteProperty(globalThis, 'jest')
  })

  describe('while typing', () => {
    it('searches once, after a pause in typing', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)

      await user.type(screen.getByRole('searchbox'), 'react')
      expect(onSearch).not.toHaveBeenCalled()

      wait(299)
      expect(onSearch).not.toHaveBeenCalled()

      wait(1)
      expect(onSearch).toHaveBeenCalledTimes(1)
      expect(onSearch).toHaveBeenCalledWith('react')
    })

    it('restarts the wait on every keystroke', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)

      await user.type(screen.getByRole('searchbox'), 'r')
      wait(200)
      await user.type(screen.getByRole('searchbox'), 'e')
      wait(200)
      expect(onSearch).not.toHaveBeenCalled()

      wait(100)
      expect(onSearch).toHaveBeenCalledTimes(1)
      expect(onSearch).toHaveBeenCalledWith('re')
    })

    it('waits as long as the debounceMs prop says', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} debounceMs={500} />)

      await user.type(screen.getByRole('searchbox'), 'react')
      wait(499)
      expect(onSearch).not.toHaveBeenCalled()

      wait(1)
      expect(onSearch).toHaveBeenCalledWith('react')
    })

    it('searches without the spaces around the text', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)

      await user.type(screen.getByRole('searchbox'), '  react  ')
      wait(300)

      expect(onSearch).toHaveBeenCalledWith('react')
    })

    it('does not search for spaces only', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)

      await user.type(screen.getByRole('searchbox'), '   ')
      wait(1000)

      expect(onSearch).not.toHaveBeenCalled()
    })

    it('does not repeat a search for text that was already searched', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)
      const field = screen.getByRole('searchbox')

      await user.type(field, 'ab')
      wait(300)
      await user.type(field, 'c')
      await user.keyboard('{Backspace}')
      wait(300)

      expect(onSearch).toHaveBeenCalledTimes(1)
      expect(onSearch).toHaveBeenCalledWith('ab')
    })

    it('stops waiting when the component unmounts', async () => {
      const onSearch = vi.fn()
      const user = setup()
      const { unmount } = render(<SearchBar onSearch={onSearch} />)

      await user.type(screen.getByRole('searchbox'), 'react')
      unmount()
      wait(1000)

      expect(onSearch).not.toHaveBeenCalled()
    })
  })

  describe('without waiting', () => {
    it('searches right away on Enter and drops the pending search', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)

      await user.type(screen.getByRole('searchbox'), 'react{Enter}')
      expect(onSearch).toHaveBeenCalledTimes(1)

      wait(1000)
      expect(onSearch).toHaveBeenCalledTimes(1)
      expect(onSearch).toHaveBeenCalledWith('react')
    })

    it('searches right away with the search button', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)

      await user.type(screen.getByRole('searchbox'), 'react')
      await user.click(screen.getByRole('button', { name: 'Search' }))

      expect(onSearch).toHaveBeenCalledTimes(1)
      wait(1000)
      expect(onSearch).toHaveBeenCalledTimes(1)
    })

    it('searches again on Enter even if the text was already searched', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)

      await user.type(screen.getByRole('searchbox'), 'react')
      wait(300)
      await user.keyboard('{Enter}')

      expect(onSearch).toHaveBeenCalledTimes(2)
    })

    it('shows everything again as soon as the field is emptied', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)
      const field = screen.getByRole('searchbox')
      await user.type(field, 'react')
      wait(300)

      await user.clear(field)

      expect(onSearch).toHaveBeenCalledTimes(2)
      expect(onSearch).toHaveBeenLastCalledWith('')
    })
  })

  describe('full screen search', () => {
    const openSheet = async (user: ReturnType<typeof setup>) => {
      await user.click(screen.getByRole('button', { name: 'Open search' }))
      return screen.getByRole('dialog', { name: 'Search' })
    }

    it('keeps the sheet open while it searches as you type', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)
      const dialog = await openSheet(user)

      await user.type(within(dialog).getByRole('searchbox'), 'react')
      wait(300)

      expect(onSearch).toHaveBeenCalledWith('react')
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('closes the sheet on Enter', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)
      const dialog = await openSheet(user)

      await user.type(within(dialog).getByRole('searchbox'), 'react{Enter}')

      expect(onSearch).toHaveBeenCalledWith('react')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('searches for the empty text right away when the field is cleared', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar defaultValue="react" onSearch={onSearch} />)
      const dialog = await openSheet(user)

      await user.click(within(dialog).getByRole('button', { name: 'Clear search' }))

      expect(onSearch).toHaveBeenCalledTimes(1)
      expect(onSearch).toHaveBeenCalledWith('')
    })

    it('does not search for the empty text when there was nothing to clear', async () => {
      const onSearch = vi.fn()
      const user = setup()
      render(<SearchBar onSearch={onSearch} />)
      const dialog = await openSheet(user)

      await user.click(within(dialog).getByRole('button', { name: 'Clear search' }))

      expect(onSearch).not.toHaveBeenCalled()
    })
  })
})
