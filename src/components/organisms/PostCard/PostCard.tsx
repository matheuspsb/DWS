import { Link } from 'react-router-dom'
import PostMeta from '../../molecules/PostMeta/PostMeta.tsx'
import TagList from '../../molecules/TagList/TagList.tsx'
import './PostCard.scss'

interface PostCardProps {
  title: string
  excerpt: string
  date: string
  author: string
  categories: string[]
  imageUrl?: string
  imageAlt?: string
  to?: string
}

export default function PostCard({
  title,
  excerpt,
  date,
  author,
  categories,
  imageUrl,
  imageAlt = '',
  to,
}: PostCardProps) {
  return (
    <article className="post-card">
      {imageUrl ? (
        <img className="post-card__image" src={imageUrl} alt={imageAlt} loading="lazy" />
      ) : (
        <div className="post-card__image post-card__image--empty" />
      )}
      <div className="post-card__content">
        <PostMeta date={date} author={author} />
        <div className="post-card__text">
          <h2 className="post-card__title">
            {to ? (
              <Link className="post-card__link" to={to}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          <p className="post-card__excerpt">{excerpt}</p>
        </div>
        <TagList items={categories} label="Categories" />
      </div>
    </article>
  )
}
