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
    const names = ['chevron-down', 'close', 'arrow-left', 'sort', 'search', 'filters'] as const
    const shapes = names.map((name) =>
      render(<Icon name={name} />)
        .container.querySelector('path')
        ?.getAttribute('d'),
    )

    expect(new Set(shapes).size).toBe(names.length)
  })
})
