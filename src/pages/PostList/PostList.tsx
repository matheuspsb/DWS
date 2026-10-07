import FilterDropdown from '../../components/organisms/FilterDropdown/FilterDropdown.tsx'
import './PostList.scss'

// Placeholder data until the categories and authors endpoints are wired in.
const categoryOptions = Array.from({ length: 5 }, (_, index) => ({
  id: String(index + 1),
  label: `Category ${index + 1}`,
}))
const authorOptions = Array.from({ length: 5 }, (_, index) => ({
  id: String(index + 1),
  label: 'Author Lastname',
}))

export default function PostList() {
  return (
    <>
      <h1>Posts</h1>
      <div className="post-list__filters">
        <FilterDropdown label="Category" options={categoryOptions} />
        <FilterDropdown label="Author" options={authorOptions} />
      </div>
    </>
  )
}
