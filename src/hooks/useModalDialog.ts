import { useRef, useState } from 'react'

interface UseModalDialogOptions {
  initialFocus?: string
}

export function useModalDialog({ initialFocus }: UseModalDialogOptions = {}) {
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

  return { isOpen, open, close, dialogProps: { ref: attach, onClose: () => setIsOpen(false) } }
}
