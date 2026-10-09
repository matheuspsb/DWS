import { useControllableState } from '../../../hooks/useControllableState.ts'
import Icon from '../../atoms/Icon/Icon.tsx'
import './SortButton.scss'

export type SortOrder = 'newest' | 'oldest'

const labels: Record<SortOrder, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
}

interface SortButtonProps {
  value?: SortOrder
  defaultValue?: SortOrder
  onChange?: (order: SortOrder) => void
}

export default function SortButton({ value, defaultValue = 'newest', onChange }: SortButtonProps) {
  const [order, setOrder] = useControllableState({ value, defaultValue, onChange })
  const label = labels[order]

  return (
    <button
      type="button"
      className="sort-button"
      aria-label={`Sort: ${label}`}
      onClick={() => setOrder(order === 'newest' ? 'oldest' : 'newest')}
    >
      <span className="sort-button__label" data-label={label}>
        {label}
      </span>
      <Icon name="sort" size={16} />
    </button>
  )
}
