import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/atoms/Button/Button.tsx'
import Icon from '../../components/atoms/Icon/Icon.tsx'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <>
      <Button
        variant="secondary"
        compactOnMobile
        startIcon={<Icon name="arrow-left" />}
        onClick={() => navigate('/')}
      >
        Back
      </Button>
      <h1>Post {id}</h1>
    </>
  )
}
