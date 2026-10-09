import { formatDate } from '../../../utils/formatDate.ts'
import Avatar from '../../atoms/Avatar/Avatar.tsx'
import './PostByline.scss'

interface PostBylineProps {
  authorName: string
  authorPicture: string
  date: string
}

export default function PostByline({ authorName, authorPicture, date }: PostBylineProps) {
  return (
    <div className="post-byline">
      <Avatar src={authorPicture} />
      <div className="post-byline__text">
        <p className="post-byline__author">
          Written by: <strong>{authorName}</strong>
        </p>
        <time className="post-byline__date" dateTime={date}>
          {formatDate(date)}
        </time>
      </div>
    </div>
  )
}
