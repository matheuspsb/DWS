import { Link, Outlet } from 'react-router-dom'
import Logo from '../../atoms/Logo/Logo.tsx'
import SearchBar from '../../organisms/SearchBar/SearchBar.tsx'
import './Layout.scss'

const searchSuggestions = Array.from({ length: 12 }, () => 'Category 1')

export default function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-inner">
          <Link to="/" className="layout__brand">
            <Logo />
          </Link>
          <div className="layout__search">
            <SearchBar suggestions={searchSuggestions} />
          </div>
        </div>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  )
}
