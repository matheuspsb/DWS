import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import fallbackCover from '../../../assets/fallback-cover.svg'
import PostCard from './PostCard.tsx'

const post = {
  title: 'This is the title of the article with two lines',
  excerpt: 'Lorem ipsum dolor sit amet consectetur.',
  date: '2024-01-20',
  author: 'Author Lastname',
  categories: ['Category 1', 'Category 2'],
  imageUrl: '/cover.jpg',
  to: '/posts/7',
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

  it('shows the excerpt, the formatted date and the author', () => {
    renderCard()

    expect(screen.getByText(post.excerpt)).toBeInTheDocument()
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

  it('renders the cover image lazily and as decorative', () => {
    const { container } = renderCard()

    const image = container.querySelector('img')
    expect(image).toHaveAttribute('src', '/cover.jpg')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('alt', '')
  })

  it.each([undefined, null, ''])(
    'falls back to the default cover when the image is %j',
    (imageUrl) => {
      const { container } = renderCard({ imageUrl })

      expect(container.querySelector('img')).toHaveAttribute('src', fallbackCover)
    },
  )

  describe('links', () => {
    it('links the title to the post', () => {
      renderCard()

      expect(screen.getByRole('link', { name: post.title })).toHaveAttribute('href', '/posts/7')
    })

    it('also links the cover image, hidden from assistive technology and the tab order', () => {
      const { container } = renderCard()

      const coverLink = container.querySelector('img')?.closest('a')
      expect(coverLink).toHaveAttribute('href', '/posts/7')
      expect(coverLink).toHaveAttribute('aria-hidden', 'true')
      expect(coverLink).toHaveAttribute('tabindex', '-1')
      expect(screen.getAllByRole('link')).toHaveLength(1)
    })

    describe('clicking the cover', () => {
      const renderRoutes = () =>
        render(
          <MemoryRouter>
            <Routes>
              <Route path="/" element={<PostCard {...post} />} />
              <Route path="/posts/7" element={<p>Post page</p>} />
            </Routes>
          </MemoryRouter>,
        )

      it('opens the post', async () => {
        const { container } = renderRoutes()

        await userEvent.click(container.querySelector('img')!)

        expect(screen.getByText('Post page')).toBeInTheDocument()
      })

      it('does not move the focus to the link hidden from assistive technology', async () => {
        const { container } = renderRoutes()
        const coverLink = container.querySelector('img')!.closest('a')!

        await userEvent.pointer({ keys: '[MouseLeft>]', target: coverLink })

        expect(coverLink).not.toHaveFocus()
      })
    })

    it('keeps the text area and the tags out of any link', () => {
      renderCard()

      expect(screen.getByText(post.excerpt).closest('a')).toBeNull()
      expect(screen.getByText('Author Lastname').closest('a')).toBeNull()
      expect(screen.getByText('Category 1').closest('a')).toBeNull()
    })
  })
})
