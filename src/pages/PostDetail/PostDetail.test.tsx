import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { useViewedPosts } from '../../stores/viewedPosts.store.ts'
import { mockApi } from '../../test/mockApi.ts'
import { renderWithProviders } from '../../test/renderWithProviders.tsx'
import PostDetail from './PostDetail.tsx'

vi.mock('../../services/api.ts', () => ({ api: vi.fn() }))

const renderAt = (path: string) =>
  renderWithProviders(
    <Routes>
      <Route path="/" element={<p>Post list</p>} />
      <Route path="/posts/:id" element={<PostDetail />} />
    </Routes>,
    path,
  )

beforeEach(() => {
  mockApi()
  useViewedPosts.setState({ ids: [] })
})

describe('PostDetail', () => {
  it('says it is loading, then shows the post', async () => {
    renderAt('/posts/p1')

    expect(screen.getByRole('status')).toHaveTextContent('Loading post')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Tech Innovations in Healthcare' }),
    ).toBeInTheDocument()
  })

  it('shows an error with a way to try again', async () => {
    mockApi({ postFailures: 1 })
    renderAt('/posts/p1')

    expect(await screen.findByRole('alert')).toHaveTextContent('could not load this post')

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('has a back button that returns to the post list', async () => {
    renderAt('/posts/p1')
    await screen.findByRole('heading', { level: 1 })

    await userEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByText('Post list')).toBeInTheDocument()
  })

  describe('latest articles', () => {
    it('are the posts opened before, most recent first, without the one being read', async () => {
      useViewedPosts.setState({ ids: ['p3', 'p2', 'p1'] })
      renderAt('/posts/p1')

      const section = await screen.findByRole('region', { name: 'Latest articles' })

      const titles = within(section)
        .getAllByRole('article')
        .map((card) => within(card).getByRole('heading').textContent)
      expect(titles).toEqual(['A Walk Through Lisbon', 'The Science of Sleep'])
    })

    it('are not shown when no other post was opened', async () => {
      renderAt('/posts/p1')
      await screen.findByRole('heading', { level: 1 })

      expect(screen.queryByRole('region', { name: 'Latest articles' })).not.toBeInTheDocument()
    })

    it('remember the post that was opened', async () => {
      renderAt('/posts/p2')
      await screen.findByRole('heading', { level: 1 })

      expect(useViewedPosts.getState().ids).toEqual(['p2'])
    })
  })
})
