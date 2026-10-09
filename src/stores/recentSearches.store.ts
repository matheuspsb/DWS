import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pushRecent } from '../utils/pushRecent.ts'

export const MAX_RECENT_SEARCHES = 8

interface RecentSearchesState {
  searches: string[]
  addSearch: (query: string) => void
}

const sameSearch = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

export const useRecentSearches = create<RecentSearchesState>()(
  persist(
    (set) => ({
      searches: [],
      addSearch: (query) => {
        const text = query.trim()
        if (!text) return
        set(({ searches }) => ({
          searches: pushRecent(searches, text, MAX_RECENT_SEARCHES, sameSearch),
        }))
      },
    }),
    { name: 'dws.recent-searches', partialize: ({ searches }) => ({ searches }) },
  ),
)
