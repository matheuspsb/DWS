import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { api } from '../services/api.ts'
import { useViewedPosts } from '../stores/viewedPosts.store.ts'
import { posts } from '../test/fixtures.ts'
import { useLatestArticles } from './useLatestArticles.ts'

vi.mock('../services/api.ts', () => ({ api: vi.fn() }))

const manyPosts = Array.from({ length: 6 }, (_, index) => ({
  ...posts[0],
  id: `p${index}`,
  title: `Post ${index}`,
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
)

beforeEach(() => {
  vi.mocked(api).mockResolvedValue(manyPosts)
})

describe('useLatestArticles', () => {
  it('lists the viewed posts, most recent first', async () => {
    useViewedPosts.setState({ ids: ['p3', 'p1'] })
    const { result } = renderHook(() => useLatestArticles('p0'), { wrapper })

    await waitFor(() => expect(result.current.map(({ id }) => id)).toEqual(['p3', 'p1']))
  })

  it('leaves out the post being read', async () => {
    useViewedPosts.setState({ ids: ['p3', 'p1'] })
    const { result } = renderHook(() => useLatestArticles('p3'), { wrapper })

    await waitFor(() => expect(result.current.map(({ id }) => id)).toEqual(['p1']))
  })

  it('shows at most three', async () => {
    useViewedPosts.setState({ ids: ['p5', 'p4', 'p3', 'p2'] })
    const { result } = renderHook(() => useLatestArticles('p0'), { wrapper })

    await waitFor(() => expect(result.current).toHaveLength(3))
    expect(result.current.map(({ id }) => id)).toEqual(['p5', 'p4', 'p3'])
  })

  it('skips viewed posts that no longer exist', async () => {
    useViewedPosts.setState({ ids: ['gone', 'p1'] })
    const { result } = renderHook(() => useLatestArticles('p0'), { wrapper })

    await waitFor(() => expect(result.current.map(({ id }) => id)).toEqual(['p1']))
  })
})
