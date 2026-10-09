import { useRef, useState, type MouseEvent } from 'react'

interface UseModalDialogOptions {
  initialFocus?: string
  onClose?: () => void
}

export function useModalDialog({ initialFocus, onClose }: UseModalDialogOptions = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  const open = () => setIsOpen(true)
  const close = () => dialogRef.current?.close()

  const attach = (dialog: HTMLDialogElement | null) => {
    dialogRef.current = dialog
    if (!dialog || dialog.open) return
    dialog.showModal()
    if (initialFocus) dialog.querySelector<HTMLElement>(initialFocus)?.focus()
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const closeOnBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close()
  }

  return {
    isOpen,
    open,
    close,
    dialogProps: { ref: attach, onClose: handleClose, onClick: closeOnBackdropClick },
  }
}
