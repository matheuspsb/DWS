import { formatDate } from '../../../utils/formatDate.ts'
import './PostMeta.scss'

interface PostMetaProps {
  date: string
  author: string
}

export default function PostMeta({ date, author }: PostMetaProps) {
  return (
    <p className="post-meta">
      <time className="post-meta__date" dateTime={date}>
        {formatDate(date)}
      </time>
      <span className="post-meta__dot" aria-hidden="true" />
      <span className="post-meta__author">{author}</span>
    </p>
  )
}
