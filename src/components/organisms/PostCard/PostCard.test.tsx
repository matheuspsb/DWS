import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PostCard from './PostCard.tsx'

const post = {
  title: 'This is the title of the article with two lines',
  excerpt: 'Lorem ipsum dolor sit amet consectetur.',
  date: '2024-01-20',
  author: 'Author Lastname',
  categories: ['Category 1', 'Category 2'],
}

const renderCard = (props: Partial<Parameters<typeof PostCard>[0]> = {}) =>
  render(
    <MemoryRouter>
      <PostCard {...post} {...props} />
    </MemoryRouter>,
  )

describe('PostCard', () => {
  it('renders as an article with the title as a heading', () => {
    renderCard()

    const article = screen.getByRole('article')
    expect(within(article).getByRole('heading', { level: 2, name: post.title })).toBeInTheDocument()
  })

  it('shows the excerpt', () => {
    renderCard()

    expect(screen.getByText(post.excerpt)).toBeInTheDocument()
  })

  it('shows the formatted date and the author', () => {
    renderCard()

    expect(screen.getByText('Jan 20, 2024')).toBeInTheDocument()
    expect(screen.getByText('Author Lastname')).toBeInTheDocument()
  })

  it('lists the categories as tags', () => {
    renderCard()

    const categories = screen.getByRole('list', { name: 'Categories' })
    expect(
      within(categories)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Category 1', 'Category 2'])
  })

  it('omits the category list when there are none', () => {
    renderCard({ categories: [] })

    expect(screen.queryByRole('list', { name: 'Categories' })).not.toBeInTheDocument()
  })

  describe('image', () => {
    it('renders the cover image lazily', () => {
      const { container } = renderCard({ imageUrl: '/cover.jpg' })

      const image = container.querySelector('img')
      expect(image).toHaveAttribute('src', '/cover.jpg')
      expect(image).toHaveAttribute('loading', 'lazy')
    })

    it('is decorative by default', () => {
      const { container } = renderCard({ imageUrl: '/cover.jpg' })

      expect(container.querySelector('img')).toHaveAttribute('alt', '')
    })

    it('accepts a descriptive alt text', () => {
      renderCard({ imageUrl: '/cover.jpg', imageAlt: 'A purple sky' })

      expect(screen.getByRole('img', { name: 'A purple sky' })).toBeInTheDocument()
    })

    it('keeps the layout with a placeholder when there is no image', () => {
      const { container } = renderCard()

      expect(container.querySelector('img')).not.toBeInTheDocument()
      expect(container.querySelector('.post-card__image--empty')).toBeInTheDocument()
    })
  })

  describe('link', () => {
    it('links the title to the post when a destination is given', () => {
      renderCard({ to: '/posts/7' })

      expect(screen.getByRole('link', { name: post.title })).toHaveAttribute('href', '/posts/7')
    })

    it('does not render a link without a destination', () => {
      renderCard()

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })
})
