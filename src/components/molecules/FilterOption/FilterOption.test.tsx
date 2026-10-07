import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterOption from './FilterOption.tsx'

describe('FilterOption', () => {
  it('exposes the label as an accessible checkbox', () => {
    render(<FilterOption label="Category 1" checked={false} onChange={() => {}} />)

    expect(screen.getByRole('checkbox', { name: 'Category 1' })).not.toBeChecked()
  })

  it('reflects the checked state', () => {
    render(<FilterOption label="Category 1" checked onChange={() => {}} />)

    expect(screen.getByRole('checkbox', { name: 'Category 1' })).toBeChecked()
  })

  it('calls onChange when the label is clicked', async () => {
    const onChange = vi.fn()
    render(<FilterOption label="Category 1" checked={false} onChange={onChange} />)

    await userEvent.click(screen.getByText('Category 1'))

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('can be toggled with the keyboard', async () => {
    const onChange = vi.fn()
    render(<FilterOption label="Category 1" checked={false} onChange={onChange} />)

    await userEvent.tab()
    await userEvent.keyboard(' ')

    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
