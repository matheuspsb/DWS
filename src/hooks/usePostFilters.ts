import { useNavigate, useSearchParams } from 'react-router-dom'
import { routes } from '../routes.ts'
import { parseFilters, serializeFilters, type PostFilters } from '../utils/postFilters.ts'

export function usePostFilters() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const filters = parseFilters(params)

  const updateFilters = (patch: Partial<PostFilters>, { replace = false } = {}) => {
    const search = serializeFilters({ ...filters, ...patch }).toString()
    navigate({ pathname: routes.home, search }, { replace })
  }

  return { filters, updateFilters }
}
