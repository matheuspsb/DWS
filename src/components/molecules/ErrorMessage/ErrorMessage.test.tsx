import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorMessage from './ErrorMessage.tsx'

describe('ErrorMessage', () => {
  it('announces the message as an alert', () => {
    render(<ErrorMessage message="Something failed" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Something failed')
  })

  it('offers to try again only when it can', async () => {
    const onRetry = vi.fn()
    const { rerender } = render(<ErrorMessage message="Something failed" />)
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()

    rerender(<ErrorMessage message="Something failed" onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
