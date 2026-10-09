import SortButton from '../../components/molecules/SortButton/SortButton.tsx'
import FilterDropdown from '../../components/organisms/FilterDropdown/FilterDropdown.tsx'
import FilterPanel from '../../components/organisms/FilterPanel/FilterPanel.tsx'
import PostGrid from '../../components/organisms/PostGrid/PostGrid.tsx'
import { usePosts } from '../../hooks/usePosts.ts'
import { filterPosts } from '../../utils/postFilters.ts'
import { usePostListFilters } from './hooks/usePostListFilters.ts'
import './PostList.scss'

export default function PostList() {
  const {
    filters,
    updateFilters,
    groups,
    categoryOptions,
    authorOptions,
    applied,
    panelValue,
    setDraft,
    apply,
  } = usePostListFilters()
  const posts = usePosts()

  return (
    <section className="post-list">
      <header className="post-list__header">
        <h1 className="post-list__title">DWS blog</h1>
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
          <FilterPanel groups={groups} value={panelValue} onChange={setDraft} onApply={apply} />
        </aside>
        <div className="post-list__results">
          <PostGrid
            posts={filterPosts(posts.data ?? [], filters)}
            isLoading={posts.isPending}
            isError={posts.isError}
            onRetry={() => posts.refetch()}
          />
        </div>
      </div>
    </section>
  )
}
