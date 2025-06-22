import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <div className="navbar-left">
        <img src="/c_oding_ss_7-Photoroom.jpg" alt="Logo" className="nav-logo" />
        <h1 className="nav-title">
          <Link to="/" >
            Devvy
          </Link>
        </h1>

        <nav className="nav-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            <Home size={16} className="nav-icon" /> Home
          </Link>
          <Link to="/problems" className={isActive('/problems') ? 'active' : ''}>
            <Search size={16} className="nav-icon" /> Problems
          </Link>
          <Link to="/explore" className={isActive('/explore') ? 'active' : ''}>
            <Search size={16} className="nav-icon" /> Explore
          </Link>
          <Link to="/events" className={isActive('/events') ? 'active' : ''}>
            <Calendar size={16} className="nav-icon" /> Events
          </Link>
        </nav>
      </div>

      <div className="navbar-right">
        <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
          <User size={16} className="nav-icon" /> Profile
        </Link>
      </div>
    </div>
  );
};

export default Navbar;