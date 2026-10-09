import { useViewedPosts } from '../stores/viewedPosts.store.ts'
import { usePosts } from './usePosts.ts'

const LATEST_COUNT = 3

export function useLatestArticles(currentId: string) {
  const viewedIds = useViewedPosts((state) => state.ids)
  const { data: posts = [] } = usePosts()

  return viewedIds
    .filter((id) => id !== currentId)
    .map((id) => posts.find((post) => post.id === id))
    .filter((post) => post !== undefined)
    .slice(0, LATEST_COUNT)
}
