import { render, screen } from '@testing-library/react'
import Logo from './Logo.tsx'

describe('Logo', () => {
  it('is an image named after the brand', () => {
    render(<Logo />)

    expect(screen.getByRole('img', { name: 'Dentsu World Services' })).toBeInTheDocument()
  })
})
