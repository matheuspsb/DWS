import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IconButton from './IconButton.tsx'

const icon = <svg data-testid="icon" aria-hidden="true" />

describe('IconButton', () => {
  it('is named by its label, since it has no visible text', () => {
    render(<IconButton label="Search">{icon}</IconButton>)

    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('renders the given icon', () => {
    render(<IconButton label="Search">{icon}</IconButton>)

    expect(screen.getByRole('button')).toContainElement(screen.getByTestId('icon'))
  })

  it('does not submit forms by default', () => {
    render(<IconButton label="Search">{icon}</IconButton>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('can submit a form', () => {
    render(
      <IconButton label="Search" type="submit">
        {icon}
      </IconButton>,
    )

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  describe('behavior', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn()
      render(
        <IconButton label="Search" onClick={onClick}>
          {icon}
        </IconButton>,
      )

      await userEvent.click(screen.getByRole('button'))

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('can be activated with the keyboard', async () => {
      const onClick = vi.fn()
      render(
        <IconButton label="Search" onClick={onClick}>
          {icon}
        </IconButton>,
      )

      await userEvent.tab()
      await userEvent.keyboard('{Enter}')

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('does not fire when disabled', async () => {
      const onClick = vi.fn()
      render(
        <IconButton label="Search" onClick={onClick} disabled>
          {icon}
        </IconButton>,
      )

      await userEvent.click(screen.getByRole('button'))

      expect(onClick).not.toHaveBeenCalled()
    })
  })
})
