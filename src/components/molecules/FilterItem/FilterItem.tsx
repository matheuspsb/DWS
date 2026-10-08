import './FilterItem.scss'

interface FilterItemProps {
  label: string
  checked: boolean
  onChange: () => void
}

export default function FilterItem({ label, checked, onChange }: FilterItemProps) {
  return (
    <label className="filter-item">
      <input type="checkbox" className="filter-item__input" checked={checked} onChange={onChange} />
      <span className="filter-item__label">{label}</span>
    </label>
  )
}
