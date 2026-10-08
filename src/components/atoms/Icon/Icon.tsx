import './Icon.scss'

const paths = {
  'chevron-down': 'M6 9.5l6 6 6-6',
  close: 'M7 7l10 10M17 7L7 17',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  sort: 'M8 19V5M4 9l4-4 4 4M16 5v14M12 15l4 4 4-4',
  search: 'M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM21 21l-5.2-5.2',
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
