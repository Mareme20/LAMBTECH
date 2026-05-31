import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Stethoscope, Menu, X } from 'lucide-react';
import AOS from 'aos';

const MainLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  useEffect(() => {
    AOS.init({ duration: 750, once: true, offset: 50 });
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* ── Sticky Navbar (style TerangaLearn) ── */}
      <nav className="glass-nav fixed w-full z-40 top-0 py-4 transition-all duration-300">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-glow-dark">
              <Stethoscope className="w-5 h-5 text-accent" />
            </div>
            <span className="font-outfit font-black text-2xl tracking-tight text-primary">
              MEDS<span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10 text-sm font-semibold tracking-wide">
            <a href="#services" className="text-primary/70 hover:text-accent hover:-translate-y-0.5 transition-all">Services</a>
            <a href="#pharmacies" className="text-primary/70 hover:text-accent hover:-translate-y-0.5 transition-all">Pharmacies</a>
            <a href="#how-it-works" className="text-primary/70 hover:text-accent hover:-translate-y-0.5 transition-all">Comment ça marche</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-primary/80 hover:text-accent font-bold text-sm transition-colors">
              Connexion
            </Link>
            <Link to="/register" className="btn-primary px-6 py-2.5 text-sm">
              Commencer
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-primary" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4 text-sm font-semibold">
            <a href="#services" className="text-primary/70">Services</a>
            <a href="#pharmacies" className="text-primary/70">Pharmacies</a>
            <a href="#how-it-works" className="text-primary/70">Comment ça marche</a>
            <hr className="border-gray-100" />
            <Link to="/login" className="text-primary font-bold">Connexion</Link>
            <Link to="/register" className="btn-primary w-full justify-center py-3">Commencer</Link>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ── Footer (style TerangaLearn — sombre arrondi) ── */}
      <footer className="bg-primary pt-20 pb-10 rounded-t-6xl mt-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-white/10 pb-16 mb-10">
            <div>
              <span className="font-outfit font-black text-4xl tracking-tight text-white mb-4 block">
                MEDS<span className="text-accent">.</span>
              </span>
              <p className="text-gray-400 font-medium text-sm max-w-xs leading-relaxed">
                La plateforme qui connecte patients, pharmacies et livreurs au Sénégal. Conçue pour notre réalité.
              </p>
            </div>
            <div className="flex gap-16 text-sm">
              <div>
                <h3 className="font-outfit font-black text-white text-lg mb-6">Plateforme</h3>
                <ul className="space-y-4">
                  <li><a href="/about" className="text-gray-300 hover:text-accent font-medium text-sm transition-colors">À propos de MEDS</a></li>
                  <li><a href="/login" className="text-gray-300 hover:text-accent font-medium text-sm transition-colors">Espace Pharmacie</a></li>
                  <li><a href="/login" className="text-gray-300 hover:text-accent font-medium text-sm transition-colors">Devenir Livreur</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-outfit font-black text-white text-lg mb-6">Légal & Aide</h3>
                <ul className="space-y-4">
                  <li><a href="/legal" className="text-gray-300 hover:text-accent font-medium text-sm transition-colors">Conditions Générales</a></li>
                  <li><a href="/legal" className="text-gray-300 hover:text-accent font-medium text-sm transition-colors">Confidentialité</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-accent font-medium text-sm transition-colors">Nous contacter</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium gap-4">
            <p>© 2026 LambTech — MEDS. Tous droits réservés.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
