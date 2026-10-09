import { Outlet, useMatch } from 'react-router-dom'
import { useScrollToTop } from '../../../hooks/useScrollToTop.ts'
import { routes } from '../../../routes.ts'
import { classNames } from '../../../utils/classNames.ts'
import SiteHeader from '../../organisms/SiteHeader/SiteHeader.tsx'
import './Layout.scss'

export default function Layout() {
  const isPostPage = useMatch(routes.postPattern) !== null
  useScrollToTop()

  return (
    <div className={classNames('layout', isPostPage && 'layout--post')}>
      <SiteHeader />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  )
}
