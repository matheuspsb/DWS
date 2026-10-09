import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useModalDialog } from './useModalDialog.ts'

function Harness({ initialFocus, onClose }: { initialFocus?: string; onClose?: () => void }) {
  const modal = useModalDialog({ initialFocus, onClose })
  return (
    <>
      <button onClick={modal.open}>Open</button>
      <button onClick={modal.close}>Close from outside</button>
      {modal.isOpen && (
        <dialog {...modal.dialogProps} aria-label="Demo">
          <button onClick={modal.close}>Close</button>
          <input aria-label="Name" />
        </dialog>
      )}
    </>
  )
}

describe('useModalDialog', () => {
  it('starts closed', () => {
    render(<Harness />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the dialog as a modal', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('dialog', { name: 'Demo' })).toHaveAttribute('open')
  })

  it('closes with the close function', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('follows the browser closing the dialog, like with Escape', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    fireEvent(screen.getByRole('dialog'), new Event('close'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('can be opened again after it was closed', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('dialog', { name: 'Demo' })).toBeInTheDocument()
  })

  it('does nothing when closing a dialog that is not open', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Close from outside' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('tells when it closes, however it was closed', async () => {
    const onClose = vi.fn()
    render(<Harness onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    fireEvent(screen.getByRole('dialog'), new Event('close'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when the backdrop is clicked, but not when the content is', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    await userEvent.click(screen.getByRole('textbox', { name: 'Name' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('dialog'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  describe('initial focus', () => {
    it('focuses the element that matches the selector', async () => {
      render(<Harness initialFocus="input" />)

      await userEvent.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus()
    })

    it('leaves the focus alone without a selector', async () => {
      render(<Harness />)

      await userEvent.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveFocus()
    })
  })
})
