import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import SearchBar from './SearchBar.tsx'

const openSheet = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Open search' }))
  return screen.getByRole('dialog', { name: 'Search' })
}

describe('SearchBar', () => {
  describe('inline field', () => {
    it('has a search field with its button', () => {
      render(<SearchBar />)

      const field = screen.getByRole('search')
      expect(within(field).getByRole('searchbox', { name: 'Search' })).toBeInTheDocument()
      expect(within(field).getByRole('button', { name: 'Search' })).toBeInTheDocument()
    })

    it('searches with Enter', async () => {
      const onSearch = vi.fn()
      render(<SearchBar onSearch={onSearch} />)

      await userEvent.type(screen.getByRole('searchbox'), 'react{Enter}')

      expect(onSearch).toHaveBeenCalledTimes(1)
      expect(onSearch).toHaveBeenCalledWith('react')
    })

    it('searches with the search button', async () => {
      const onSearch = vi.fn()
      render(<SearchBar defaultValue="design" onSearch={onSearch} />)

      await userEvent.click(screen.getByRole('button', { name: 'Search' }))

      expect(onSearch).toHaveBeenCalledWith('design')
    })

    it('keeps the full screen search closed until it is asked for', () => {
      render(<SearchBar />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('full screen search', () => {
    it('opens as a dialog from the search button', async () => {
      render(<SearchBar />)

      const dialog = await openSheet()

      expect(dialog).toBeInTheDocument()
    })

    it('puts the focus in the field', async () => {
      render(<SearchBar />)

      const dialog = await openSheet()

      expect(within(dialog).getByRole('searchbox')).toHaveFocus()
    })

    it('shares the typed text with the inline field', async () => {
      render(<SearchBar />)
      await userEvent.type(screen.getByRole('searchbox'), 'abc')

      const dialog = await openSheet()

      expect(within(dialog).getByRole('searchbox')).toHaveValue('abc')
    })

    it('has a back button and a clear button inside the field', async () => {
      render(<SearchBar />)

      const dialog = await openSheet()

      expect(within(dialog).getByRole('button', { name: 'Close search' })).toBeInTheDocument()
      expect(within(dialog).getByRole('button', { name: 'Clear search' })).toBeInTheDocument()
    })

    describe('closing', () => {
      it('closes with the back button', async () => {
        render(<SearchBar />)
        const dialog = await openSheet()

        await userEvent.click(within(dialog).getByRole('button', { name: 'Close search' }))

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      it('closes when the browser closes the dialog, like with Escape', async () => {
        render(<SearchBar />)
        const dialog = await openSheet()

        fireEvent(dialog, new Event('close'))

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      it('closes after searching', async () => {
        const onSearch = vi.fn()
        render(<SearchBar onSearch={onSearch} />)
        const dialog = await openSheet()

        await userEvent.type(within(dialog).getByRole('searchbox'), 'react{Enter}')

        expect(onSearch).toHaveBeenCalledWith('react')
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      it('keeps the text for the next time it opens', async () => {
        render(<SearchBar />)
        const dialog = await openSheet()
        await userEvent.type(within(dialog).getByRole('searchbox'), 'react')
        await userEvent.click(within(dialog).getByRole('button', { name: 'Close search' }))

        const reopened = await openSheet()

        expect(within(reopened).getByRole('searchbox')).toHaveValue('react')
      })
    })

    describe('clearing', () => {
      it('empties the field and keeps the focus there', async () => {
        render(<SearchBar defaultValue="react" />)
        const dialog = await openSheet()

        await userEvent.click(within(dialog).getByRole('button', { name: 'Clear search' }))

        expect(within(dialog).getByRole('searchbox')).toHaveValue('')
        expect(within(dialog).getByRole('searchbox')).toHaveFocus()
      })

      it('does not close the search', async () => {
        render(<SearchBar defaultValue="react" />)
        const dialog = await openSheet()

        await userEvent.click(within(dialog).getByRole('button', { name: 'Clear search' }))

        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    describe('suggestions', () => {
      const suggestions = ['Design', 'Tech']

      it('lists the suggestions', async () => {
        render(<SearchBar suggestions={suggestions} />)
        const dialog = await openSheet()

        expect(
          within(dialog)
            .getAllByRole('button', { name: /^(Design|Tech)$/ })
            .map((button) => button.textContent),
        ).toEqual(['Design', 'Tech'])
      })

      it('searches for the chosen suggestion and closes', async () => {
        const onSearch = vi.fn()
        render(<SearchBar suggestions={suggestions} onSearch={onSearch} />)
        const dialog = await openSheet()

        await userEvent.click(within(dialog).getByRole('button', { name: 'Tech' }))

        expect(onSearch).toHaveBeenCalledWith('Tech')
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.getByRole('searchbox')).toHaveValue('Tech')
      })

      it('does not render a list when there are none', async () => {
        render(<SearchBar />)
        const dialog = await openSheet()

        expect(within(dialog).queryByRole('listitem')).not.toBeInTheDocument()
      })
    })
  })

  describe('controlled mode', () => {
    it('reports changes and shows what the parent says', async () => {
      const onChange = vi.fn()
      render(<SearchBar value="fixed" onChange={onChange} />)

      await userEvent.type(screen.getByRole('searchbox'), 'x')

      expect(onChange).toHaveBeenCalledWith('fixedx')
      expect(screen.getByRole('searchbox')).toHaveValue('fixed')
    })

    it('follows the parent state', async () => {
      function Parent() {
        const [query, setQuery] = useState('')
        return <SearchBar value={query} onChange={setQuery} />
      }
      render(<Parent />)

      await userEvent.type(screen.getByRole('searchbox'), 'hello')

      expect(screen.getByRole('searchbox')).toHaveValue('hello')
    })
  })
})
