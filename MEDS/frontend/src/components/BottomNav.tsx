import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, MapPin, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  // N'afficher la navigation que sur les pages principales (pas login/register)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAuthPage) return null;

  // Simplification : on suppose qu'on est sur le layout "Patient" pour la démo
  return (
    <div className="bottom-nav">
      <NavLink to="/patient" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Search size={24} />
        <span>Rechercher</span>
      </NavLink>
      
      <NavLink to="/patient/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ShoppingBag size={24} />
        <span>Commandes</span>
      </NavLink>
      
      <NavLink to="/patient/ocr" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <MapPin size={24} />
        <span>Scanner</span>
      </NavLink>
      
      <NavLink to="/login" className="nav-item">
        <User size={24} />
        <span>Profil</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
