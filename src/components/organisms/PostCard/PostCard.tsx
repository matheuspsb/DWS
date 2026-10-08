import { Link } from 'react-router-dom'
import fallbackCover from '../../../assets/fallback-cover.svg'
import PostMeta from '../../molecules/PostMeta/PostMeta.tsx'
import TagList from '../../molecules/TagList/TagList.tsx'
import './PostCard.scss'

interface PostCardProps {
  title: string
  excerpt: string
  date: string
  author: string
  categories: string[]
  imageUrl?: string | null
  to: string
}

export default function PostCard({
  title,
  excerpt,
  date,
  author,
  categories,
  imageUrl,
  to,
}: PostCardProps) {
  return (
    <article className="post-card">
      <Link className="post-card__cover" to={to} aria-hidden="true" tabIndex={-1}>
        <img className="post-card__image" src={imageUrl || fallbackCover} alt="" loading="lazy" />
      </Link>
      <div className="post-card__content">
        <PostMeta date={date} author={author} />
        <div className="post-card__text">
          <h2 className="post-card__title">
            <Link className="post-card__link" to={to}>
              {title}
            </Link>
          </h2>
          <p className="post-card__excerpt">{excerpt}</p>
        </div>
        <TagList items={categories} label="Categories" />
      </div>
    </article>
  )
}
