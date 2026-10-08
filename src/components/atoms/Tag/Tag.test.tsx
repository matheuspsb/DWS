import { render, screen } from '@testing-library/react'
import Tag from './Tag.tsx'

describe('Tag', () => {
  it('renders its content', () => {
    render(<Tag>Category 1</Tag>)

    expect(screen.getByText('Category 1')).toBeInTheDocument()
  })

  it('uses the tag class', () => {
    render(<Tag>Category 1</Tag>)

    expect(screen.getByText('Category 1')).toHaveClass('tag')
  })
})
