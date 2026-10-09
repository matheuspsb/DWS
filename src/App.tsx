import { Route, Routes } from 'react-router-dom'
import Layout from './components/templates/Layout/Layout.tsx'
import PostDetail from './pages/PostDetail/PostDetail.tsx'
import NotFound from './pages/NotFound/NotFound.tsx'
import PostList from './pages/PostList/PostList.tsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<PostList />} />
        <Route path="posts/:id" element={<PostDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
