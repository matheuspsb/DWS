import { render, screen, within } from '@testing-library/react'
import TagList from './TagList.tsx'

describe('TagList', () => {
  it('renders one list item per tag with an accessible name', () => {
    render(<TagList items={['Design', 'Tech']} label="Categories" />)

    const list = screen.getByRole('list', { name: 'Categories' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Tech')).toBeInTheDocument()
  })

  it('keeps the given order', () => {
    render(<TagList items={['B', 'A', 'C']} label="Categories" />)

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['B', 'A', 'C'])
  })

  it('supports repeated labels', () => {
    render(<TagList items={['Category 1', 'Category 1']} label="Categories" />)

    expect(screen.getAllByText('Category 1')).toHaveLength(2)
  })

  it('renders nothing when there are no tags', () => {
    render(<TagList items={[]} label="Categories" />)

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
