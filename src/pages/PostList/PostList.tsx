import ErrorMessage from '../../components/molecules/ErrorMessage/ErrorMessage.tsx'
import SortButton from '../../components/molecules/SortButton/SortButton.tsx'
import FilterDropdown from '../../components/organisms/FilterDropdown/FilterDropdown.tsx'
import FilterPanel from '../../components/organisms/FilterPanel/FilterPanel.tsx'
import PostGrid from '../../components/organisms/PostGrid/PostGrid.tsx'
import PostGridSkeleton from '../../components/organisms/PostGridSkeleton/PostGridSkeleton.tsx'
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
  const visiblePosts = filterPosts(posts.data ?? [], filters)

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
          {posts.isPending && <PostGridSkeleton />}
          {posts.isError && (
            <ErrorMessage message="We could not load the posts." onRetry={() => posts.refetch()} />
          )}
          {posts.isSuccess && visiblePosts.length === 0 && (
            <p role="status">No posts match your filters.</p>
          )}
          {posts.isSuccess && visiblePosts.length > 0 && <PostGrid posts={visiblePosts} />}
        </div>
      </div>
    </section>
  )
}
