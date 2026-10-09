import { screen } from '@testing-library/react'
import { posts } from '../../../test/fixtures.ts'
import { renderWithProviders } from '../../../test/renderWithProviders.tsx'
import PostGrid from './PostGrid.tsx'

describe('PostGrid', () => {
  it('shows a card for each post, linked to the post', () => {
    renderWithProviders(<PostGrid posts={posts} />)

    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'The Science of Sleep' })).toHaveAttribute(
      'href',
      '/posts/p2',
    )
  })

  it('shows the first paragraph of the post as the excerpt', () => {
    renderWithProviders(
      <PostGrid posts={[{ ...posts[0], content: 'The first.\n\nThe second.' }]} />,
    )

    expect(screen.getByText('The first.')).toBeInTheDocument()
    expect(screen.queryByText('The second.')).not.toBeInTheDocument()
  })
})
