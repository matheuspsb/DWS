import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import NotFound from './NotFound.tsx'

describe('NotFound', () => {
  it('says the page does not exist and goes back to the posts', async () => {
    render(
      <MemoryRouter initialEntries={['/nowhere']}>
        <Routes>
          <Route path="/" element={<p>Post list</p>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Go to the posts' }))

    expect(screen.getByText('Post list')).toBeInTheDocument()
  })
})
