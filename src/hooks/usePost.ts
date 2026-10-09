import { useQuery } from '@tanstack/react-query'
import { postsService } from '../services/posts.service.ts'

const { getPost } = postsService()

export const usePost = (id: string) =>
  useQuery({ queryKey: ['posts', id], queryFn: ({ signal }) => getPost(id, { signal }) })
