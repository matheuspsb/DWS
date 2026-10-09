import { api } from '../services/api.ts'
import { authors, categories, posts } from './fixtures.ts'

interface MockApiOptions {
  postsFailures?: number
  postFailures?: number
}

export function mockApi({ postsFailures = 0, postFailures = 0 }: MockApiOptions = {}) {
  let postsLeft = postsFailures
  let postLeft = postFailures

  vi.mocked(api).mockImplementation(async (path: string) => {
    if (path === 'posts/') {
      if (postsLeft-- > 0) throw new Error('boom')
      return posts
    }
    if (path.startsWith('posts/')) {
      if (postLeft-- > 0) throw new Error('boom')
      const post = posts.find(({ id }) => `posts/${id}` === path)
      if (!post) throw new Error('Not found')
      return post
    }
    if (path === 'authors/') return authors
    if (path === 'categories/') return categories
    throw new Error(`Unexpected request to ${path}`)
  })
}
