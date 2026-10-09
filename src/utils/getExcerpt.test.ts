import { getExcerpt } from './getExcerpt.ts'

describe('getExcerpt', () => {
  it('keeps a short first paragraph as it is', () => {
    expect(getExcerpt('Short text.')).toBe('Short text.')
  })

  it('uses only the first paragraph', () => {
    expect(getExcerpt('First.\n\nSecond.')).toBe('First.')
  })

  it('cuts a long paragraph and marks the cut', () => {
    expect(getExcerpt('a'.repeat(20), 10)).toBe(`${'a'.repeat(10)}...`)
  })

  it('does not leave a space before the mark', () => {
    expect(getExcerpt('abcde fghij', 6)).toBe('abcde...')
  })

  it('handles empty content', () => {
    expect(getExcerpt('')).toBe('')
  })
})
