import { render } from '@testing-library/react'
import Icon from './Icon.tsx'

describe('Icon', () => {
  it('renders a 24px decorative svg by default', () => {
    const { container } = render(<Icon name="chevron-down" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('accepts a custom size', () => {
    const { container } = render(<Icon name="close" size={16} />)

    expect(container.querySelector('svg')).toHaveAttribute('width', '16')
  })

  it('draws a different shape for each icon', () => {
    const chevron = render(<Icon name="chevron-down" />).container.querySelector('path')
    const close = render(<Icon name="close" />).container.querySelector('path')

    expect(chevron?.getAttribute('d')).not.toBe(close?.getAttribute('d'))
  })
})
