import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Stethoscope, Heart, Shield, Leaf, Star, Sparkles } from 'lucide-react';
import AOS from 'aos';
import './authLayout.css';

const AuthLayout: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const testimonials = [
    {
      text: "J'ai commandé du Doliprane à 23h pour ma fille fébrile. Livré en 25 minutes. MEDS a sauvé ma nuit !",
      author: "Aissatou Diallo",
      role: "Patiente — Dakar",
      initials: "AD",
      rating: 5
    },
    {
      text: "En tant que pharmacien, MEDS a révolutionné notre gestion des stocks et notre relation patient.",
      author: "Dr. Ibrahima Sow",
      role: "Pharmacien — Plateau",
      initials: "IS",
      rating: 5
    },
    {
      text: "Le scan d'ordonnance est bluffant. Je gagne un temps précieux à chaque commande.",
      author: "Marième Fall",
      role: "Infirmière — Thiès",
      initials: "MF",
      rating: 5
    }
  ];

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });

    // Rotation des témoignages
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    // Suivi de la souris pour l'effet parallaxe
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="auth-container">
      {/* ══════════════════════════════════════════════════════
          PANNEAU GAUCHE - Branding Immersif
      ══════════════════════════════════════════════════════ */}
      <div className="auth-panel">
        {/* Fond animé avec formes organiques */}
        <div className="panel-background">
          <div 
            className="bg-shape shape-1"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
            }}
          />
          <div 
            className="bg-shape shape-2"
            style={{
              transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)`
            }}
          />
          <div 
            className="bg-shape shape-3"
            style={{
              transform: `translate(${mousePosition.x * 0.4}px, ${-mousePosition.y * 0.4}px)`
            }}
          />
          
          {/* Grille moléculaire décorative */}
          <div className="molecular-grid">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="molecule-dot" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`
              }} />
            ))}
          </div>
        </div>

        {/* Contenu du panneau */}
        <div className="panel-content">
          {/* Logo avec animation */}
          <div className="panel-logo" data-aos="fade-down">
            <Link to="/" className="logo-link">
              <div className="logo-icon-wrapper">
                <div className="logo-pharmacy-cross">
                  <div className="cross-horizontal" />
                  <div className="cross-vertical" />
                </div>
                <Heart className="logo-heart-pulse" />
                <Sparkles className="logo-sparkle" />
              </div>
              <div className="logo-text-group">
                <span className="logo-main">MEDS</span>
                <span className="logo-dot">.</span>
                <span className="logo-tagline">santé connectée</span>
              </div>
            </Link>
          </div>

          {/* Message principal avec animation */}
          <div className="panel-hero" data-aos="fade-up">
            <div className="hero-badge">
              <Shield className="badge-icon" />
              <span>Plateforme sécurisée</span>
            </div>
            
            <h1 className="hero-heading">
              Votre santé
              <br />
              <span className="hero-highlight">mérite le meilleur</span>
            </h1>
            
            <p className="hero-description">
              Rejoignez la première plateforme de santé connectée au Sénégal.
              Des médicaments livrés chez vous, une communauté de confiance.
            </p>

            {/* Avantages avec icônes animées */}
            <div className="benefits-list">
              {[
                { icon: <Leaf className="benefit-icon" />, text: 'Pharmacies certifiées 24h/24' },
                { icon: <Shield className="benefit-icon" />, text: 'Scan d\'ordonnance par IA' },
                { icon: <Heart className="benefit-icon" />, text: 'Livraison en moins de 30 min' },
                { icon: <Star className="benefit-icon" />, text: 'Paiement Wave sécurisé' }
              ].map((benefit, index) => (
                <div 
                  key={index} 
                  className="benefit-item"
                  data-aos="fade-right"
                  data-aos-delay={200 + index * 100}
                >
                  <div className="benefit-icon-wrapper">
                    {benefit.icon}
                  </div>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Témoignage rotatif */}
          <div 
            className="testimonial-card"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="testimonial-content">
              <div className="testimonial-stars">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="star-filled" />
                ))}
              </div>
              
              <blockquote className="testimonial-quote">
                <span className="quote-mark">"</span>
                {testimonials[currentTestimonial].text}
                <span className="quote-mark">"</span>
              </blockquote>

              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonials[currentTestimonial].initials}
                </div>
                <div className="author-info">
                  <strong>{testimonials[currentTestimonial].author}</strong>
                  <span>{testimonials[currentTestimonial].role}</span>
                </div>
                
                {/* Indicateurs de slide */}
                <div className="testimonial-dots">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentTestimonial ? 'dot-active' : ''}`}
                      onClick={() => setCurrentTestimonial(index)}
                      aria-label={`Témoignage ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Fond décoratif de la carte */}
            <div className="testimonial-bg-pattern" />
          </div>

          {/* Indicateur de statut */}
          <div className="status-bar" data-aos="fade-up" data-aos-delay="600">
            <div className="status-indicators">
              <div className="status-item">
                <div className="status-dot online" />
                <span>Service actif 24h/24</span>
              </div>
              <div className="status-item">
                <div className="status-dot certified" />
                <span>Certifié Ordre des Pharmaciens</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          PANNEAU DROIT - Formulaire
      ══════════════════════════════════════════════════════ */}
      <div className="auth-form-panel">
        {/* Motif de fond subtil */}
        <div className="form-background">
          <div className="form-pattern" />
        </div>

        <div className="form-container">
          {/* Logo mobile */}
          <div className="mobile-logo" data-aos="fade-down">
            <Link to="/" className="mobile-logo-link">
              <div className="mobile-logo-icon">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="mobile-logo-text">
                MEDS<span className="text-accent">.</span>
              </span>
            </Link>
          </div>

          {/* Conteneur du formulaire */}
          <div className="form-wrapper" data-aos="fade-up" data-aos-delay="200">
            <div className="form-glass">
              <Outlet />
            </div>
          </div>

          {/* Footer d'aide */}
          <div className="form-footer" data-aos="fade-up" data-aos-delay="400">
            <div className="help-links">
              <a href="/help" className="help-link">
                <Shield className="help-icon" />
                Centre d'aide
              </a>
              <span className="help-separator">•</span>
              <a href="/contact" className="help-link">
                <Heart className="help-icon" />
                Support 24/7
              </a>
            </div>
            <p className="security-note">
              🔒 Vos données médicales sont protégées et cryptées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;