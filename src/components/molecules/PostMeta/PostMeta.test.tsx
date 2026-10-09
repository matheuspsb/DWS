import { render, screen } from '@testing-library/react'
import PostMeta from './PostMeta.tsx'

describe('PostMeta', () => {
  it('shows the formatted date and the author', () => {
    render(<PostMeta date="2024-01-20" author="Author Lastname" />)

    expect(screen.getByText('Jan 20, 2024')).toBeInTheDocument()
    expect(screen.getByText('Author Lastname')).toBeInTheDocument()
  })

  it('exposes the machine readable date', () => {
    render(<PostMeta date="2024-01-20" author="Author Lastname" />)

    expect(screen.getByText('Jan 20, 2024')).toHaveAttribute('datetime', '2024-01-20')
  })

  it('falls back to the raw text for an invalid date', () => {
    render(<PostMeta date="soon" author="Author Lastname" />)

    expect(screen.getByText('soon')).toBeInTheDocument()
  })
})
