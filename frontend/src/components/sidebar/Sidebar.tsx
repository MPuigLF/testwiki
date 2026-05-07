import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

export default function Sidebar() {
  const location = useLocation()

  const items = [
    { path: '/', label: 'Dashboard' },
    { path: '/inventario', label: 'Inventario' },
    { path: '/ubicaciones', label: 'Ubicaciones' },
    { path: '/historial', label: 'Historial' },
    { path: '/usuarios', label: 'Usuarios' }
  ]

  return (
    <aside className="sidebar">

      <div className="sidebar-title">
        CONTROL PANEL 
      </div>

      <nav className="nav">

        {items.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${
              location.pathname === item.path ? 'active' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}

      </nav>

      <div className="sidebar-footer">
        IT Inventory System
      </div>

    </aside>
  )
}