import { useState } from 'react'
import SortButton from '../../components/molecules/SortButton/SortButton.tsx'
import FilterDropdown from '../../components/organisms/FilterDropdown/FilterDropdown.tsx'
import FilterPanel, {
  type FilterGroupData,
  type FilterSelection,
} from '../../components/organisms/FilterPanel/FilterPanel.tsx'
import PostCard from '../../components/organisms/PostCard/PostCard.tsx'
import './PostList.scss'

const categoryOptions = Array.from({ length: 5 }, (_, index) => ({
  id: String(index + 1),
  label: `Category ${index + 1}`,
}))
const authorOptions = Array.from({ length: 5 }, (_, index) => ({
  id: String(index + 1),
  label: 'Author Lastname',
}))
const filterGroups: FilterGroupData[] = [
  { id: 'category', title: 'Category', choices: categoryOptions },
  { id: 'author', title: 'Author', choices: authorOptions },
]
const posts = Array.from({ length: 6 }, (_, index) => ({
  id: String(index + 1),
  title: 'This is the title of the article with two lines',
  excerpt:
    'Lorem ipsum dolor sit amet consectetur. Donec sed faucibus sit id viverra. Etiam dapibus tellus quis nisl.',
  date: '2024-01-20',
  author: 'Author Lastname',
  categories: ['Category 1', 'Category 1'],
}))

export default function PostList() {
  const [applied, setApplied] = useState<FilterSelection>({})
  const [draft, setDraft] = useState<FilterSelection>({})

  const changeGroup = (groupId: string) => (choiceIds: string[]) => {
    const next = { ...applied, [groupId]: choiceIds }
    setApplied(next)
    setDraft(next)
  }

  return (
    <section className="post-list">
      <header className="post-list__header">
        <h1>Posts</h1>
        <div className="post-list__filters">
          <div className="post-list__pills">
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={applied.category ?? []}
              onChange={changeGroup('category')}
            />
            <FilterDropdown
              label="Author"
              options={authorOptions}
              value={applied.author ?? []}
              onChange={changeGroup('author')}
            />
          </div>
          <span className="post-list__sort-label">Sort by:</span>
          <SortButton />
        </div>
      </header>
      <div className="post-list__body">
        <aside className="post-list__sidebar">
          <FilterPanel
            groups={filterGroups}
            value={draft}
            onChange={setDraft}
            onApply={setApplied}
          />
        </aside>
        <ul className="post-list__grid">
          {posts.map(({ id, ...post }) => (
            <li key={id} className="post-list__item">
              <PostCard {...post} to={`/posts/${id}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
