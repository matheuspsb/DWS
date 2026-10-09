import { useQuery } from '@tanstack/react-query'
import { postsService } from '../services/posts.service.ts'

const { getPosts } = postsService()

export const usePosts = () =>
  useQuery({ queryKey: ['posts'], queryFn: ({ signal }) => getPosts({ signal }) })
