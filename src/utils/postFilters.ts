import type { Post } from '../services/types.ts'

export type SortOrder = 'newest' | 'oldest'

export interface PostFilters {
  search: string
  categories: string[]
  authors: string[]
  sort: SortOrder
}

export function parseFilters(params: URLSearchParams): PostFilters {
  return {
    search: params.get('q') ?? '',
    categories: params.getAll('category'),
    authors: params.getAll('author'),
    sort: params.get('sort') === 'oldest' ? 'oldest' : 'newest',
  }
}

export function serializeFilters({ search, categories, authors, sort }: PostFilters) {
  const params = new URLSearchParams()
  if (search) params.set('q', search)
  categories.forEach((id) => params.append('category', id))
  authors.forEach((id) => params.append('author', id))
  if (sort === 'oldest') params.set('sort', sort)
  return params
}

export function filterPosts(posts: Post[], { search, categories, authors, sort }: PostFilters) {
  const text = search.trim().toLowerCase()
  const matching = posts.filter(
    (post) =>
      (!text || post.title.toLowerCase().includes(text)) &&
      (categories.length === 0 || post.categories.some(({ id }) => categories.includes(id))) &&
      (authors.length === 0 || authors.includes(post.authorId)),
  )
  const newestFirst = matching.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return sort === 'newest' ? newestFirst : newestFirst.reverse()
}
