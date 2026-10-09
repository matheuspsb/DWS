import type { Post } from '../../../services/types.ts'
import Button from '../../atoms/Button/Button.tsx'
import PostCard from '../PostCard/PostCard.tsx'
import PostCardSkeleton from '../PostCardSkeleton/PostCardSkeleton.tsx'
import './PostGrid.scss'

const skeletons = Array.from({ length: 6 }, (_, index) => index)

interface PostGridProps {
  posts: Post[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export default function PostGrid({ posts, isLoading, isError, onRetry }: PostGridProps) {
  if (isError) {
    return (
      <div role="alert" className="post-grid__message">
        <p>We could not load the posts.</p>
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <>
        <p role="status" className="post-grid__loading">
          Loading posts...
        </p>
        <ul className="post-grid" aria-hidden="true">
          {skeletons.map((index) => (
            <li key={index} className="post-grid__item">
              <PostCardSkeleton />
            </li>
          ))}
        </ul>
      </>
    )
  }

  if (posts.length === 0) return <p role="status">No posts match your filters.</p>

  return (
    <ul className="post-grid">
      {posts.map((post) => (
        <li key={post.id} className="post-grid__item">
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
  )
}
