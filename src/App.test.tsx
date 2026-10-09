import { screen } from '@testing-library/react'
import App from './App.tsx'
import { mockApi } from './test/mockApi.ts'
import { renderWithProviders } from './test/renderWithProviders.tsx'

vi.mock('./services/api.ts', () => ({ api: vi.fn() }))

beforeEach(() => mockApi())

describe('App routing', () => {
  it('renders the post list on the home route', async () => {
    renderWithProviders(<App />, '/')

    expect(screen.getByRole('heading', { name: 'DWS blog' })).toBeInTheDocument()
    expect(await screen.findAllByRole('article')).toHaveLength(3)
  })

  it('renders the post detail on /posts/:id', () => {
    renderWithProviders(<App />, '/posts/3')

    expect(screen.getByRole('heading', { name: 'Post 3' })).toBeInTheDocument()
  })
})
