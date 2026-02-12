import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  // Smooth scroll to top if already on homepage, otherwise navigate
  const handleHomeClick = () => {
    closeMenu();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const navigateToAnchor = (anchor) => {
    closeMenu();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={handleHomeClick}>
          <span className="logo-text">APEX</span>
          <span className="logo-accent">AUTO MODS</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <button className="nav-link" onClick={handleHomeClick}>Home</button>
          <button className="nav-link" onClick={() => navigateToAnchor('services')}>Services</button>
          <button className="nav-link" onClick={() => navigateToAnchor('about')}>About Us</button>
          <button className="nav-link" onClick={() => navigateToAnchor('contact')}>Contact Us</button>
          {user && (
            <>
              <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="user-greeting">Hi, {user.name}</span>
              <button onClick={handleLogout} className="nav-btn nav-btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-btn nav-btn-primary" onClick={closeMenu}>
              Get Started
            </Link>
          )}
        </div>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {menuOpen && <div className="menu-backdrop" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;
