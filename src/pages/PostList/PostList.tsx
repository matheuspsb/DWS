import FilterDropdown from '../../components/organisms/FilterDropdown/FilterDropdown.tsx'
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
  return (
    <>
      <h1>Posts</h1>
      <div className="post-list__filters">
        <FilterDropdown label="Category" options={categoryOptions} />
        <FilterDropdown label="Author" options={authorOptions} />
      </div>
      <ul className="post-list__grid">
        {posts.map(({ id, ...post }) => (
          <li key={id}>
            <PostCard {...post} to={`/posts/${id}`} />
          </li>
        ))}
      </ul>
    </>
  )
}
