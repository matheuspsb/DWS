import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button.tsx'

describe('Button', () => {
  it('renders its label as an accessible button', () => {
    render(<Button>Apply filters</Button>)

    expect(screen.getByRole('button', { name: 'Apply filters' })).toBeInTheDocument()
  })

  it('does not submit forms by default', () => {
    render(<Button>Apply filters</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('allows another type', () => {
    render(<Button type="submit">Apply filters</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  describe('variants', () => {
    it('is primary by default', () => {
      render(<Button>Apply filters</Button>)

      expect(screen.getByRole('button')).toHaveClass('button', 'button--primary')
    })

    it('can be secondary', () => {
      render(<Button variant="secondary">Back</Button>)

      expect(screen.getByRole('button')).toHaveClass('button--secondary')
      expect(screen.getByRole('button')).not.toHaveClass('button--primary')
    })

    it('can fill the width of its container', () => {
      render(<Button fullWidth>Apply filters</Button>)

      expect(screen.getByRole('button')).toHaveClass('button--full-width')
    })

    it('hugs its content by default', () => {
      render(<Button>Apply filters</Button>)

      expect(screen.getByRole('button')).not.toHaveClass('button--full-width')
    })

    it('can be compact on mobile', () => {
      render(<Button compactOnMobile>Back</Button>)

      expect(screen.getByRole('button')).toHaveClass('button--compact-on-mobile')
    })

    it('keeps the regular size on every screen by default', () => {
      render(<Button>Back</Button>)

      expect(screen.getByRole('button')).not.toHaveClass('button--compact-on-mobile')
    })
  })

  describe('start icon', () => {
    it('renders the icon before the label', () => {
      render(
        <Button variant="secondary" startIcon={<svg data-testid="icon" />}>
          Back
        </Button>,
      )

      const button = screen.getByRole('button', { name: 'Back' })
      expect(button.firstElementChild).toBe(screen.getByTestId('icon'))
    })

    it('renders only the label without an icon', () => {
      render(<Button>Back</Button>)

      expect(screen.getByRole('button').children).toHaveLength(0)
    })
  })

  describe('behavior', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn()
      render(<Button onClick={onClick}>Apply filters</Button>)

      await userEvent.click(screen.getByRole('button'))

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('can be activated with the keyboard', async () => {
      const onClick = vi.fn()
      render(<Button onClick={onClick}>Apply filters</Button>)

      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard(' ')

      expect(onClick).toHaveBeenCalledTimes(2)
    })

    it('does not fire when disabled', async () => {
      const onClick = vi.fn()
      render(
        <Button disabled onClick={onClick}>
          Apply filters
        </Button>,
      )

      await userEvent.click(screen.getByRole('button'))

      expect(screen.getByRole('button')).toBeDisabled()
      expect(onClick).not.toHaveBeenCalled()
    })

    it('forwards native attributes', () => {
      render(<Button aria-label="Close the filters">X</Button>)

      expect(screen.getByRole('button', { name: 'Close the filters' })).toBeInTheDocument()
    })
  })
})
