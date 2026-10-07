import { useParams } from 'react-router-dom'

export default function PostDetail() {
  const { id } = useParams()
  return <h1>Post {id}</h1>
}
