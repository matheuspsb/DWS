import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLocation } from 'react-router-dom'
import { mockApi } from '../../test/mockApi.ts'
import { renderWithProviders } from '../../test/renderWithProviders.tsx'
import PostList from './PostList.tsx'

vi.mock('../../services/api.ts', () => ({ api: vi.fn() }))

function Location() {
  const { pathname, search } = useLocation()
  return <div data-testid="location">{pathname + search}</div>
}

const renderPage = (route = '/') =>
  renderWithProviders(
    <>
      <PostList />
      <Location />
    </>,
    route,
  )

const panel = () => screen.getByRole('form', { name: 'Filters' })
const location = () => screen.getByTestId('location')

beforeEach(() => mockApi())

describe('PostList', () => {
  describe('loading the posts', () => {
    it('says it is loading, then shows the posts', async () => {
      renderPage()

      expect(screen.getByRole('status')).toHaveTextContent('Loading posts')
      expect(screen.queryAllByRole('article')).toHaveLength(0)
      expect(await screen.findAllByRole('article')).toHaveLength(3)
      expect(screen.getByRole('heading', { level: 1, name: 'DWS blog' })).toBeInTheDocument()
    })

    it('shows what the api returned in each card', async () => {
      renderPage()

      const card = (await screen.findAllByRole('article'))[0]
      expect(
        within(card).getByRole('link', { name: 'Tech Innovations in Healthcare' }),
      ).toHaveAttribute('href', '/posts/p1')
      expect(within(card).getByText('Grace Doe')).toBeInTheDocument()
      expect(within(card).getByText('Technology')).toBeInTheDocument()
    })

    it('shows an error with a way to try again', async () => {
      mockApi({ postsFailures: 1 })
      renderPage()

      expect(await screen.findByRole('alert')).toHaveTextContent('could not load the posts')

      await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

      expect(await screen.findAllByRole('article')).toHaveLength(3)
    })

    it('says when no post matches', async () => {
      renderPage('/?q=zzz')

      expect(await screen.findByText('No posts match your filters.')).toBeInTheDocument()
    })
  })

  describe('filters', () => {
    it('has the panel with the groups and options from the api', async () => {
      renderPage()

      const category = within(panel()).getByRole('group', { name: 'Category' })
      expect(
        await within(category).findByRole('checkbox', { name: 'Technology' }),
      ).toBeInTheDocument()
      const author = within(panel()).getByRole('group', { name: 'Author' })
      expect(within(author).getByRole('checkbox', { name: 'Jack Smith' })).toBeInTheDocument()
    })

    it('has the dropdown filters and the sort button too', async () => {
      renderPage()

      expect(await screen.findByRole('button', { name: 'Category' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Author' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sort: Newest first' })).toBeInTheDocument()
    })

    it('applies the panel selection to the url and the list', async () => {
      renderPage()
      await screen.findAllByRole('article')

      await userEvent.click(within(panel()).getByRole('checkbox', { name: 'Science' }))
      expect(screen.getAllByRole('article')).toHaveLength(3)

      await userEvent.click(within(panel()).getByRole('button', { name: 'Apply filters' }))

      expect(location()).toHaveTextContent('/?category=c2')
      expect(screen.getAllByRole('article')).toHaveLength(1)
      expect(screen.getByRole('button', { name: 'Category: Science' })).toBeInTheDocument()
    })

    it('mirrors a dropdown choice in the panel and the url right away', async () => {
      renderPage()
      await screen.findAllByRole('article')

      await userEvent.click(screen.getByRole('button', { name: 'Category' }))
      const dropdown = screen
        .getAllByRole('group', { name: 'Category' })
        .find((group) => !panel().contains(group))!
      await userEvent.click(within(dropdown).getByRole('checkbox', { name: 'Technology' }))

      expect(within(panel()).getByRole('checkbox', { name: 'Technology' })).toBeChecked()
      expect(location()).toHaveTextContent('/?category=c1')
    })

    it('starts from the filters that are in the url', async () => {
      renderPage('/?author=a2&sort=oldest')

      expect(await screen.findAllByRole('article')).toHaveLength(1)
      expect(screen.getByRole('button', { name: 'Author: Jack Smith' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sort: Oldest first' })).toBeInTheDocument()
    })

    it('puts the sort order in the url and reverses the list', async () => {
      renderPage()
      await screen.findAllByRole('article')

      await userEvent.click(screen.getByRole('button', { name: 'Sort: Newest first' }))

      expect(location()).toHaveTextContent('/?sort=oldest')
      const first = screen.getAllByRole('article')[0]
      expect(within(first).getByRole('heading')).toHaveTextContent('A Walk Through Lisbon')
    })
  })
})
