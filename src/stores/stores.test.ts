import { MAX_RECENT_SEARCHES, useRecentSearches } from './recentSearches.store.ts'
import { MAX_VIEWED_POSTS, useViewedPosts } from './viewedPosts.store.ts'

beforeEach(() => {
  useRecentSearches.setState({ searches: [] })
  useViewedPosts.setState({ ids: [] })
  localStorage.clear()
})

describe('recent searches store', () => {
  it('puts the newest search first and ignores the case of repeated ones', () => {
    const { addSearch } = useRecentSearches.getState()

    addSearch('sleep')
    addSearch('lisbon')
    addSearch('Sleep')

    expect(useRecentSearches.getState().searches).toEqual(['Sleep', 'lisbon'])
  })

  it('trims the text and ignores empty searches', () => {
    const { addSearch } = useRecentSearches.getState()

    addSearch('  sleep  ')
    addSearch('   ')

    expect(useRecentSearches.getState().searches).toEqual(['sleep'])
  })

  it('keeps only the most recent ones', () => {
    const { addSearch } = useRecentSearches.getState()

    Array.from({ length: MAX_RECENT_SEARCHES + 2 }, (_, index) => addSearch(`search ${index}`))

    const { searches } = useRecentSearches.getState()
    expect(searches).toHaveLength(MAX_RECENT_SEARCHES)
    expect(searches[0]).toBe(`search ${MAX_RECENT_SEARCHES + 1}`)
  })

  it('saves the searches in the browser', () => {
    useRecentSearches.getState().addSearch('sleep')

    expect(JSON.parse(localStorage.getItem('dws.recent-searches')!).state).toEqual({
      searches: ['sleep'],
    })
  })
})

describe('viewed posts store', () => {
  it('puts the latest viewed post first', () => {
    const { addView } = useViewedPosts.getState()

    addView('p1')
    addView('p2')

    expect(useViewedPosts.getState().ids).toEqual(['p2', 'p1'])
  })

  it('moves a post that is viewed again to the front instead of repeating it', () => {
    const { addView } = useViewedPosts.getState()

    addView('p1')
    addView('p2')
    addView('p1')

    expect(useViewedPosts.getState().ids).toEqual(['p1', 'p2'])
  })

  it('keeps the latest three plus the one being read', () => {
    const { addView } = useViewedPosts.getState()

    Array.from({ length: MAX_VIEWED_POSTS + 2 }, (_, index) => addView(`p${index}`))

    expect(useViewedPosts.getState().ids).toHaveLength(MAX_VIEWED_POSTS)
  })

  it('saves the history in the browser', () => {
    useViewedPosts.getState().addView('p1')

    expect(JSON.parse(localStorage.getItem('dws.viewed-posts')!).state).toEqual({ ids: ['p1'] })
  })
})
