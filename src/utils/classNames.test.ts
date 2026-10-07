import { classNames } from './classNames.ts'

describe('classNames', () => {
  it('joins the truthy class names', () => {
    expect(classNames('a', 'b')).toBe('a b')
  })

  it('ignores falsy values', () => {
    expect(classNames('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('supports conditional modifiers', () => {
    const isOpen = true
    const isSelected = false
    expect(classNames('block', isOpen && 'block--open', isSelected && 'block--selected')).toBe(
      'block block--open',
    )
  })
})
