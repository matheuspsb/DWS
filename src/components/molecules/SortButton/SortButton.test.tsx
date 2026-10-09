import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { SortOrder } from '../../../utils/postFilters.ts'
import SortButton from './SortButton.tsx'

describe('SortButton', () => {
  it('starts with the newest posts first', () => {
    render(<SortButton />)

    expect(screen.getByText('Newest first')).toBeInTheDocument()
  })

  it('names the control and keeps the visible text in its accessible name', () => {
    render(<SortButton />)

    expect(screen.getByRole('button', { name: 'Sort: Newest first' })).toBeInTheDocument()
  })

  it('can start with the oldest posts first', () => {
    render(<SortButton defaultValue="oldest" />)

    expect(screen.getByRole('button', { name: 'Sort: Oldest first' })).toBeInTheDocument()
  })

  describe('toggling', () => {
    it('switches between newest and oldest on every click', async () => {
      render(<SortButton />)
      const button = screen.getByRole('button')

      await userEvent.click(button)
      expect(screen.getByRole('button', { name: 'Sort: Oldest first' })).toBeInTheDocument()

      await userEvent.click(button)
      expect(screen.getByRole('button', { name: 'Sort: Newest first' })).toBeInTheDocument()
    })

    it('reports the new order', async () => {
      const onChange = vi.fn()
      render(<SortButton onChange={onChange} />)

      await userEvent.click(screen.getByRole('button'))
      await userEvent.click(screen.getByRole('button'))

      expect(onChange).toHaveBeenNthCalledWith(1, 'oldest')
      expect(onChange).toHaveBeenNthCalledWith(2, 'newest')
    })

    it('can be toggled with the keyboard', async () => {
      render(<SortButton />)

      await userEvent.tab()
      await userEvent.keyboard('{Enter}')

      expect(screen.getByRole('button', { name: 'Sort: Oldest first' })).toBeInTheDocument()
    })
  })

  describe('controlled mode', () => {
    it('only changes when the parent does', async () => {
      const onChange = vi.fn()
      render(<SortButton value="newest" onChange={onChange} />)

      await userEvent.click(screen.getByRole('button'))

      expect(onChange).toHaveBeenCalledWith('oldest')
      expect(screen.getByRole('button', { name: 'Sort: Newest first' })).toBeInTheDocument()
    })

    it('follows the parent state', async () => {
      function Parent() {
        const [order, setOrder] = useState<SortOrder>('newest')
        return <SortButton value={order} onChange={setOrder} />
      }
      render(<Parent />)

      await userEvent.click(screen.getByRole('button'))

      expect(screen.getByRole('button', { name: 'Sort: Oldest first' })).toBeInTheDocument()
    })
  })
})
