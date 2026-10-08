import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterGroup from './FilterGroup.tsx'

const choices = [
  { id: '1', label: 'Category 1' },
  { id: '2', label: 'Category 2' },
  { id: '3', label: 'Category 3' },
]

const renderGroup = (props: Partial<Parameters<typeof FilterGroup>[0]> = {}) =>
  render(
    <FilterGroup title="Category" choices={choices} selected={[]} onToggle={() => {}} {...props} />,
  )

describe('FilterGroup', () => {
  it('is a group named after its title', () => {
    renderGroup()

    expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Category' })).toBeInTheDocument()
  })

  it('lists one checkbox per choice, in order', () => {
    renderGroup()

    const group = screen.getByRole('group', { name: 'Category' })
    expect(
      within(group)
        .getAllByRole('checkbox')
        .map((checkbox) => checkbox.parentElement?.textContent),
    ).toEqual(['Category 1', 'Category 2', 'Category 3'])
  })

  it('checks the selected choices only', () => {
    renderGroup({ selected: ['2'] })

    expect(screen.getByRole('checkbox', { name: 'Category 2' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Category 1' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Category 3' })).not.toBeChecked()
  })

  it('reports the id of the toggled choice', async () => {
    const onToggle = vi.fn()
    renderGroup({ onToggle })

    await userEvent.click(screen.getByRole('checkbox', { name: 'Category 3' }))

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('3')
  })

  it('ignores selected ids that are not choices', () => {
    renderGroup({ selected: ['999'] })

    expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(0)
  })

  it('keeps two groups independent', () => {
    render(
      <>
        <FilterGroup title="Category" choices={choices} selected={[]} onToggle={() => {}} />
        <FilterGroup
          title="Author"
          choices={[{ id: 'a', label: 'Author Lastname' }]}
          selected={[]}
          onToggle={() => {}}
        />
      </>,
    )

    expect(screen.getByRole('group', { name: 'Category' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Author' })).toBeInTheDocument()
  })
})
