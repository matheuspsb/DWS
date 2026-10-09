import { render } from '@testing-library/react'
import PostCardSkeleton from './PostCardSkeleton.tsx'

describe('PostCardSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<PostCardSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})
