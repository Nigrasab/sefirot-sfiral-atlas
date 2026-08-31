import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Главная' },
  { to: '/tree', label: 'Древо · Сфираль' },
  { to: '/navigator', label: 'Навигатор' },
  { to: '/gematria', label: 'Гематрия' },
  { to: '/encyclopedia', label: 'Энциклопедия' },
  { to: '/lab', label: 'Лаборатория' },
  { to: '/journal', label: 'Журнал' },
  { to: '/about', label: 'О проекте' }
];

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="brand">
            Sefirot<span>–</span>Sfiral Atlas
          </NavLink>

          <nav className="nav">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        Sefirot–Sfiral Atlas · единая модель Древа Сфирот и Сфирали
      </footer>
    </div>
  );
}
