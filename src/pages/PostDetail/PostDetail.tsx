import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/atoms/Button/Button.tsx'
import Icon from '../../components/atoms/Icon/Icon.tsx'
import ErrorMessage from '../../components/molecules/ErrorMessage/ErrorMessage.tsx'
import LatestArticles from '../../components/organisms/LatestArticles/LatestArticles.tsx'
import PostArticle from '../../components/organisms/PostArticle/PostArticle.tsx'
import PostArticleSkeleton from '../../components/organisms/PostArticleSkeleton/PostArticleSkeleton.tsx'
import { useLatestArticles } from '../../hooks/useLatestArticles.ts'
import { usePost } from '../../hooks/usePost.ts'
import { useRecordView } from '../../hooks/useRecordView.ts'
import { routes } from '../../routes.ts'
import './PostDetail.scss'

export default function PostDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const post = usePost(id)
  const latest = useLatestArticles(id)
  useRecordView(post.data?.id)

  return (
    <div className="post-detail">
      <div className="post-detail__back">
        <Button
          variant="secondary"
          compactOnMobile
          startIcon={<Icon name="arrow-left" />}
          onClick={() => navigate(routes.home)}
        >
          Back
        </Button>
      </div>
      <div className="post-detail__content">
        {post.isPending && (
          <>
            <p role="status" className="post-detail__loading">
              Loading post...
            </p>
            <PostArticleSkeleton />
          </>
        )}
        {post.isError && (
          <ErrorMessage message="We could not load this post." onRetry={() => post.refetch()} />
        )}
        {post.isSuccess && <PostArticle post={post.data} />}
        {post.isSuccess && <LatestArticles posts={latest} />}
      </div>
    </div>
  )
}
