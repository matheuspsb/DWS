import { useQuery } from '@tanstack/react-query'
import { postsService } from '../services/posts.service.ts'

const { getPosts, getPost } = postsService()

export const usePosts = () =>
  useQuery({ queryKey: ['posts'], queryFn: ({ signal }) => getPosts({ signal }) })

export const usePost = (id: string) =>
  useQuery({ queryKey: ['posts', id], queryFn: ({ signal }) => getPost(id, { signal }) })
