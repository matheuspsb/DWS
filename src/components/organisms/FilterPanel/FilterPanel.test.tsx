import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import FilterPanel, { type FilterSelection } from './FilterPanel.tsx'

const groups = [
  {
    id: 'category',
    title: 'Category',
    choices: [
      { id: '1', label: 'Category 1' },
      { id: '2', label: 'Category 2' },
    ],
  },
  {
    id: 'author',
    title: 'Author',
    choices: [
      { id: '1', label: 'Author One' },
      { id: '2', label: 'Author Two' },
    ],
  },
]

const renderPanel = (props: Partial<Parameters<typeof FilterPanel>[0]> = {}) =>
  render(<FilterPanel groups={groups} {...props} />)

describe('FilterPanel', () => {
  it('is a form named by its heading', () => {
    renderPanel()

    expect(screen.getByRole('heading', { level: 2, name: 'Filters' })).toBeInTheDocument()
    expect(screen.getByRole('form', { name: 'Filters' })).toBeInTheDocument()
  })

  it('shows one group per entry, in order', () => {
    renderPanel()

    expect(
      screen.getAllByRole('group').map((group) => group.getAttribute('aria-labelledby')),
    ).toHaveLength(2)
    expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Author' })).toBeInTheDocument()
  })

  it('has the apply button', () => {
    renderPanel()

    expect(screen.getByRole('button', { name: 'Apply filters' })).toHaveAttribute('type', 'submit')
  })

  it('starts with nothing selected', () => {
    renderPanel()

    expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(0)
  })

  describe('selecting', () => {
    it('toggles a choice on and off', async () => {
      renderPanel()
      const checkbox = screen.getByRole('checkbox', { name: 'Category 1' })

      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()

      await userEvent.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })

    it('allows several choices in the same group', async () => {
      renderPanel()

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }))
      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 2' }))

      expect(screen.getByRole('checkbox', { name: 'Category 1' })).toBeChecked()
      expect(screen.getByRole('checkbox', { name: 'Category 2' })).toBeChecked()
    })

    it('keeps the groups apart even when the ids repeat', async () => {
      renderPanel()

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }))

      expect(screen.getByRole('checkbox', { name: 'Author One' })).not.toBeChecked()
    })

    it('starts from the default selection', () => {
      renderPanel({ defaultValue: { category: ['2'], author: ['1'] } })

      expect(screen.getByRole('checkbox', { name: 'Category 2' })).toBeChecked()
      expect(screen.getByRole('checkbox', { name: 'Author One' })).toBeChecked()
      expect(screen.getByRole('checkbox', { name: 'Category 1' })).not.toBeChecked()
    })

    it('reports every change with the whole selection', async () => {
      const onChange = vi.fn()
      renderPanel({ onChange })

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }))
      await userEvent.click(screen.getByRole('checkbox', { name: 'Author Two' }))

      expect(onChange).toHaveBeenNthCalledWith(1, { category: ['1'] })
      expect(onChange).toHaveBeenNthCalledWith(2, { category: ['1'], author: ['2'] })
    })
  })

  describe('applying', () => {
    it('only hands the selection over when the button is pressed', async () => {
      const onApply = vi.fn()
      renderPanel({ onApply })

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }))
      expect(onApply).not.toHaveBeenCalled()

      await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
      expect(onApply).toHaveBeenCalledTimes(1)
      expect(onApply).toHaveBeenCalledWith({ category: ['1'] })
    })

    it('applies an empty selection', async () => {
      const onApply = vi.fn()
      renderPanel({ onApply })

      await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }))

      expect(onApply).toHaveBeenCalledWith({})
    })

    it('can be applied with the keyboard', async () => {
      const onApply = vi.fn()
      renderPanel({ onApply, defaultValue: { author: ['1'] } })

      await userEvent.tab()
      await userEvent.tab()
      await userEvent.tab()
      await userEvent.tab()
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')

      expect(onApply).toHaveBeenCalledWith({ author: ['1'] })
    })
  })

  describe('controlled mode', () => {
    it('shows what the parent says and asks it to change', async () => {
      const onChange = vi.fn()
      renderPanel({ value: { category: ['1'] }, onChange })

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 2' }))

      expect(onChange).toHaveBeenCalledWith({ category: ['1', '2'] })
      expect(screen.getByRole('checkbox', { name: 'Category 1' })).toBeChecked()
      expect(screen.getByRole('checkbox', { name: 'Category 2' })).not.toBeChecked()
    })

    it('follows the parent state', async () => {
      function Parent() {
        const [selection, setSelection] = useState<FilterSelection>({})
        return <FilterPanel groups={groups} value={selection} onChange={setSelection} />
      }
      render(<Parent />)

      await userEvent.click(screen.getByRole('checkbox', { name: 'Author Two' }))

      expect(
        within(screen.getByRole('group', { name: 'Author' })).getByRole('checkbox', {
          name: 'Author Two',
        }),
      ).toBeChecked()
    })
  })
})
