import { render } from '@testing-library/react'
import PostArticleSkeleton from './PostArticleSkeleton.tsx'

describe('PostArticleSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<PostArticleSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})
