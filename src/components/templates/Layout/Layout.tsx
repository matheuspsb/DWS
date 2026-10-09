import { Link, Outlet, useMatch } from 'react-router-dom'
import { usePostFilters } from '../../../hooks/usePostFilters.ts'
import { useRecentSearches } from '../../../stores/recentSearches.store.ts'
import Logo from '../../atoms/Logo/Logo.tsx'
import SearchBar from '../../organisms/SearchBar/SearchBar.tsx'
import { classNames } from '../../../utils/classNames.ts'
import './Layout.scss'

export default function Layout() {
  const { filters, updateFilters } = usePostFilters()
  const { searches, addSearch } = useRecentSearches()

  const isDetail = useMatch('/posts/:id') !== null

  return (
    <div className={classNames('layout', isDetail && 'layout--detail')}>
      <header className="layout__header">
        <div className="layout__header-inner">
          <Link to="/" className="layout__brand">
            <Logo />
          </Link>
          <div className="layout__search">
            <SearchBar
              defaultValue={filters.search}
              onSearch={(search) => updateFilters({ search }, { replace: true })}
              onSubmit={addSearch}
              suggestions={searches}
            />
          </div>
        </div>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  )
}
