import { render } from '@testing-library/react'
import Avatar from './Avatar.tsx'

describe('Avatar', () => {
  it('shows the picture, decorative since the name is written next to it', () => {
    const { container } = render(<Avatar src="grace.png" />)

    const image = container.querySelector('img')
    expect(image).toHaveAttribute('src', 'grace.png')
    expect(image).toHaveAttribute('alt', '')
  })
})
