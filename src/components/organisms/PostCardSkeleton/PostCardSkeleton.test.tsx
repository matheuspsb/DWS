import { render } from '@testing-library/react'
import PostCardSkeleton from './PostCardSkeleton.tsx'

describe('PostCardSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<PostCardSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not expose any text or interactive element', () => {
    const { container } = render(<PostCardSkeleton />)

    expect(container).toHaveTextContent('')
    expect(container.querySelector('a, button')).toBeNull()
  })
})
