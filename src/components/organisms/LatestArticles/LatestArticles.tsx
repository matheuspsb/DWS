import type { Post } from '../../../api/types.ts'
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
        <span className="latest-articles__title-mobile" aria-hidden="true">
          Last articles
        </span>
        <span className="latest-articles__title-desktop">Latest articles</span>
      </h2>
      <PostGrid posts={posts} />
    </section>
  )
}
