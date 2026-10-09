import { Link } from 'react-router-dom'
import { usePostFilters } from '../../../hooks/usePostFilters.ts'
import { routes } from '../../../routes.ts'
import { useRecentSearches } from '../../../stores/recentSearches.store.ts'
import Logo from '../../atoms/Logo/Logo.tsx'
import SearchBar from '../SearchBar/SearchBar.tsx'
import './SiteHeader.scss'

export default function SiteHeader() {
  const { filters, updateFilters } = usePostFilters()
  const { searches, addSearch } = useRecentSearches()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to={routes.home} className="site-header__brand">
          <Logo />
        </Link>
        <div className="site-header__search">
          <SearchBar
            defaultValue={filters.search}
            onSearch={(search) => updateFilters({ search }, { replace: true })}
            onSubmit={addSearch}
            suggestions={searches}
            suggestionsLabel="Recent searches"
          />
        </div>
      </div>
    </header>
  )
}
