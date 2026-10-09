import { api, type RequestOptions } from '../api/client.ts'
import type { Author } from '../api/types.ts'

export function authorsService() {
  function getAuthors(options?: RequestOptions) {
    return api<Author[]>('authors/', options)
  }

  function getAuthor(id: Author['id'], options?: RequestOptions) {
    return api<Author>(`authors/${id}`, options)
  }

  return { getAuthors, getAuthor }
}
