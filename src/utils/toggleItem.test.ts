import { toggleItem } from './toggleItem.ts'

describe('toggleItem', () => {
  it('adds an item that is not in the list, at the end', () => {
    expect(toggleItem(['a'], 'b')).toEqual(['a', 'b'])
  })

  it('removes an item that is already in the list', () => {
    expect(toggleItem(['a', 'b'], 'a')).toEqual(['b'])
  })

  it('does not change the list it receives', () => {
    const list = ['a']

    toggleItem(list, 'b')

    expect(list).toEqual(['a'])
  })
})
