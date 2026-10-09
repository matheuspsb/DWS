export const MAX_RECENT_SEARCHES = 8
export const STORAGE_KEY = 'dws.recent-searches'

export type RecentSearchesAction = { type: 'added'; query: string }

export function recentSearchesReducer(state: string[], action: RecentSearchesAction): string[] {
  switch (action.type) {
    case 'added': {
      const query = action.query.trim()
      if (!query) return state
      const others = state.filter((entry) => entry.toLowerCase() !== query.toLowerCase())
      return [query, ...others].slice(0, MAX_RECENT_SEARCHES)
    }
  }
}

export function loadRecentSearches(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(stored)) return []
    return stored.filter((entry): entry is string => typeof entry === 'string')
  } catch {
    return []
  }
}

export function saveRecentSearches(searches: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
  } catch {}
}
