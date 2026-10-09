import { useQuery } from '@tanstack/react-query'
import { authorsService } from '../services/authors.service.ts'

const { getAuthors } = authorsService()

export const useAuthors = () =>
  useQuery({ queryKey: ['authors'], queryFn: ({ signal }) => getAuthors({ signal }) })
