import { useId, type SubmitEvent } from 'react'
import { useControllableState } from '../../../hooks/useControllableState.ts'
import { toggleItem } from '../../../utils/toggleItem.ts'
import Button from '../../atoms/Button/Button.tsx'
import Icon from '../../atoms/Icon/Icon.tsx'
import FilterGroup, { type FilterChoice } from '../../molecules/FilterGroup/FilterGroup.tsx'
import './FilterPanel.scss'

export type FilterSelection = Record<string, string[]>

export interface FilterGroupData {
  id: string
  title: string
  choices: FilterChoice[]
}

interface FilterPanelProps {
  groups: FilterGroupData[]
  value?: FilterSelection
  defaultValue?: FilterSelection
  onChange?: (value: FilterSelection) => void
  onApply?: (value: FilterSelection) => void
}

export default function FilterPanel({
  groups,
  value,
  defaultValue = {},
  onChange,
  onApply,
}: FilterPanelProps) {
  const [selection, setSelection] = useControllableState({ value, defaultValue, onChange })
  const titleId = useId()

  const toggle = (groupId: string, choiceId: string) => {
    setSelection({ ...selection, [groupId]: toggleItem(selection[groupId] ?? [], choiceId) })
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    onApply?.(selection)
  }

  return (
    <form aria-labelledby={titleId} className="filter-panel" onSubmit={handleSubmit}>
      <div className="filter-panel__header">
        <Icon name="filters" />
        <h2 id={titleId} className="filter-panel__title">
          Filters
        </h2>
      </div>
      <div className="filter-panel__groups">
        {groups.map((group) => (
          <FilterGroup
            key={group.id}
            title={group.title}
            choices={group.choices}
            selected={selection[group.id] ?? []}
            onToggle={(choiceId) => toggle(group.id, choiceId)}
          />
        ))}
      </div>
      <div className="filter-panel__apply">
        <Button type="submit" fullWidth>
          Apply filters
        </Button>
      </div>
    </form>
  )
}
