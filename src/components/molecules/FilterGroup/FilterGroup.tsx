import { useId } from 'react'
import FilterItem from '../FilterItem/FilterItem.tsx'
import './FilterGroup.scss'

export interface FilterChoice {
  id: string
  label: string
}

interface FilterGroupProps {
  title: string
  choices: FilterChoice[]
  selected: string[]
  onToggle: (id: string) => void
}

export default function FilterGroup({ title, choices, selected, onToggle }: FilterGroupProps) {
  const titleId = useId()

  return (
    <div role="group" aria-labelledby={titleId} className="filter-group">
      <h3 id={titleId} className="filter-group__title">
        {title}
      </h3>
      <ul className="filter-group__list">
        {choices.map((choice) => (
          <li key={choice.id}>
            <FilterItem
              label={choice.label}
              checked={selected.includes(choice.id)}
              onChange={() => onToggle(choice.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
