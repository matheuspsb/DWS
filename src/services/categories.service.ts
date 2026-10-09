import { api, type RequestOptions } from '../api/client.ts'
import type { Category } from '../api/types.ts'

export function categoriesService() {
  function getCategories(options?: RequestOptions) {
    return api<Category[]>('categories/', options)
  }

  function getCategory(id: Category['id'], options?: RequestOptions) {
    return api<Category>(`categories/${id}`, options)
  }

  return { getCategories, getCategory }
}
