import './PostArticleSkeleton.scss'

const lines = Array.from({ length: 8 }, (_, index) => index)

export default function PostArticleSkeleton() {
  return (
    <div className="post-article-skeleton" aria-hidden="true">
      <div className="post-article-skeleton__title" />
      <div className="post-article-skeleton__byline">
        <div className="post-article-skeleton__avatar" />
        <div className="post-article-skeleton__byline-text">
          <div className="post-article-skeleton__line post-article-skeleton__line--short" />
          <div className="post-article-skeleton__line post-article-skeleton__line--short" />
        </div>
      </div>
      <div className="post-article-skeleton__image" />
      <div className="post-article-skeleton__body">
        {lines.map((line) => (
          <div key={line} className="post-article-skeleton__line" />
        ))}
      </div>
    </div>
  )
}
