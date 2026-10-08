import Tag from '../../atoms/Tag/Tag.tsx'
import './TagList.scss'

interface TagListProps {
  items: string[]
  label: string
}

export default function TagList({ items, label }: TagListProps) {
  if (items.length === 0) return null

  return (
    <ul className="tag-list" aria-label={label}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  )
}
