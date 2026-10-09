import {
  MAX_RECENT_SEARCHES,
  STORAGE_KEY,
  loadRecentSearches,
  recentSearchesReducer,
  saveRecentSearches,
} from './recentSearches.ts'

describe('recentSearchesReducer', () => {
  it('puts the newest search first', () => {
    expect(recentSearchesReducer(['a'], { type: 'added', query: 'b' })).toEqual(['b', 'a'])
  })

  it('moves a repeated search to the top, ignoring case', () => {
    expect(recentSearchesReducer(['b', 'Sleep', 'a'], { type: 'added', query: 'sleep' })).toEqual([
      'sleep',
      'b',
      'a',
    ])
  })

  it('trims the text and ignores empty searches', () => {
    expect(recentSearchesReducer(['a'], { type: 'added', query: '  b  ' })).toEqual(['b', 'a'])
    expect(recentSearchesReducer(['a'], { type: 'added', query: '   ' })).toEqual(['a'])
  })

  it('keeps only the most recent ones', () => {
    const full = Array.from({ length: MAX_RECENT_SEARCHES }, (_, index) => `old ${index}`)

    const next = recentSearchesReducer(full, { type: 'added', query: 'new' })

    expect(next).toHaveLength(MAX_RECENT_SEARCHES)
    expect(next[0]).toBe('new')
    expect(next).not.toContain(`old ${MAX_RECENT_SEARCHES - 1}`)
  })
})

describe('storage', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('loads what was saved', () => {
    saveRecentSearches(['a', 'b'])

    expect(loadRecentSearches()).toEqual(['a', 'b'])
  })

  it('starts empty when nothing was saved', () => {
    expect(loadRecentSearches()).toEqual([])
  })

  it('starts empty when the saved value is broken or has another shape', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadRecentSearches()).toEqual([])

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ a: 1 }))
    expect(loadRecentSearches()).toEqual([])
  })

  it('drops saved entries that are not text', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['a', 3, null, 'b']))

    expect(loadRecentSearches()).toEqual(['a', 'b'])
  })
})
