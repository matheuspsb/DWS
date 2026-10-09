import { render, screen } from '@testing-library/react'
import PostByline from './PostByline.tsx'

const renderByline = () =>
  render(<PostByline authorName="Grace Doe" authorPicture="grace.png" date="2024-01-20" />)

describe('PostByline', () => {
  it('says who wrote the post', () => {
    renderByline()

    expect(screen.getByText(/Written by:/)).toHaveTextContent('Written by: Grace Doe')
  })

  it('shows the date like the design and exposes the machine readable one', () => {
    renderByline()

    expect(screen.getByText('Jan 20, 2024')).toHaveAttribute('datetime', '2024-01-20')
  })

  it('shows the author picture', () => {
    const { container } = renderByline()

    expect(container.querySelector('img')).toHaveAttribute('src', 'grace.png')
  })
})
