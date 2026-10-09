import { api } from '../services/api.ts'
import { authors, categories, posts } from './fixtures.ts'

export function mockApi({ postsFailures = 0 } = {}) {
  let failuresLeft = postsFailures

  vi.mocked(api).mockImplementation(async (path: string) => {
    if (path === 'posts/') {
      if (failuresLeft-- > 0) throw new Error('boom')
      return posts
    }
    if (path === 'authors/') return authors
    if (path === 'categories/') return categories
    throw new Error(`Unexpected request to ${path}`)
  })
}
