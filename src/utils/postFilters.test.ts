import { posts } from '../test/fixtures.ts'
import { filterPosts, parseFilters, serializeFilters, type PostFilters } from './postFilters.ts'

const noFilters: PostFilters = { search: '', categories: [], authors: [], sort: 'newest' }
const titles = (filters: Partial<PostFilters>) =>
  filterPosts(posts, { ...noFilters, ...filters }).map(({ title }) => title)

describe('parseFilters', () => {
  it('reads every filter from the url', () => {
    const params = new URLSearchParams('q=sleep&category=c1&category=c2&author=a1&sort=oldest')

    expect(parseFilters(params)).toEqual({
      search: 'sleep',
      categories: ['c1', 'c2'],
      authors: ['a1'],
      sort: 'oldest',
    })
  })

  it('falls back to no filters and newest first', () => {
    expect(parseFilters(new URLSearchParams('sort=nonsense'))).toEqual(noFilters)
  })
})

describe('serializeFilters', () => {
  it('leaves out what is not filtering', () => {
    expect(serializeFilters(noFilters).toString()).toBe('')
  })

  it('round-trips with parseFilters', () => {
    const filters: PostFilters = {
      search: 'a b',
      categories: ['c1', 'c2'],
      authors: ['a2'],
      sort: 'oldest',
    }

    expect(parseFilters(serializeFilters(filters))).toEqual(filters)
  })
})

describe('filterPosts', () => {
  it('shows every post newest first when nothing filters', () => {
    expect(titles({})).toEqual([
      'Tech Innovations in Healthcare',
      'The Science of Sleep',
      'A Walk Through Lisbon',
    ])
  })

  it('reverses the order for oldest first', () => {
    expect(titles({ sort: 'oldest' })[0]).toBe('A Walk Through Lisbon')
  })

  it('searches the title ignoring case and surrounding spaces', () => {
    expect(titles({ search: '  SLEEP ' })).toEqual(['The Science of Sleep'])
  })

  it('keeps posts of any selected category', () => {
    expect(titles({ categories: ['c1', 'c2'] })).toHaveLength(2)
    expect(titles({ categories: ['c2'] })).toEqual(['The Science of Sleep'])
  })

  it('keeps posts of any selected author', () => {
    expect(titles({ authors: ['a1'] })).toHaveLength(2)
  })

  it('combines the filters', () => {
    expect(titles({ authors: ['a1'], categories: ['c1'], search: 'health' })).toEqual([
      'Tech Innovations in Healthcare',
    ])
    expect(titles({ authors: ['a2'], categories: ['c1'] })).toEqual([])
  })

  it('does not change the list it receives', () => {
    const before = posts.map(({ id }) => id)

    filterPosts(posts, { ...noFilters, sort: 'oldest' })

    expect(posts.map(({ id }) => id)).toEqual(before)
  })
})
