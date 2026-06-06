import React, { useState, useEffect } from 'react';
import type { SVGProps } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope, Search, ShoppingBag, ScanText, MessageSquareHeart,
  Package, BarChart2, Users, Truck, Bell, ChevronDown, LogOut,
  X, LayoutDashboard, Loader2, Store, Heart, Moon, Sun, Sparkles,
  ChevronRight, Activity, Clock, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import './dashboardLayout.css';

interface NavItem {
  to: string;
  icon: React.ReactElement<SVGProps<SVGSVGElement>>;
  label: string;
  badge?: number;
}

interface DashboardLayoutProps {
  role: UserRole;
  userName?: string;
  children?: React.ReactNode;
}

const navByRole: Record<UserRole, NavItem[]> = {
  [UserRole.PATIENT]: [
    { to: '/patient', icon: <Search size={20} />, label: 'Rechercher' },
    { to: '/patient/orders', icon: <ShoppingBag size={20} />, label: 'Mes commandes', badge: 2 },
    { to: '/patient/scan', icon: <ScanText size={20} />, label: 'Scanner ordonnance' },
    { to: '/patient/chat', icon: <MessageSquareHeart size={20} />, label: 'Assistant IA' },
  ],
  [UserRole.PHARMACIE]: [
    { to: '/pharmacie', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
    { to: '/pharmacie/stock', icon: <Package size={20} />, label: 'Inventaire', badge: 5 },
    { to: '/pharmacie/meds', icon: <Stethoscope size={20} />, label: 'Médicaments' },
    { to: '/pharmacie/orders', icon: <ShoppingBag size={20} />, label: 'Commandes', badge: 3 },
    { to: '/pharmacie/stats', icon: <BarChart2 size={20} />, label: 'Statistiques' },
  ],
  [UserRole.LIVREUR]: [
    { to: '/livreur', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
    { to: '/livreur/courses', icon: <Truck size={20} />, label: 'Mes courses', badge: 1 },
  ],
  [UserRole.ADMIN]: [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Vue globale' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Utilisateurs' },
    { to: '/admin/pharmacies', icon: <Store size={20} />, label: 'Pharmacies' },
    { to: '/admin/stats', icon: <BarChart2 size={20} />, label: 'Épidémiologie' },
  ],
  [UserRole.DISTRICT]: [
    { to: '/district', icon: <LayoutDashboard size={20} />, label: 'Veille Sanitaire' },
    { to: '/district/stats', icon: <BarChart2 size={20} />, label: 'Analyses IA' },
  ],
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, userName: initialName, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const { user, token, logout, isAuthenticated } = useAuth();
  const items = navByRole[role] || [];
  
  // Protection des routes
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken && !token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Horloge temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated && !localStorage.getItem('token')) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <Heart className="loading-heart" />
          <Loader2 className="loading-spinner" />
          <p>Chargement de votre espace santé...</p>
        </div>
      </div>
    );
  }

  const userName = user?.nom || initialName || 'Utilisateur';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, icon: <Package className="w-4 h-4" />, text: 'Commande #1234 livrée', time: '5 min', color: 'green' },
    { id: 2, icon: <Activity className="w-4 h-4" />, text: 'Rappel : prise de médicament', time: '30 min', color: 'blue' },
    { id: 3, icon: <MessageSquareHeart className="w-4 h-4" />, text: 'Message du pharmacien', time: '1h', color: 'purple' },
  ];

  const SidebarContent = () => (
    <div className="sidebar-inner">
      {/* Logo avec animation */}
      <Link to="/" className="sidebar-logo group">
        <div className="logo-icon-wrapper">
          <div className="logo-cross-icon">
            <div className="cross-h" />
            <div className="cross-v" />
          </div>
          <Heart className="logo-heart" />
        </div>
        {!sidebarCollapsed && (
          <div className="logo-text">
            <span className="logo-brand">MEDS</span>
            <span className="logo-accent">.</span>
            <span className="logo-subtitle">pro</span>
          </div>
        )}
        <Sparkles className="logo-sparkle" />
      </Link>

      {/* Info santé rapide */}
      {!sidebarCollapsed && (
        <div className="health-status">
          <div className="status-indicator">
            <span className="pulse-dot" />
            <span>Système actif</span>
          </div>
          <div className="status-time">
            <Clock className="w-3 h-3" />
            {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )}

      {/* Badge rôle */}
      {!sidebarCollapsed && (
        <div className="role-section">
          <span className="role-badge">
            <ShieldIcon role={role} />
            {role === UserRole.PATIENT && 'Patient'}
            {role === UserRole.PHARMACIE && 'Pharmacien'}
            {role === UserRole.LIVREUR && 'Livreur'}
            {role === UserRole.ADMIN && 'Admin'}
            {role === UserRole.DISTRICT && 'District'}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {items.map(({ to, icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''} ${sidebarCollapsed ? 'nav-item-collapsed' : ''}`
            }
            title={sidebarCollapsed ? label : undefined}
          >
            <div className="nav-icon-wrapper">
              {icon}
              {badge && <span className="nav-badge">{badge}</span>}
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">{label}</span>
                <ChevronRight className="nav-arrow" />
              </>
            )}
            <div className="nav-active-indicator" />
          </NavLink>
        ))}
      </nav>

      {/* Stats rapides */}
      {!sidebarCollapsed && (
        <div className="sidebar-stats">
          <div className="stat-mini">
            <MapPin className="stat-icon" />
            <div>
              <span className="stat-value">12</span>
              <span className="stat-label">À proximité</span>
            </div>
          </div>
          <div className="stat-mini">
            <Activity className="stat-icon" />
            <div>
              <span className="stat-value">98%</span>
              <span className="stat-label">Disponibilité</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer sidebar */}
      <div className="sidebar-footer">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="collapse-btn"
          title={sidebarCollapsed ? 'Déplier' : 'Réduire'}
        >
          <ChevronRight className={`collapse-icon ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
        {!sidebarCollapsed && (
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* Desktop Sidebar */}
      <aside className={`desktop-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="mobile-sidebar-overlay">
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
          <aside className="mobile-sidebar">
            <button onClick={() => setSidebarOpen(false)} className="sidebar-close">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className={`main-area ${sidebarCollapsed ? 'main-expanded' : ''}`}>
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              {/* Mobile menu trigger */}
              <button onClick={() => setSidebarOpen(true)} className="mobile-menu-btn lg-hidden">
                <div className="hamburger-icon">
                  <span /><span /><span />
                </div>
              </button>

              {/* Barre de recherche */}
              <div className={`search-wrapper ${searchFocused ? 'search-focused' : ''}`}>
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher médicament, commande..."
                  className="search-input"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <div className="search-shortcut">
                  <kbd>⌘</kbd><kbd>K</kbd>
                </div>
              </div>
            </div>

            <div className="topbar-right">
              {/* Statut en direct */}
              <div className="live-status">
                <span className="live-dot" />
                <span className="live-text">En ligne</span>
              </div>

              {/* Notifications */}
              <div className="notification-wrapper">
                <button 
                  className="notification-btn"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell size={20} />
                  <span className="notification-dot" />
                </button>

                {notificationsOpen && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h3>Notifications</h3>
                      <span className="notification-count">3 nouvelles</span>
                    </div>
                    <div className="notification-list">
                      {notifications.map(notif => (
                        <div key={notif.id} className="notification-item">
                          <div className={`notif-icon ${notif.color}`}>
                            {notif.icon}
                          </div>
                          <div className="notif-content">
                            <p>{notif.text}</p>
                            <span>{notif.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="notification-all">Voir tout</button>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="profile-wrapper">
                <button 
                  className="profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="profile-avatar">
                    {userInitials}
                    <div className="avatar-glow" />
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">{userName}</span>
                    <span className="profile-role">
                      {role === UserRole.PATIENT && 'Patient'}
                      {role === UserRole.PHARMACIE && 'Pharmacie'}
                      {role === UserRole.LIVREUR && 'Livreur'}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`profile-chevron ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {userInitials}
                      </div>
                      <div>
                        <strong>{userName}</strong>
                        <span>{user?.email || 'utilisateur@meds.sn'}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item">
                      <Activity size={16} /> Mon activité
                    </button>
                    <button className="dropdown-item">
                      <Heart size={16} /> Santé
                    </button>
                    <div className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="dashboard-main">
          <div className="main-container">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <div className="bottom-nav-inner">
          {items.slice(0, 4).map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `bottom-nav-item ${isActive ? 'bottom-nav-active' : ''}`
              }
            >
              <div className="bottom-nav-icon">
                {icon}
              </div>
              <span className="bottom-nav-label">{label.split(' ')[0]}</span>
            </NavLink>
          ))}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="bottom-nav-item more-btn"
          >
            <div className="bottom-nav-icon">
              <LayoutDashboard size={20} />
            </div>
            <span className="bottom-nav-label">Plus</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

// Icône de bouclier selon le rôle
const ShieldIcon: React.FC<{ role: UserRole }> = ({ role }) => {
  const colors: Record<UserRole, string> = {
    [UserRole.PATIENT]: '#7C9A7E',
    [UserRole.PHARMACIE]: '#1B3A5C',
    [UserRole.LIVREUR]: '#C17A53',
    [UserRole.ADMIN]: '#D4A853',
    [UserRole.DISTRICT]: '#4A90E2',
  };
  
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors[role]} strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
};

export default DashboardLayout;