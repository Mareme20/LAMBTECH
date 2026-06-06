import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Stethoscope, Menu, X, Heart, Leaf, Sparkles } from 'lucide-react';
import AOS from 'aos';
import './mainLayout.css';

const MainLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 80, easing: 'ease-out-cubic' });

    // Détection du scroll pour effet glass progressif
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="layout-container">
      {/* ══════════════════════════════════════════════════════
          NAVBAR - Design Fusion Médical & Nature
      ══════════════════════════════════════════════════════ */}
      <nav className={`main-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        {/* Barre supérieure - Info santé */}
        <div className="nav-top-bar">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="top-bar-content">
              <div className="health-indicator">
                <div className="pulse-dot-nav" />
                <span>Service santé actif 24h/24</span>
              </div>
              <div className="top-bar-links">
                <a href="tel:+221000000000" className="top-link">
                  <span className="link-icon">📞</span> Urgences
                </a>
                <span className="separator">•</span>
                <span className="top-link">Dakar, Sénégal 🇸🇳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barre principale */}
        <div className="nav-main-bar">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="nav-inner">
              {/* Logo avec animation */}
              <Link to="/" className="logo-wrapper group">
                <div className="logo-icon">
                  <div className="logo-cross">
                    <div className="cross-h" />
                    <div className="cross-v" />
                  </div>
                  <Heart className="logo-heart" />
                </div>
                <div className="logo-text">
                  <span className="logo-brand">MEDS</span>
                  <span className="logo-accent">.</span>
                  <span className="logo-subtitle">santé</span>
                </div>
                <Sparkles className="logo-sparkle" />
              </Link>

              {/* Navigation Desktop */}
              <div className="desktop-nav">
                <div className="nav-links">
                  <a href="#services" className="nav-link">
                    <Leaf className="nav-link-icon" />
                    Services
                    <span className="nav-link-underline" />
                  </a>
                  <a href="#pharmacies" className="nav-link">
                    <span className="nav-link-icon">💊</span>
                    Pharmacies
                    <span className="nav-link-underline" />
                  </a>
                  <a href="#how-it-works" className="nav-link">
                    <span className="nav-link-icon">🔄</span>
                    Processus
                    <span className="nav-link-underline" />
                  </a>
                  <a href="#testimonials" className="nav-link">
                    <Heart className="nav-link-icon" />
                    Avis
                    <span className="nav-link-underline" />
                  </a>
                </div>

                <div className="nav-actions">
                  <Link to="/login" className="btn-text">
                    <span>Connexion</span>
                    <span className="btn-text-underline" />
                  </Link>
                  <Link to="/register" className="btn-primary-nav">
                    <span>Commencer</span>
                    <div className="btn-shine" />
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="mobile-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                <div className={`hamburger ${menuOpen ? 'active' : ''}`}>
                  <span /><span /><span />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu avec animation */}
        <div className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="mobile-menu-pattern" />
          <div className="mobile-menu-content">
            <div className="mobile-links">
              <a href="#services" onClick={() => setMenuOpen(false)} className="mobile-link">
                <Leaf className="mobile-link-icon" />
                Services
              </a>
              <a href="#pharmacies" onClick={() => setMenuOpen(false)} className="mobile-link">
                <span className="mobile-link-icon">💊</span>
                Pharmacies
              </a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="mobile-link">
                <span className="mobile-link-icon">🔄</span>
                Comment ça marche
              </a>
              <a href="#testimonials" onClick={() => setMenuOpen(false)} className="mobile-link">
                <Heart className="mobile-link-icon" />
                Témoignages
              </a>
            </div>
            
            <div className="mobile-actions">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="mobile-btn-outline">
                Connexion
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="mobile-btn-primary">
                <Heart className="w-4 h-4" />
                Créer un compte
              </Link>
            </div>

            <div className="mobile-info">
              <div className="mobile-health-badge">
                <div className="pulse-dot-nav" />
                Disponible 24h/24 - 7j/7
              </div>
              <p className="mobile-emergency">
                📞 Urgences : <a href="tel:+221000000000">+221 00 000 00 00</a>
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ══════════════════════════════════════════════════════
          FOOTER - Design Chaleureux Africain
      ══════════════════════════════════════════════════════ */}
      <footer className="main-footer">
        {/* Motif décoratif africain */}
        <div className="footer-pattern-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="pattern-svg">
            <path d="M0,0 C300,80 600,0 900,60 C1050,90 1150,60 1200,40 L1200,120 L0,120 Z" 
                  fill="currentColor" />
          </svg>
        </div>

        <div className="footer-content">
          <div className="container mx-auto px-6 lg:px-12">
            {/* Section principale */}
            <div className="footer-grid">
              {/* Colonne 1 - Brand */}
              <div className="footer-brand">
                <div className="footer-logo">
                  <div className="footer-logo-icon">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <span className="footer-logo-text">
                    MEDS<span className="text-accent">.</span>
                  </span>
                </div>
                <p className="footer-description">
                  La première plateforme de santé connectée au Sénégal. 
                  Nous révolutionnons l'accès aux médicaments avec technologie et humanité.
                </p>
                <div className="footer-badges">
                  <div className="footer-badge">
                    <div className="w-4 h-4" />
                    Certifié Ordre des Pharmaciens
                  </div>
                  <div className="footer-badge">
                    <Heart className="w-4 h-4" />
                    Partenaire santé agréé
                  </div>
                </div>
              </div>

              {/* Colonne 2 - Navigation */}
              <div className="footer-nav">
                <h4 className="footer-heading">Plateforme</h4>
                <ul className="footer-links">
                  <li><a href="/about">Notre mission</a></li>
                  <li><a href="/pharmacies">Pharmacies partenaires</a></li>
                  <li><a href="/livreurs">Devenir livreur</a></li>
                  <li><a href="/blog">Blog santé</a></li>
                </ul>
              </div>

              {/* Colonne 3 - Support */}
              <div className="footer-nav">
                <h4 className="footer-heading">Assistance</h4>
                <ul className="footer-links">
                  <li><a href="/help">Centre d'aide</a></li>
                  <li><a href="/faq">Questions fréquentes</a></li>
                  <li><a href="/contact">Nous contacter</a></li>
                  <li><a href="/urgences">Numéros d'urgence</a></li>
                </ul>
              </div>

              {/* Colonne 4 - Newsletter */}
              <div className="footer-newsletter">
                <h4 className="footer-heading">Restez informé</h4>
                <p className="newsletter-text">
                  Recevez nos conseils santé et actualités
                </p>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">
                    <span>→</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Barre de confiance */}
            <div className="trust-bar">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                Paiements sécurisés
              </div>
              <div className="trust-item">
                <span className="trust-icon">💚</span>
                Données médicales protégées
              </div>
              <div className="trust-item">
                <span className="trust-icon">⚡</span>
                Livraison express
              </div>
              <div className="trust-item">
                <span className="trust-icon">🇸🇳</span>
                Made in Sénégal
              </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
              <p className="copyright">
                © 2026 MEDS Santé — Propulsé par LambTech avec ❤️ pour l'Afrique
              </p>
              <div className="legal-links">
                <a href="/privacy">Confidentialité</a>
                <span className="dot">•</span>
                <a href="/terms">CGU</a>
                <span className="dot">•</span>
                <a href="/cookies">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;