import { createContext } from 'react'

export interface RecentSearchesValue {
  searches: string[]
  addSearch: (query: string) => void
  clearSearches: () => void
}

export const RecentSearchesContext = createContext<RecentSearchesValue | null>(null)
