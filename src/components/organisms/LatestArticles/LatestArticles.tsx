import type { Post } from '../../../services/types.ts'
import PostGrid from '../PostGrid/PostGrid.tsx'
import './LatestArticles.scss'

interface LatestArticlesProps {
  posts: Post[]
}

export default function LatestArticles({ posts }: LatestArticlesProps) {
  if (posts.length === 0) return null

  return (
    <section className="latest-articles" aria-labelledby="latest-articles-title">
      <h2 id="latest-articles-title" className="latest-articles__title">
        Latest articles
      </h2>
      <PostGrid posts={posts} />
    </section>
  )
}
