import { render, screen, within } from '@testing-library/react'
import { posts } from '../../../test/fixtures.ts'
import PostArticle from './PostArticle.tsx'

const post = {
  ...posts[0],
  content: 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.',
}

describe('PostArticle', () => {
  it('has the title as the main heading', () => {
    render(<PostArticle post={post} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tech Innovations in Healthcare' }),
    ).toBeInTheDocument()
  })

  it('says who wrote it and when', () => {
    render(<PostArticle post={post} />)

    expect(screen.getByText(/Written by:/)).toHaveTextContent('Written by: Grace Doe')
    expect(screen.getByText('Mar 1, 2024')).toBeInTheDocument()
  })

  it('shows the cover with a text alternative', () => {
    render(<PostArticle post={post} />)

    expect(
      screen.getByRole('img', { name: 'Cover of Tech Innovations in Healthcare' }),
    ).toHaveAttribute('src', 'one.jpg')
  })

  it('uses the fallback cover when the post has none', () => {
    render(<PostArticle post={{ ...post, thumbnail_url: '' }} />)

    expect(screen.getByRole('img', { name: /Cover of/ })).not.toHaveAttribute('src', '')
  })

  it('splits the content into paragraphs', () => {
    const { container } = render(<PostArticle post={post} />)

    const body = container.querySelector('.post-article__body') as HTMLElement
    expect(within(body).getAllByText(/paragraph\./)).toHaveLength(3)
  })
})
