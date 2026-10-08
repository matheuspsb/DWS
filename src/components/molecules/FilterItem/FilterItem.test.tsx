import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterItem from './FilterItem.tsx'

describe('FilterItem', () => {
  it('exposes the label as an accessible checkbox', () => {
    render(<FilterItem label="Category 1" checked={false} onChange={() => {}} />)

    expect(screen.getByRole('checkbox', { name: 'Category 1' })).not.toBeChecked()
  })

  it('reflects the checked state', () => {
    render(<FilterItem label="Category 1" checked onChange={() => {}} />)

    expect(screen.getByRole('checkbox', { name: 'Category 1' })).toBeChecked()
  })

  it('calls onChange when the row is clicked', async () => {
    const onChange = vi.fn()
    render(<FilterItem label="Category 1" checked={false} onChange={onChange} />)

    await userEvent.click(screen.getByText('Category 1'))

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('can be toggled with the keyboard', async () => {
    const onChange = vi.fn()
    render(<FilterItem label="Category 1" checked={false} onChange={onChange} />)

    await userEvent.tab()
    await userEvent.keyboard(' ')

    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
