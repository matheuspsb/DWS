import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DropdownButton from './DropdownButton.tsx'

describe('DropdownButton', () => {
  describe('default state', () => {
    it('shows the label and no clear button', () => {
      render(<DropdownButton label="Category" onToggle={() => {}} />)

      expect(screen.getByRole('button', { name: 'Category' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
    })

    it('is collapsed and not marked as selected', () => {
      const { container } = render(<DropdownButton label="Category" onToggle={() => {}} />)

      expect(screen.getByRole('button', { name: 'Category' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
      expect(container.firstChild).not.toHaveClass('dropdown-button--selected')
    })

    it('calls onToggle when clicked', async () => {
      const onToggle = vi.fn()
      render(<DropdownButton label="Category" onToggle={onToggle} />)

      await userEvent.click(screen.getByRole('button', { name: 'Category' }))

      expect(onToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('open state', () => {
    it('is expanded and points to the panel', () => {
      const { container } = render(
        <DropdownButton label="Category" isOpen panelId="panel-1" onToggle={() => {}} />,
      )
      const toggle = screen.getByRole('button', { name: 'Category' })

      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(toggle).toHaveAttribute('aria-controls', 'panel-1')
      expect(container.firstChild).toHaveClass('dropdown-button--open')
    })
  })

  describe('selected state', () => {
    const renderSelected = (onClear = () => {}) =>
      render(
        <DropdownButton
          label="Category"
          selectedLabels={['Category 1', 'Category 2']}
          onToggle={() => {}}
          onClear={onClear}
        />,
      )

    it('shows the selected values joined by comma', () => {
      renderSelected()

      expect(screen.getByText('Category 1, Category 2')).toBeInTheDocument()
    })

    it('keeps the filter name in the accessible name', () => {
      renderSelected()

      expect(
        screen.getByRole('button', { name: 'Category: Category 1, Category 2' }),
      ).toBeInTheDocument()
    })

    it('replaces the chevron with a clear button', () => {
      const { container } = renderSelected()

      expect(screen.getByRole('button', { name: 'Clear Category filter' })).toBeInTheDocument()
      expect(container.querySelector('.icon--chevron-down')).not.toBeInTheDocument()
      expect(container.firstChild).toHaveClass('dropdown-button--selected')
    })

    it('clears without toggling the panel', async () => {
      const onClear = vi.fn()
      const onToggle = vi.fn()
      render(
        <DropdownButton
          label="Category"
          selectedLabels={['Category 1']}
          onToggle={onToggle}
          onClear={onClear}
        />,
      )

      await userEvent.click(screen.getByRole('button', { name: 'Clear Category filter' }))

      expect(onClear).toHaveBeenCalledTimes(1)
      expect(onToggle).not.toHaveBeenCalled()
    })
  })
})
