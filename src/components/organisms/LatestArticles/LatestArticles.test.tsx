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

  it('has the mobile wording of the design for the eyes, and one accessible name', () => {
    renderWithProviders(<LatestArticles posts={posts.slice(0, 1)} />)

    expect(screen.getByText('Last articles')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('heading', { level: 2, name: 'Latest articles' })).toBeInTheDocument()
  })

  it('renders nothing when there is nothing to show', () => {
    const { container } = renderWithProviders(<LatestArticles posts={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
