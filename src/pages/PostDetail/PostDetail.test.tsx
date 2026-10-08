import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PostDetail from './PostDetail.tsx'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<p>Post list</p>} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </MemoryRouter>,
  )

describe('PostDetail', () => {
  it('shows the post id', () => {
    renderAt('/posts/3')

    expect(screen.getByRole('heading', { name: 'Post 3' })).toBeInTheDocument()
  })

  it('has a back button that returns to the post list', async () => {
    renderAt('/posts/3')

    await userEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByText('Post list')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Post 3' })).not.toBeInTheDocument()
  })
})
