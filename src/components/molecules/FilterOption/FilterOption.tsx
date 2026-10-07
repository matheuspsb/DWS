import './FilterOption.scss'

interface FilterOptionProps {
  label: string
  checked: boolean
  onChange: () => void
}

export default function FilterOption({ label, checked, onChange }: FilterOptionProps) {
  return (
    <label className="filter-option">
      <input
        type="checkbox"
        className="filter-option__input"
        checked={checked}
        onChange={onChange}
      />
      <span className="filter-option__label">{label}</span>
    </label>
  )
}
