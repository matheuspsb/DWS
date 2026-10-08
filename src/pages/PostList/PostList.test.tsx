import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PostList from './PostList.tsx'

const renderPage = () =>
  render(
    <MemoryRouter>
      <PostList />
    </MemoryRouter>,
  )

const panel = () => screen.getByRole('form', { name: 'Filters' })

describe('PostList', () => {
  it('shows the page title and the posts', () => {
    renderPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Posts' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(6)
  })

  it('has the filters panel with both groups', () => {
    renderPage()

    expect(within(panel()).getByRole('group', { name: 'Category' })).toBeInTheDocument()
    expect(within(panel()).getByRole('group', { name: 'Author' })).toBeInTheDocument()
  })

  it('has the dropdown filters and the sort button too', () => {
    renderPage()

    expect(screen.getByRole('button', { name: 'Category' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Author' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sort: Newest first' })).toBeInTheDocument()
  })

  describe('shared filter state', () => {
    it('applies the panel selection to the dropdowns when the button is pressed', async () => {
      renderPage()

      await userEvent.click(within(panel()).getByRole('checkbox', { name: 'Category 2' }))
      expect(screen.getByRole('button', { name: 'Category' })).toBeInTheDocument()

      await userEvent.click(within(panel()).getByRole('button', { name: 'Apply filters' }))

      expect(screen.getByRole('button', { name: 'Category: Category 2' })).toBeInTheDocument()
    })

    it('mirrors a dropdown choice in the panel right away', async () => {
      renderPage()

      await userEvent.click(screen.getByRole('button', { name: 'Category' }))
      const dropdown = screen
        .getAllByRole('group', { name: 'Category' })
        .find((group) => !panel().contains(group))!
      await userEvent.click(within(dropdown).getByRole('checkbox', { name: 'Category 3' }))

      expect(within(panel()).getByRole('checkbox', { name: 'Category 3' })).toBeChecked()
    })
  })
})
