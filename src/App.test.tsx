import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App.tsx'

describe('App routing', () => {
  it('renders the post list on the home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Posts' })).toBeInTheDocument()
  })

  it('renders the post detail on /posts/:id', () => {
    render(
      <MemoryRouter initialEntries={['/posts/3']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Post 3' })).toBeInTheDocument()
  })
})
