import { useQuery } from '@tanstack/react-query'
import { categoriesService } from '../services/categories.service.ts'

const { getCategories } = categoriesService()

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: ({ signal }) => getCategories({ signal }) })
