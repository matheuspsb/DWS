import { render, screen } from '@testing-library/react'
import PostGridSkeleton from './PostGridSkeleton.tsx'

describe('PostGridSkeleton', () => {
  it('tells assistive technology that the posts are loading', () => {
    render(<PostGridSkeleton />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading posts')
  })

  it('hides the placeholder cards from assistive technology', () => {
    const { container } = render(<PostGridSkeleton />)

    expect(container.querySelector('ul')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryAllByRole('article')).toHaveLength(0)
  })
})
