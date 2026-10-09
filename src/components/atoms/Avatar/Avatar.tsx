import './Avatar.scss'

interface AvatarProps {
  src: string
}

export default function Avatar({ src }: AvatarProps) {
  return <img className="avatar" src={src} alt="" />
}
