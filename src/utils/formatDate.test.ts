import { formatDate } from './formatDate.ts'

describe('formatDate', () => {
  it('formats an ISO date like the design', () => {
    expect(formatDate('2024-01-20')).toBe('Jan 20, 2024')
  })

  it('formats a full ISO timestamp', () => {
    expect(formatDate('2024-12-05T10:30:00Z')).toBe('Dec 5, 2024')
  })

  it('does not shift the day with the local timezone', () => {
    expect(formatDate('2024-03-01T00:00:00Z')).toBe('Mar 1, 2024')
  })

  it('returns the original text when it is not a valid date', () => {
    expect(formatDate('not a date')).toBe('not a date')
  })
})
