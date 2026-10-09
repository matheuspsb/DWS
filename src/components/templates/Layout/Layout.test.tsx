import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout.tsx'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<p>Page content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

describe('Layout', () => {
  it('shows the header and the page inside the main area', () => {
    renderAt('/')

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveTextContent('Page content')
  })

  it('marks the post pages, which have their own background', () => {
    const { container, unmount } = renderAt('/posts/p1')
    expect(container.firstElementChild).toHaveClass('layout--post')
    unmount()

    const home = renderAt('/')
    expect(home.container.firstElementChild).not.toHaveClass('layout--post')
  })
})
