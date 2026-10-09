import { screen } from '@testing-library/react'
import App from './App.tsx'
import { mockApi } from './test/mockApi.ts'
import { renderWithProviders } from './test/renderWithProviders.tsx'

vi.mock('./services/api.ts', () => ({ api: vi.fn() }))

beforeEach(() => mockApi())

describe('App routing', () => {
  it('renders a not found page for an unknown route', () => {
    renderWithProviders(<App />, '/nowhere')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('renders the post list on the home route', async () => {
    renderWithProviders(<App />, '/')

    expect(screen.getByRole('heading', { name: 'DWS blog' })).toBeInTheDocument()
    expect(await screen.findAllByRole('article')).toHaveLength(3)
  })

  it('renders the post detail on /posts/:id', async () => {
    renderWithProviders(<App />, '/posts/p1')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Tech Innovations in Healthcare' }),
    ).toBeInTheDocument()
  })
})
