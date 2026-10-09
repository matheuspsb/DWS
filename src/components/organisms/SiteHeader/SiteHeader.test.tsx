import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useRecentSearches } from '../../../stores/recentSearches.store.ts'
import { renderWithProviders } from '../../../test/renderWithProviders.tsx'
import SiteHeader from './SiteHeader.tsx'

function Location() {
  const { pathname, search } = useLocation()
  return <div data-testid="location">{pathname + search}</div>
}

const renderHeader = () =>
  renderWithProviders(
    <Routes>
      <Route
        path="*"
        element={
          <>
            <SiteHeader />
            <Location />
          </>
        }
      />
    </Routes>,
  )

const openSheet = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Open search' }))
  return screen.getByRole('dialog', { name: 'Search' })
}

beforeEach(() => {
  useRecentSearches.setState({ searches: [] })
})

describe('SiteHeader', () => {
  it('links the logo to the post list', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: 'Dentsu World Services' })).toHaveAttribute('href', '/')
  })

  it('puts a submitted search in the url', async () => {
    renderHeader()

    await userEvent.type(screen.getAllByRole('searchbox')[0], 'sleep{Enter}')

    expect(screen.getByTestId('location')).toHaveTextContent('/?q=sleep')
  })

  it('remembers submitted searches and offers them in the mobile search', async () => {
    renderHeader()
    await userEvent.type(screen.getAllByRole('searchbox')[0], 'sleep{Enter}')
    await userEvent.type(screen.getAllByRole('searchbox')[0], ' lisbon{Enter}')

    const sheet = await openSheet()

    const items = within(within(sheet).getByRole('list', { name: 'Recent searches' }))
      .getAllByRole('button')
      .map((button) => button.textContent)
    expect(items).toEqual(['sleep lisbon', 'sleep'])
  })

  it('searches while typing in the mobile search and remembers it when it closes', async () => {
    renderHeader()
    const sheet = await openSheet()

    await userEvent.type(within(sheet).getByRole('searchbox'), 'sleep')

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/?q=sleep'))
    expect(useRecentSearches.getState().searches).toEqual([])

    await userEvent.click(within(sheet).getByRole('button', { name: 'Close search' }))

    expect(useRecentSearches.getState().searches).toEqual(['sleep'])
  })

  it('searches again when a recent search is picked', async () => {
    useRecentSearches.setState({ searches: ['lisbon'] })
    renderHeader()
    const sheet = await openSheet()

    await userEvent.click(within(sheet).getByRole('button', { name: 'lisbon' }))

    expect(screen.getByTestId('location')).toHaveTextContent('/?q=lisbon')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
