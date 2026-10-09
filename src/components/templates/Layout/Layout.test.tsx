import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes, useLocation } from 'react-router-dom'
import { STORAGE_KEY } from '../../../context/recentSearches.ts'
import { renderWithProviders } from '../../../test/renderWithProviders.tsx'
import Layout from './Layout.tsx'

function Location() {
  const { pathname, search } = useLocation()
  return <div data-testid="location">{pathname + search}</div>
}

const renderLayout = () =>
  renderWithProviders(
    <Routes>
      <Route element={<Layout />}>
        <Route path="*" element={<Location />} />
      </Route>
    </Routes>,
  )

const openSheet = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Open search' }))
  return screen.getByRole('dialog', { name: 'Search' })
}

afterEach(() => {
  localStorage.clear()
})

describe('Layout search', () => {
  it('puts a submitted search in the url', async () => {
    renderLayout()

    await userEvent.type(screen.getAllByRole('searchbox')[0], 'sleep{Enter}')

    expect(screen.getByTestId('location')).toHaveTextContent('/?q=sleep')
  })

  it('remembers submitted searches and offers them in the mobile search', async () => {
    renderLayout()
    await userEvent.type(screen.getAllByRole('searchbox')[0], 'sleep{Enter}')
    await userEvent.type(screen.getAllByRole('searchbox')[0], ' lisbon{Enter}')

    const sheet = await openSheet()

    const items = within(within(sheet).getByRole('list', { name: 'Recent searches' }))
      .getAllByRole('button')
      .map((button) => button.textContent)
    expect(items).toEqual(['sleep lisbon', 'sleep'])
  })

  it('does not remember what was only typed', async () => {
    renderLayout()
    await userEvent.type(screen.getAllByRole('searchbox')[0], 'sleep')

    const sheet = await openSheet()

    expect(within(sheet).queryByRole('button', { name: 'sleep' })).not.toBeInTheDocument()
  })

  it('searches again when a recent search is picked', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['lisbon']))
    renderLayout()
    const sheet = await openSheet()

    await userEvent.click(within(sheet).getByRole('button', { name: 'lisbon' }))

    expect(screen.getByTestId('location')).toHaveTextContent('/?q=lisbon')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('clears the history', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['lisbon']))
    renderLayout()
    const sheet = await openSheet()

    await userEvent.click(within(sheet).getByRole('button', { name: 'Clear recent searches' }))

    expect(within(sheet).queryByRole('button', { name: 'lisbon' })).not.toBeInTheDocument()
    expect(within(sheet).queryByRole('button', { name: 'Clear recent searches' })).toBeNull()
  })
})
