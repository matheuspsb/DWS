import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { posts } from '../../../test/fixtures.ts'
import { renderWithProviders } from '../../../test/renderWithProviders.tsx'
import PostGrid from './PostGrid.tsx'

describe('PostGrid', () => {
  it('shows a card for each post', () => {
    renderWithProviders(<PostGrid posts={posts} />)

    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'The Science of Sleep' })).toHaveAttribute(
      'href',
      '/posts/p2',
    )
  })

  it('says it is loading and shows no card yet', () => {
    renderWithProviders(<PostGrid posts={[]} isLoading />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading posts')
    expect(screen.queryAllByRole('article')).toHaveLength(0)
  })

  it('says when there is nothing to show', () => {
    renderWithProviders(<PostGrid posts={[]} />)

    expect(screen.getByRole('status')).toHaveTextContent('No posts match your filters.')
  })

  it('offers a retry when the request failed', async () => {
    const onRetry = vi.fn()
    renderWithProviders(<PostGrid posts={[]} isError onRetry={onRetry} />)

    expect(screen.getByRole('alert')).toHaveTextContent('could not load the posts')
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
