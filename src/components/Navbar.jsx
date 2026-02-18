import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, LayoutDashboard, List, LogOut, User, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch {
            toast.error('Failed to log out');
        }
    };

    const initials = user?.displayName
        ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() || 'U';

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar-inner">
                <NavLink to="/dashboard" className="navbar-logo">
                    <div className="logo-icon">💰</div>
                    <span className="logo-text">FinTracker</span>
                </NavLink>

                <div className="navbar-nav">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        id="nav-dashboard"
                    >
                        <LayoutDashboard size={16} />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/transactions"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        id="nav-transactions"
                    >
                        <List size={16} />
                        Transactions
                    </NavLink>
                </div>

                <div className="navbar-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        id="theme-toggle-btn"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    {user && (
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <button
                                className="user-avatar"
                                onClick={() => setDropdownOpen((o) => !o)}
                                id="user-avatar-btn"
                                aria-label="User menu"
                                aria-expanded={dropdownOpen}
                            >
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="avatar"
                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    initials
                                )}
                            </button>

                            {dropdownOpen && (
                                <div className="user-dropdown" role="menu">
                                    <div className="dropdown-user-info">
                                        <div className="dropdown-user-name">{user.displayName || 'User'}</div>
                                        <div className="dropdown-user-email">{user.email}</div>
                                    </div>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                                        id="dropdown-profile"
                                        role="menuitem"
                                    >
                                        <User size={14} /> Profile
                                    </button>
                                    <button
                                        className="dropdown-item danger"
                                        onClick={handleLogout}
                                        id="dropdown-logout"
                                        role="menuitem"
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
