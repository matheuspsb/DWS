import { Link, Outlet } from 'react-router-dom'
import { usePostFilters } from '../../../hooks/usePostFilters.ts'
import Logo from '../../atoms/Logo/Logo.tsx'
import SearchBar from '../../organisms/SearchBar/SearchBar.tsx'
import './Layout.scss'

export default function Layout() {
  const { filters, updateFilters } = usePostFilters()

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-inner">
          <Link to="/" className="layout__brand">
            <Logo />
          </Link>
          <div className="layout__search">
            <SearchBar
              defaultValue={filters.search}
              onSearch={(search) => updateFilters({ search })}
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
