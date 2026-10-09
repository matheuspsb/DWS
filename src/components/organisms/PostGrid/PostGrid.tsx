import type { Post } from '../../../api/types.ts'
import { routes } from '../../../routes.ts'
import { getExcerpt } from '../../../utils/getExcerpt.ts'
import PostCard from '../PostCard/PostCard.tsx'
import './PostGrid.scss'

interface PostGridProps {
  posts: Post[]
}

export default function PostGrid({ posts }: PostGridProps) {
  return (
    <ul className="post-grid">
      {posts.map((post) => (
        <li key={post.id} className="post-grid__item">
          <PostCard
            title={post.title}
            excerpt={getExcerpt(post.content)}
            date={post.createdAt}
            author={post.author.name}
            categories={post.categories.map(({ name }) => name)}
            imageUrl={post.thumbnail_url}
            to={routes.post(post.id)}
          />
        </li>
      ))}
    </ul>
  )
}
