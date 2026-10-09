import { useReducer, type ReactNode } from 'react'
import { RecentSearchesContext } from './RecentSearchesContext.ts'
import {
  loadRecentSearches,
  recentSearchesReducer,
  saveRecentSearches,
  type RecentSearchesAction,
} from './recentSearches.ts'

export default function RecentSearchesProvider({ children }: { children: ReactNode }) {
  const [searches, dispatch] = useReducer(recentSearchesReducer, undefined, loadRecentSearches)

  const update = (action: RecentSearchesAction) => {
    saveRecentSearches(recentSearchesReducer(searches, action))
    dispatch(action)
  }

  return (
    <RecentSearchesContext
      value={{
        searches,
        addSearch: (query) => update({ type: 'added', query }),
      }}
    >
      {children}
    </RecentSearchesContext>
  )
}
