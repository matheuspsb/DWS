import { useState } from 'react'
import Button from '../../components/atoms/Button/Button.tsx'
import SortButton from '../../components/molecules/SortButton/SortButton.tsx'
import FilterDropdown from '../../components/organisms/FilterDropdown/FilterDropdown.tsx'
import FilterPanel, {
  type FilterGroupData,
  type FilterSelection,
} from '../../components/organisms/FilterPanel/FilterPanel.tsx'
import PostCard from '../../components/organisms/PostCard/PostCard.tsx'
import { useAuthors } from '../../hooks/useAuthors.ts'
import { useCategories } from '../../hooks/useCategories.ts'
import { usePostFilters } from '../../hooks/usePostFilters.ts'
import { usePosts } from '../../hooks/usePosts.ts'
import { filterPosts } from '../../utils/postFilters.ts'
import './PostList.scss'

export default function PostList() {
  const { filters, updateFilters } = usePostFilters()
  const [draft, setDraft] = useState<FilterSelection | null>(null)
  const posts = usePosts()
  const categories = useCategories()
  const authors = useAuthors()

  const categoryOptions = (categories.data ?? []).map(({ id, name }) => ({ id, label: name }))
  const authorOptions = (authors.data ?? []).map(({ id, name }) => ({ id, label: name }))
  const filterGroups: FilterGroupData[] = [
    { id: 'category', title: 'Category', choices: categoryOptions },
    { id: 'author', title: 'Author', choices: authorOptions },
  ]
  const applied: FilterSelection = { category: filters.categories, author: filters.authors }

  const apply = ({ category = [], author = [] }: FilterSelection) => {
    setDraft(null)
    updateFilters({ categories: category, authors: author })
  }

  const visiblePosts = filterPosts(posts.data ?? [], filters)

  return (
    <section className="post-list">
      <header className="post-list__header">
        <h1>Posts</h1>
        <div className="post-list__filters">
          <div className="post-list__pills">
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={applied.category}
              onChange={(category) => apply({ ...applied, category })}
            />
            <FilterDropdown
              label="Author"
              options={authorOptions}
              value={applied.author}
              onChange={(author) => apply({ ...applied, author })}
            />
          </div>
          <span className="post-list__sort-label">Sort by:</span>
          <SortButton value={filters.sort} onChange={(sort) => updateFilters({ sort })} />
        </div>
      </header>
      <div className="post-list__body">
        <aside className="post-list__sidebar">
          <FilterPanel
            groups={filterGroups}
            value={draft ?? applied}
            onChange={setDraft}
            onApply={apply}
          />
        </aside>
        <div className="post-list__results">
          {posts.isPending && <p role="status">Loading posts...</p>}
          {posts.isError && (
            <div role="alert" className="post-list__message">
              <p>We could not load the posts.</p>
              <Button variant="secondary" onClick={() => posts.refetch()}>
                Try again
              </Button>
            </div>
          )}
          {posts.isSuccess && visiblePosts.length === 0 && (
            <p role="status">No posts match your filters.</p>
          )}
          {visiblePosts.length > 0 && (
            <ul className="post-list__grid">
              {visiblePosts.map((post) => (
                <li key={post.id} className="post-list__item">
                  <PostCard
                    title={post.title}
                    excerpt={post.content}
                    date={post.createdAt}
                    author={post.author.name}
                    categories={post.categories.map(({ name }) => name)}
                    imageUrl={post.thumbnail_url}
                    to={`/posts/${post.id}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
