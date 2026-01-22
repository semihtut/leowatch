import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Archive, Info, Coffee, Shield, Activity, Heart, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useFavorites } from '../../hooks/useFavorites';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Threat Pulse', href: '/pulse', icon: Activity },
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'Archive', href: '/archive', icon: Archive },
  { name: 'Support Project', href: 'https://ko-fi.com/leopark', icon: Coffee, external: true },
];

export default function Sidebar({ onClose }) {
  const { favoritesCount } = useFavorites();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--glass-border)]">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-cyan-500 glow-pink">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">Intelleo</h1>
              <p className="text-xs text-[var(--text-muted)]">Security Intelligence</p>
            </div>
          </NavLink>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium flex-1">{item.name}</span>
                </a>
              ) : (
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-accent)] shadow-lg shadow-pink-500/5'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-pink-500' : ''}`} />
                      <span className="font-medium flex-1">{item.name}</span>
                      {item.name === 'Favorites' && favoritesCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-pink-500/20 text-pink-400 rounded-full">
                          {favoritesCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-[var(--glass-border)] space-y-3">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-[var(--text-muted)]">Theme</span>
          <ThemeToggle />
        </div>

        {/* About Link */}
        <NavLink
          to="/about"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl transition-all ${
              isActive
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-accent)]'
                : 'bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-pink-500/50'
            }`
          }
        >
          <Info className="w-4 h-4" />
          <span className="text-sm font-medium">About</span>
        </NavLink>
      </div>
    </div>
  );
}
