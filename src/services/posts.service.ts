import { api, type RequestOptions } from '../api/client.ts'
import type { Post } from '../api/types.ts'

export function postsService() {
  function getPosts(options?: RequestOptions) {
    return api<Post[]>('posts/', options)
  }

  function getPost(id: Post['id'], options?: RequestOptions) {
    return api<Post>(`posts/${id}`, options)
  }

  return { getPosts, getPost }
}
