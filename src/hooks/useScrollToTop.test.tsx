import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter } from 'react-router-dom'
import { useScrollToTop } from './useScrollToTop.ts'

function Page() {
  useScrollToTop()
  return (
    <>
      <Link to="/posts/1">Open post</Link>
      <Link to="/?q=sleep">Search</Link>
    </>
  )
}

const renderPage = () =>
  render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>,
  )

let scrollTo: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

afterEach(() => {
  scrollTo.mockRestore()
})

describe('useScrollToTop', () => {
  it('starts a new page at the top', async () => {
    renderPage()
    scrollTo.mockClear()

    await userEvent.click(screen.getByRole('link', { name: 'Open post' }))

    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('keeps the scroll position when only the filters in the url change', async () => {
    renderPage()
    scrollTo.mockClear()

    await userEvent.click(screen.getByRole('link', { name: 'Search' }))

    expect(scrollTo).not.toHaveBeenCalled()
  })
})
