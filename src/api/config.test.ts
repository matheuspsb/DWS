import { API_URL } from './config.ts'

describe('API_URL', () => {
  it('has a default, so the app runs on a fresh clone without any env file', () => {
    expect(API_URL).toMatch(/^https:\/\//)
  })
})
