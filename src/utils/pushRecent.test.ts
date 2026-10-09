import { pushRecent } from './pushRecent.ts'

describe('pushRecent', () => {
  it('puts the item first', () => {
    expect(pushRecent(['a', 'b'], 'c', 5)).toEqual(['c', 'a', 'b'])
  })

  it('moves an item that is already there to the front instead of repeating it', () => {
    expect(pushRecent(['a', 'b', 'c'], 'b', 5)).toEqual(['b', 'a', 'c'])
  })

  it('keeps only the most recent ones', () => {
    expect(pushRecent(['a', 'b', 'c'], 'd', 3)).toEqual(['d', 'a', 'b'])
  })

  it('can decide what counts as the same item', () => {
    const sameIgnoringCase = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

    expect(pushRecent(['Sleep', 'a'], 'sleep', 5, sameIgnoringCase)).toEqual(['sleep', 'a'])
  })

  it('does not change the list it receives', () => {
    const list = ['a']

    pushRecent(list, 'b', 5)

    expect(list).toEqual(['a'])
  })
})
