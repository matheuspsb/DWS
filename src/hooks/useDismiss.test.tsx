import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { useDismiss } from './useDismiss.ts'

function Harness({ active, onDismiss }: { active: boolean; onDismiss: (reason: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(ref, active, onDismiss)
  return (
    <div>
      <div ref={ref}>
        <button>inside</button>
      </div>
      <button>outside</button>
    </div>
  )
}

describe('useDismiss', () => {
  it('reports presses outside the element', async () => {
    const onDismiss = vi.fn()
    render(<Harness active onDismiss={onDismiss} />)

    await userEvent.click(screen.getByText('outside'))

    expect(onDismiss).toHaveBeenCalledWith('outside')
  })

  it('ignores presses inside the element', async () => {
    const onDismiss = vi.fn()
    render(<Harness active onDismiss={onDismiss} />)

    await userEvent.click(screen.getByText('inside'))

    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('reports the Escape key', async () => {
    const onDismiss = vi.fn()
    render(<Harness active onDismiss={onDismiss} />)

    await userEvent.keyboard('{Escape}')

    expect(onDismiss).toHaveBeenCalledWith('escape')
  })

  it('does nothing while inactive', async () => {
    const onDismiss = vi.fn()
    render(<Harness active={false} onDismiss={onDismiss} />)

    await userEvent.click(screen.getByText('outside'))
    await userEvent.keyboard('{Escape}')

    expect(onDismiss).not.toHaveBeenCalled()
  })
})
