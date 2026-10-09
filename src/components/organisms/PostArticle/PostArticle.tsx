import fallbackCover from '../../../assets/fallback-cover.svg'
import type { Post } from '../../../services/types.ts'
import PostByline from '../../molecules/PostByline/PostByline.tsx'
import './PostArticle.scss'

interface PostArticleProps {
  post: Post
}

export default function PostArticle({ post }: PostArticleProps) {
  const paragraphs = post.content.split('\n\n').filter(Boolean)

  return (
    <article className="post-article">
      <h1 className="post-article__title">{post.title}</h1>
      <PostByline
        authorName={post.author.name}
        authorPicture={post.author.profilePicture}
        date={post.createdAt}
      />
      <img
        className="post-article__image"
        src={post.thumbnail_url || fallbackCover}
        alt={`Cover of ${post.title}`}
      />
      <div className="post-article__body">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
