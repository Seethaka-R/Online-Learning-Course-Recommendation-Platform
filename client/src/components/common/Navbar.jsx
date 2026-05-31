// components/common/Navbar.jsx — Sticky navigation bar with auth state
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 24 }}>
        {/* Logo */}
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>
          <span style={{ color: 'var(--accent-primary)' }}>Learn</span>
          <span style={{ color: 'var(--text-primary)' }}>Hub</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {[
            { path: '/courses', label: 'Explore' },
            ...(user ? [
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/my-courses', label: 'My Courses' },
            ] : []),
          ].map(({ path, label }) => (
            <Link key={path} to={path} style={{
              padding: '6px 14px', borderRadius: 'var(--radius-md)',
              fontSize: 14, fontWeight: 500,
              color: isActive(path) ? 'var(--accent-primary)' : 'var(--text-secondary)',
              background: isActive(path) ? 'rgba(108,99,255,0.1)' : 'transparent',
              transition: 'all 0.2s',
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Auth */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/profile" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 12px', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--accent-primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                {user.name?.split(' ')[0]}
              </span>
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
