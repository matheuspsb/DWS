import type { ReactNode } from 'react'
import './Tag.scss'

interface TagProps {
  children: ReactNode
}

export default function Tag({ children }: TagProps) {
  return <span className="tag">{children}</span>
}
