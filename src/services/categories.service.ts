import { api, type RequestOptions } from './api.ts'
import type { Category } from './types.ts'

export function categoriesService() {
  function getCategories(options?: RequestOptions) {
    return api<Category[]>('categories/', options)
  }

  function getCategory(id: Category['id'], options?: RequestOptions) {
    return api<Category>(`categories/${id}`, options)
  }

  return { getCategories, getCategory }
}
