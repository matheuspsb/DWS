import PostCardSkeleton from '../PostCardSkeleton/PostCardSkeleton.tsx'
import './PostGridSkeleton.scss'

const skeletons = Array.from({ length: 6 }, (_, index) => index)

export default function PostGridSkeleton() {
  return (
    <>
      <p role="status" className="post-grid-skeleton__status">
        Loading posts...
      </p>
      <ul className="post-grid-skeleton" aria-hidden="true">
        {skeletons.map((index) => (
          <li key={index} className="post-grid-skeleton__item">
            <PostCardSkeleton />
          </li>
        ))}
      </ul>
    </>
  )
}
