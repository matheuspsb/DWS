import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import SearchField from './SearchField.tsx'

describe('SearchField', () => {
  it('is a search landmark with an accessible text field', () => {
    render(<SearchField />)

    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument()
  })

  it('shows the placeholder', () => {
    render(<SearchField />)

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
  })

  it('accepts another label and placeholder', () => {
    render(<SearchField label="Search articles" placeholder="Find an article" />)

    expect(screen.getByRole('searchbox', { name: 'Search articles' })).toHaveAttribute(
      'placeholder',
      'Find an article',
    )
  })

  describe('typing', () => {
    it('keeps what the user types when uncontrolled', async () => {
      render(<SearchField />)

      await userEvent.type(screen.getByRole('searchbox'), 'react')

      expect(screen.getByRole('searchbox')).toHaveValue('react')
    })

    it('starts with the default value', () => {
      render(<SearchField defaultValue="design" />)

      expect(screen.getByRole('searchbox')).toHaveValue('design')
    })

    it('reports every change', async () => {
      const onChange = vi.fn()
      render(<SearchField onChange={onChange} />)

      await userEvent.type(screen.getByRole('searchbox'), 'ab')

      expect(onChange).toHaveBeenNthCalledWith(1, 'a')
      expect(onChange).toHaveBeenNthCalledWith(2, 'ab')
    })

    it('only changes when the parent does in controlled mode', async () => {
      const onChange = vi.fn()
      render(<SearchField value="fixed" onChange={onChange} />)

      await userEvent.type(screen.getByRole('searchbox'), 'x')

      expect(onChange).toHaveBeenCalledWith('fixedx')
      expect(screen.getByRole('searchbox')).toHaveValue('fixed')
    })

    it('follows the parent state', async () => {
      function Parent() {
        const [query, setQuery] = useState('')
        return (
          <>
            <SearchField value={query} onChange={setQuery} />
            <button onClick={() => setQuery('from parent')}>Fill</button>
          </>
        )
      }
      render(<Parent />)

      await userEvent.click(screen.getByRole('button', { name: 'Fill' }))

      expect(screen.getByRole('searchbox')).toHaveValue('from parent')
    })
  })

  describe('submitting', () => {
    it('submits the query with Enter', async () => {
      const onSubmit = vi.fn()
      render(<SearchField onSubmit={onSubmit} />)

      await userEvent.type(screen.getByRole('searchbox'), 'react{Enter}')

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith('react')
    })

    it('submits through a submit button given as adornment', async () => {
      const onSubmit = vi.fn()
      render(
        <SearchField
          onSubmit={onSubmit}
          defaultValue="react"
          endAdornment={<button type="submit">Go</button>}
        />,
      )

      await userEvent.click(screen.getByRole('button', { name: 'Go' }))

      expect(onSubmit).toHaveBeenCalledWith('react')
    })
  })

  describe('adornments', () => {
    it('renders the start adornment before the field and the end one after it', () => {
      render(
        <SearchField
          startAdornment={<button type="button">Back</button>}
          endAdornment={<button type="button">Clear</button>}
        />,
      )

      const [back, input, clear] = Array.from(screen.getByRole('search').children)
      expect(back).toHaveTextContent('Back')
      expect(input).toBe(screen.getByRole('searchbox'))
      expect(clear).toHaveTextContent('Clear')
    })
  })
})
