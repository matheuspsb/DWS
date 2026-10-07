import { Link, Outlet } from 'react-router-dom'
import './Layout.scss'

export default function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <Link to="/" className="layout__brand">
          DWS Blog
        </Link>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  )
}
