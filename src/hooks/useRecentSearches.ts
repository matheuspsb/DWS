import { use } from 'react'
import { RecentSearchesContext } from '../context/RecentSearchesContext.ts'

export function useRecentSearches() {
  const value = use(RecentSearchesContext)
  if (!value) throw new Error('useRecentSearches must be used inside RecentSearchesProvider')
  return value
}
