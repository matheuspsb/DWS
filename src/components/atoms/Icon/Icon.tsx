import './Icon.scss'

const paths = {
  'chevron-down': 'M6 9.5l6 6 6-6',
  close: 'M7 7l10 10M17 7L7 17',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
} as const

export type IconName = keyof typeof paths

interface IconProps {
  name: IconName
  size?: number
}

export default function Icon({ name, size = 24 }: IconProps) {
  return (
    <svg
      className={`icon icon--${name}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  )
}
