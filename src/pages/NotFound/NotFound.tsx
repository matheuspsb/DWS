import { useNavigate } from 'react-router-dom'
import Button from '../../components/atoms/Button/Button.tsx'
import './NotFound.scss'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <section className="not-found">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button onClick={() => navigate('/')}>Go to the posts</Button>
    </section>
  )
}
