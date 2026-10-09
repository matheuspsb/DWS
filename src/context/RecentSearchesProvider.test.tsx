import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRecentSearches } from '../hooks/useRecentSearches.ts'
import RecentSearchesProvider from './RecentSearchesProvider.tsx'
import { STORAGE_KEY } from './recentSearches.ts'

function Demo() {
  const { searches, addSearch, clearSearches } = useRecentSearches()
  return (
    <>
      <ul aria-label="Searches">
        {searches.map((search) => (
          <li key={search}>{search}</li>
        ))}
      </ul>
      <button onClick={() => addSearch('sleep')}>Add</button>
      <button onClick={clearSearches}>Clear</button>
    </>
  )
}

const renderDemo = () =>
  render(
    <RecentSearchesProvider>
      <Demo />
    </RecentSearchesProvider>,
  )

afterEach(() => {
  localStorage.clear()
})

describe('RecentSearchesProvider', () => {
  it('shares the searches and saves them', async () => {
    renderDemo()

    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByRole('listitem')).toHaveTextContent('sleep')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(['sleep'])
  })

  it('starts with what was saved before', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['lisbon']))

    renderDemo()

    expect(screen.getByRole('listitem')).toHaveTextContent('lisbon')
  })

  it('clears the list and the saved copy', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['lisbon']))
    renderDemo()

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([])
  })

  it('refuses to be used without the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Demo />)).toThrow('inside RecentSearchesProvider')
  })
})
