import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import PostDetail from './pages/PostDetail/PostDetail.jsx'
import PostList from './pages/PostList/PostList.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<PostList />} />
        <Route path="posts/:id" element={<PostDetail />} />
      </Route>
    </Routes>
  )
}
