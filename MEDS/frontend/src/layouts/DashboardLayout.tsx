import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope, Search, ShoppingBag, ScanText, MessageSquareHeart,
  Package, BarChart2, Users, Truck, Bell, ChevronDown, LogOut,
  Menu, X, LayoutDashboard, Loader2, Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

interface DashboardLayoutProps {
  role: 'PATIENT' | 'PHARMACIE' | 'LIVREUR' | 'ADMIN' | 'DISTRICT';
  userName?: string;
  children?: React.ReactNode;
}

const navByRole: Record<string, NavItem[]> = {
  PATIENT: [
    { to: '/patient', icon: <Search size={20} />, label: 'Rechercher' },
    { to: '/patient/orders', icon: <ShoppingBag size={20} />, label: 'Mes commandes' },
    { to: '/patient/scan', icon: <ScanText size={20} />, label: 'Scanner ordonnance' },
    { to: '/patient/chat', icon: <MessageSquareHeart size={20} />, label: 'Assistant IA' },
  ],
  PHARMACIE: [
    { to: '/pharmacie', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
    { to: '/pharmacie/stock', icon: <Package size={20} />, label: 'Inventaire' },
    { to: '/pharmacie/meds', icon: <Stethoscope size={20} />, label: 'Médicaments' },
    { to: '/pharmacie/orders', icon: <ShoppingBag size={20} />, label: 'Commandes' },
    { to: '/pharmacie/stats', icon: <BarChart2 size={20} />, label: 'Statistiques' },
  ],
  LIVREUR: [
    { to: '/livreur', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
    { to: '/livreur/courses', icon: <Truck size={20} />, label: 'Mes courses' },
  ],
  ADMIN: [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Vue globale' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Utilisateurs' },
    { to: '/admin/pharmacies', icon: <Store size={20} />, label: 'Pharmacies' },
    { to: '/admin/stats', icon: <BarChart2 size={20} />, label: 'Épidémiologie' },
  ],
  DISTRICT: [
    { to: '/district', icon: <LayoutDashboard size={20} />, label: 'Veille Sanitaire' },
    { to: '/district/stats', icon: <BarChart2 size={20} />, label: 'Analyses IA' },
  ],
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, userName: initialName, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  if (!isAuthenticated && !localStorage.getItem('token')) {
    return <div className="flex items-center justify-center h-screen bg-surfaceAlt"><Loader2 className="animate-spin text-accent" /></div>;
  }

  const userName = user?.nom || initialName || 'Utilisateur';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 px-6 py-6 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-glow-dark">
          <Stethoscope className="w-5 h-5 text-accent" />
        </div>
        <span className="font-outfit font-black text-xl tracking-tight text-primary">
          MEDS<span className="text-accent">.</span>
        </span>
      </Link>

      {/* Role badge */}
      <div className="px-6 py-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
          {role}
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 space-y-1">
        {items.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-white shadow-glow-green'
                  : 'text-gray-500 hover:bg-surfaceAlt hover:text-primary'
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-50 w-full transition-all"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surfaceAlt font-sans flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed h-full z-30 shadow-soft">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full shadow-2xl z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-primary"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-24 lg:pb-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20 h-16 flex items-center px-6 justify-between shadow-soft">
          <div className="flex items-center gap-4">
            {/* Desktop Search bar */}
            <div className="hidden md:flex items-center gap-2 bg-surfaceAlt rounded-2xl px-4 py-2.5 w-72">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent text-sm text-primary placeholder:text-gray-400 focus:outline-none w-full font-medium"
              />
            </div>
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-accent" />
              </div>
              <span className="font-outfit font-black text-xl text-primary">MEDS<span className="text-accent">.</span></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2.5 rounded-2xl bg-surfaceAlt text-gray-500 hover:text-primary transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
            </button>

            {/* Profile */}
            <button className="flex items-center gap-2.5 bg-surfaceAlt rounded-2xl px-3 py-2 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center text-white text-xs font-black">
                {userName.charAt(0)}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-primary">{userName}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children || <Outlet />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {items.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 h-14 gap-1 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-accent'
                    : 'text-gray-400 hover:text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
                    {React.cloneElement(icon as React.ReactElement, { size: isActive ? 24 : 22, strokeWidth: isActive ? 2.5 : 2 })}
                  </div>
                  <span className={`text-[10px] font-bold transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    {label.split(' ')[0]}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;
