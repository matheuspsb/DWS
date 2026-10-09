import { useEffect } from 'react'
import { useViewedPosts } from '../stores/viewedPosts.store.ts'

export function useRecordView(id: string | undefined) {
  const addView = useViewedPosts((state) => state.addView)

  useEffect(() => {
    if (id) addView(id)
  }, [id, addView])
}
