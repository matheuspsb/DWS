import './PostCardSkeleton.scss'

export default function PostCardSkeleton() {
  return (
    <div className="post-card-skeleton" aria-hidden="true">
      <div className="post-card-skeleton__image" />
      <div className="post-card-skeleton__content">
        <div className="post-card-skeleton__line post-card-skeleton__line--short" />
        <div className="post-card-skeleton__text">
          <div className="post-card-skeleton__line post-card-skeleton__line--title" />
          <div className="post-card-skeleton__line post-card-skeleton__line--title post-card-skeleton__line--medium" />
          <div className="post-card-skeleton__line" />
          <div className="post-card-skeleton__line post-card-skeleton__line--medium" />
        </div>
        <div className="post-card-skeleton__tags">
          <div className="post-card-skeleton__tag" />
          <div className="post-card-skeleton__tag" />
        </div>
      </div>
    </div>
  )
}
