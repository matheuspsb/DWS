import { screen } from '@testing-library/react'
import { posts } from '../../../test/fixtures.ts'
import { renderWithProviders } from '../../../test/renderWithProviders.tsx'
import LatestArticles from './LatestArticles.tsx'

describe('LatestArticles', () => {
  it('is a section named by its heading, with a card for each post', () => {
    renderWithProviders(<LatestArticles posts={posts.slice(0, 2)} />)

    expect(screen.getByRole('region', { name: 'Latest articles' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('renders nothing when there is nothing to show', () => {
    const { container } = renderWithProviders(<LatestArticles posts={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
