import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import FilterDropdown from './FilterDropdown.tsx'

const options = [
  { id: '1', label: 'Category 1' },
  { id: '2', label: 'Category 2' },
  { id: '3', label: 'Category 3' },
  { id: '4', label: 'Category 4' },
  { id: '5', label: 'Category 5' },
]

const openDropdown = () => userEvent.click(screen.getByRole('button', { name: 'Category' }))

describe('FilterDropdown', () => {
  describe('opening and closing', () => {
    it('starts closed', () => {
      render(<FilterDropdown label="Category" options={options} />)

      expect(screen.queryByRole('group', { name: 'Category' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Category' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    })

    it('opens the option list when the button is clicked', async () => {
      render(<FilterDropdown label="Category" options={options} />)

      await openDropdown()

      expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument()
      expect(screen.getAllByRole('checkbox')).toHaveLength(5)
      expect(screen.getByRole('button', { name: 'Category' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    })

    it('closes when the button is clicked again', async () => {
      render(<FilterDropdown label="Category" options={options} />)

      await openDropdown()
      await openDropdown()

      expect(screen.queryByRole('group')).not.toBeInTheDocument()
    })

    it('closes on Escape and returns focus to the button', async () => {
      render(<FilterDropdown label="Category" options={options} />)
      await openDropdown()

      await userEvent.keyboard('{Escape}')

      expect(screen.queryByRole('group')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Category' })).toHaveFocus()
    })

    it('closes when clicking outside', async () => {
      render(
        <>
          <FilterDropdown label="Category" options={options} />
          <button>Elsewhere</button>
        </>,
      )
      await openDropdown()

      await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }))

      expect(screen.queryByRole('group')).not.toBeInTheDocument()
    })

    it('closes when keyboard focus leaves the component', async () => {
      render(
        <>
          <FilterDropdown label="Category" options={options} />
          <button>Elsewhere</button>
        </>,
      )
      await openDropdown()

      for (let step = 0; step < options.length; step++) await userEvent.tab()
      expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument()

      await userEvent.tab()

      expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus()
      expect(screen.queryByRole('group')).not.toBeInTheDocument()
    })

    it('stays open while choosing options', async () => {
      render(<FilterDropdown label="Category" options={options} />)
      await openDropdown()

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }))

      expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument()
    })
  })

  describe('selection', () => {
    it('shows the selected values on the button', async () => {
      render(<FilterDropdown label="Category" options={options} />)
      await openDropdown()

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }))
      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 2' }))

      expect(
        screen.getByRole('button', { name: 'Category: Category 1, Category 2' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Category 1' })).toBeChecked()
      expect(screen.getByRole('checkbox', { name: 'Category 3' })).not.toBeChecked()
    })

    it('lists the selected values in the order of the options', async () => {
      render(<FilterDropdown label="Category" options={options} />)
      await openDropdown()

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 3' }))
      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }))

      expect(screen.getByText('Category 1, Category 3')).toBeInTheDocument()
    })

    it('deselects an option when clicked again', async () => {
      render(<FilterDropdown label="Category" options={options} defaultValue={['1']} />)
      await userEvent.click(screen.getByRole('button', { name: 'Category: Category 1' }))

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 1' }))

      expect(screen.getByRole('button', { name: 'Category' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
    })

    it('can be toggled with the keyboard', async () => {
      render(<FilterDropdown label="Category" options={options} />)
      await openDropdown()

      await userEvent.tab()
      await userEvent.keyboard(' ')

      expect(screen.getByRole('checkbox', { name: 'Category 1' })).toBeChecked()
    })

    it('clears the selection and returns focus to the button', async () => {
      render(<FilterDropdown label="Category" options={options} defaultValue={['1', '2']} />)

      await userEvent.click(screen.getByRole('button', { name: 'Clear Category filter' }))

      expect(screen.getByRole('button', { name: 'Category' })).toHaveFocus()
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
    })

    it('closes the open panel when the selection is cleared', async () => {
      render(<FilterDropdown label="Category" options={options} defaultValue={['1', '2']} />)
      await userEvent.click(
        screen.getByRole('button', { name: 'Category: Category 1, Category 2' }),
      )
      expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: 'Clear Category filter' }))

      expect(screen.queryByRole('group')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Category' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    })

    it('ignores unknown ids in the value', () => {
      render(<FilterDropdown label="Category" options={options} value={['999']} />)

      expect(screen.getByRole('button', { name: 'Category' })).toBeInTheDocument()
    })
  })

  describe('onChange', () => {
    it('reports every change with the full selection', async () => {
      const onChange = vi.fn()
      render(<FilterDropdown label="Category" options={options} onChange={onChange} />)
      await openDropdown()

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 2' }))
      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 4' }))

      expect(onChange).toHaveBeenNthCalledWith(1, ['2'])
      expect(onChange).toHaveBeenNthCalledWith(2, ['2', '4'])
    })

    it('reports an empty selection when cleared', async () => {
      const onChange = vi.fn()
      render(
        <FilterDropdown
          label="Category"
          options={options}
          defaultValue={['1']}
          onChange={onChange}
        />,
      )

      await userEvent.click(screen.getByRole('button', { name: 'Clear Category filter' }))

      expect(onChange).toHaveBeenCalledWith([])
    })
  })

  describe('controlled mode', () => {
    it('renders the provided value and only changes when the parent does', async () => {
      const onChange = vi.fn()
      render(
        <FilterDropdown label="Category" options={options} value={['1']} onChange={onChange} />,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Category: Category 1' }))

      await userEvent.click(screen.getByRole('checkbox', { name: 'Category 2' }))

      expect(onChange).toHaveBeenCalledWith(['1', '2'])
      expect(screen.getByRole('checkbox', { name: 'Category 2' })).not.toBeChecked()
    })

    it('follows the parent state', async () => {
      function Parent() {
        const [value, setValue] = useState<string[]>([])
        return (
          <>
            <FilterDropdown label="Category" options={options} value={value} onChange={setValue} />
            <button onClick={() => setValue(['5'])}>Select last</button>
          </>
        )
      }
      render(<Parent />)

      await userEvent.click(screen.getByRole('button', { name: 'Select last' }))

      expect(screen.getByRole('button', { name: 'Category: Category 5' })).toBeInTheDocument()
    })
  })

  it('works with several independent instances', async () => {
    render(
      <>
        <FilterDropdown label="Category" options={options} />
        <FilterDropdown label="Author" options={[{ id: 'a', label: 'Author Lastname' }]} />
      </>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Author' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Author Lastname' }))

    expect(screen.getByRole('button', { name: 'Author: Author Lastname' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Category' })).toBeInTheDocument()
  })
})
