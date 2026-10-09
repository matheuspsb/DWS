import { useNavigate, useSearchParams } from 'react-router-dom'
import { parseFilters, serializeFilters, type PostFilters } from '../utils/postFilters.ts'

export function usePostFilters() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const filters = parseFilters(params)

  const updateFilters = (patch: Partial<PostFilters>) => {
    const search = serializeFilters({ ...filters, ...patch }).toString()
    navigate({ pathname: '/', search })
  }

  return { filters, updateFilters }
}
