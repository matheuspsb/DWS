import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pushRecent } from '../utils/pushRecent.ts'

export const MAX_VIEWED_POSTS = 4

interface ViewedPostsState {
  ids: string[]
  addView: (id: string) => void
}

export const useViewedPosts = create<ViewedPostsState>()(
  persist(
    (set) => ({
      ids: [],
      addView: (id) => set(({ ids }) => ({ ids: pushRecent(ids, id, MAX_VIEWED_POSTS) })),
    }),
    { name: 'dws.viewed-posts', partialize: ({ ids }) => ({ ids }) },
  ),
)
