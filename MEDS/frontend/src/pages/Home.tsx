import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import {
  MapPin, ScanText, ShieldCheck, Heart, Leaf, Zap,
  ArrowRight, CheckCircle2, Star, Package, Navigation, 
  Phone, ChevronRight, Droplets, Sun, Feather, Sparkles,
  Clock, Users, Award, Building2, Stethoscope
} from 'lucide-react';
import './home.css';

const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [countersStarted, setCountersStarted] = useState(false);
  const [counters, setCounters] = useState({ patients: 0, pharmacies: 0, deliveries: 0 });

  const testimonials = [
    {
      name: 'Aissatou Diallo',
      role: 'Patiente — Dakar',
      text: "J'ai commandé du Doliprane à 23h pour ma fille fébrile. Livré en 25 minutes. MEDS a sauvé ma nuit !",
      initials: 'AD',
      stars: 5
    },
    {
      name: 'Dr. Ibrahima Sow',
      role: 'Pharmacien — Plateau',
      text: "Depuis que nous avons rejoint MEDS, nos ventes en ligne ont triplé. La gestion des stocks en temps réel est révolutionnaire.",
      initials: 'IS',
      stars: 5
    },
    {
      name: 'Moussa Kane',
      role: 'Livreur indépendant',
      text: "J'ai augmenté mes revenus de 40% ce mois-ci. L'application est simple, les courses sont proches et le paiement immédiat.",
      initials: 'MK',
      stars: 5
    }
  ];

  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      once: true, 
      offset: 80,
      easing: 'ease-out-cubic'
    });

    // Suivi de la souris pour parallaxe
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    // Rotation des témoignages mobile
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    // Animation des compteurs
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          setCountersStarted(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(testimonialInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [countersStarted]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const animation = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setCounters({
        patients: Math.floor(eased * 2500),
        pharmacies: Math.floor(eased * 340),
        deliveries: Math.floor(eased * 15000)
      });

      if (step >= steps) {
        clearInterval(animation);
        setCounters({ patients: 2500, pharmacies: 340, deliveries: 15000 });
      }
    }, interval);
  };

  return (
    <div className="home-container">
      
      {/* ══════════════════════════════════════════════════════
          HERO - Fusion Médecine & Nature
      ══════════════════════════════════════════════════════ */}
      <section className="hero-section">
        {/* Formes organiques */}
        <div className="organic-bg">
          <div 
            className="organic-blob blob-1"
            style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
          />
          <div 
            className="organic-blob blob-2"
            style={{ transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)` }}
          />
          <div 
            className="organic-blob blob-3"
            style={{ transform: `translate(${mousePosition.x * 0.4}px, ${-mousePosition.y * 0.4}px)` }}
          />
        </div>

        {/* Particules moléculaires */}
        <div className="molecular-particles">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="molecule"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="hero-content-wrapper">
            {/* Contenu principal */}
            <div className="hero-text-content" data-aos="fade-up">
              {/* Badge santé */}
              <div className="hero-badge">
                <Heart className="badge-heart heartbeat" size={16} />
                <span>Service santé disponible 24h/24</span>
                <div className="badge-pulse" />
              </div>

              <h1 className="hero-title">
                Vos médicaments,
                <br />
                <span className="hero-title-gradient">livrés avec soin</span>
              </h1>

              <p className="hero-description">
                La première plateforme de santé connectée au Sénégal.
                Des pharmacies certifiées à votre porte en moins de 30 minutes.
              </p>

              {/* Pills caractéristiques */}
              <div className="hero-features">
                <div className="feature-pill">
                  <div className="pill-icon-wrapper green">
                    <ShieldCheck size={16} />
                  </div>
                  <span>Pharmacies certifiées</span>
                </div>
                <div className="feature-pill">
                  <div className="pill-icon-wrapper blue">
                    <ScanText size={16} />
                  </div>
                  <span>Scan IA d'ordonnance</span>
                </div>
                <div className="feature-pill">
                  <div className="pill-icon-wrapper gold">
                    <Zap size={16} />
                  </div>
                  <span>Paiement Wave sécurisé</span>
                </div>
              </div>

              {/* CTA */}
              <div className="hero-cta">
                <Link to="/register" className="cta-button primary">
                  <ScanText size={20} />
                  <span>Trouver un médicament</span>
                  <ArrowRight size={20} className="cta-arrow" />
                </Link>
                <Link to="/register?role=PHARMACIE" className="cta-button secondary">
                  <Building2 size={20} />
                  <span>Inscrire ma pharmacie</span>
                  <ChevronRight size={20} />
                </Link>
              </div>
            </div>

            {/* Visuel carte médicale */}
            <div className="hero-visual" data-aos="fade-left" data-aos-delay="200">
              <div className="medical-floating-card">
                <div className="card-glow" />
                
                {/* Header pharmacie */}
                <div className="card-pharmacy-header">
                  <div className="pharmacy-cross">
                    <div className="cross-h" />
                    <div className="cross-v" />
                  </div>
                  <div>
                    <h3>Pharmacie du Plateau</h3>
                    <span className="open-badge">Ouverte 24h/24</span>
                  </div>
                </div>

                {/* Ordonnance preview */}
                <div className="prescription-preview">
                  <div className="rx-badge">Rx</div>
                  <div className="med-item">
                    <Droplets size={18} />
                    <div>
                      <strong>Paracétamol 500mg</strong>
                      <span>Disponible • 1 500 FCFA</span>
                    </div>
                  </div>
                  <div className="med-item">
                    <Sun size={18} />
                    <div>
                      <strong>Vitamine C 1000mg</strong>
                      <span>Disponible • 2 200 FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Bouton livraison */}
                <div className="delivery-estimate">
                  <Navigation size={16} />
                  <span>Livraison en 15 min</span>
                  <div className="estimate-pulse" />
                </div>
              </div>

              {/* Badge flottant confirmation */}
              <div className="floating-badge confirm-badge">
                <CheckCircle2 size={16} />
                <span>Commande confirmée</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATISTIQUES ANIMÉES
      ══════════════════════════════════════════════════════ */}
      <section className="stats-section" ref={statsRef}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="stats-grid">
            <div className="stat-card" data-aos="fade-up">
              <div className="stat-icon-wrapper patients">
                <Users size={24} />
              </div>
              <div className="stat-number">
                +{counters.patients.toLocaleString()}
              </div>
              <div className="stat-label">Patients satisfaits</div>
              <div className="stat-card-pattern" />
            </div>

            <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
              <div className="stat-icon-wrapper pharmacies">
                <Building2 size={24} />
              </div>
              <div className="stat-number">
                {counters.pharmacies}+
              </div>
              <div className="stat-label">Pharmacies partenaires</div>
              <div className="stat-card-pattern" />
            </div>

            <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
              <div className="stat-icon-wrapper deliveries">
                <Package size={24} />
              </div>
              <div className="stat-number">
                +{counters.deliveries.toLocaleString()}
              </div>
              <div className="stat-label">Livraisons effectuées</div>
              <div className="stat-card-pattern" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SERVICES - Cartes Verre Dépoli
      ══════════════════════════════════════════════════════ */}
      <section id="services" className="services-section">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">
              <Leaf size={14} />
              Nos services
            </span>
            <h2 className="section-title">
              Une expérience santé{' '}
              <span className="title-highlight">repensée pour l'Afrique</span>
            </h2>
            <p className="section-description">
              MEDS connecte patients, pharmacies et livreurs sur une plateforme 
              intelligente, pensée pour les réalités locales.
            </p>
          </div>

          <div className="services-grid">
            {/* Service 1 */}
            <div className="service-card" data-aos="fade-up">
              <div className="service-accent green" />
              <div className="service-icon-container">
                <MapPin size={28} className="service-icon" />
              </div>
              <h3 className="service-title">Géolocalisation intelligente</h3>
              <p className="service-description">
                Visualisez instantanément les pharmacies ouvertes autour de vous 
                et vérifiez la disponibilité de vos médicaments en temps réel.
              </p>
              <div className="service-features">
                <span className="service-feature">
                  <CheckCircle2 size={14} />
                  GPS en temps réel
                </span>
                <span className="service-feature">
                  <CheckCircle2 size={14} />
                  Stock actualisé
                </span>
              </div>
            </div>

            {/* Service 2 */}
            <div className="service-card" data-aos="fade-up" data-aos-delay="100">
              <div className="service-accent blue" />
              <div className="service-icon-container">
                <ScanText size={28} className="service-icon" />
              </div>
              <h3 className="service-title">IA & Scan d'ordonnance</h3>
              <p className="service-description">
                Photographiez votre ordonnance. Notre IA extrait automatiquement 
                vos médicaments et prépare votre panier.
              </p>
              <div className="service-features">
                <span className="service-feature">
                  <CheckCircle2 size={14} />
                  Reconnaissance OCR
                </span>
                <span className="service-feature">
                  <CheckCircle2 size={14} />
                  Détection automatique
                </span>
              </div>
            </div>

            {/* Service 3 */}
            <div className="service-card" data-aos="fade-up" data-aos-delay="200">
              <div className="service-accent gold" />
              <div className="service-icon-container">
                <Package size={28} className="service-icon" />
              </div>
              <h3 className="service-title">Paiement & Livraison</h3>
              <p className="service-description">
                Payez en toute sécurité via Wave ou mobile money. Suivez 
                votre livraison en direct jusqu'à votre porte.
              </p>
              <div className="service-features">
                <span className="service-feature">
                  <CheckCircle2 size={14} />
                  Paiement Wave
                </span>
                <span className="service-feature">
                  <CheckCircle2 size={14} />
                  Suivi en direct
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BENTO CARDS - Patient & Pharmacie
      ══════════════════════════════════════════════════════ */}
      <section id="pharmacies" className="bento-section">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="bento-grid">
            {/* Carte Patient */}
            <div className="bento-card patient-card" data-aos="fade-right">
              <div className="bento-bg-gradient" />
              <div className="bento-pattern" />
              
              <div className="bento-content">
                <div className="bento-icon-wrapper">
                  <Heart size={32} className="bento-icon" />
                </div>
                <h3 className="bento-title">
                  Se soigner ne devrait pas être un{' '}
                  <span className="bento-highlight">parcours du combattant.</span>
                </h3>
                <p className="bento-description">
                  Trouvez, commandez et recevez vos médicaments depuis votre téléphone, 
                  à toute heure du jour et de la nuit.
                </p>
                
                <div className="bento-features">
                  <span><CheckCircle2 size={14} /> Livraison express</span>
                  <span><CheckCircle2 size={14} /> Prix transparents</span>
                  <span><CheckCircle2 size={14} /> Service 24h/24</span>
                </div>

                <Link to="/register" className="bento-button">
                  <span>Je suis patient</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Carte Pharmacie */}
            <div className="bento-card pharmacy-card" data-aos="fade-left">
              <div className="bento-bg-gradient light" />
              <div className="bento-pattern light" />
              
              <div className="bento-content">
                <div className="bento-icon-wrapper">
                  <Building2 size={32} className="bento-icon" />
                </div>
                <h3 className="bento-title dark">
                  Développez votre pharmacie avec{' '}
                  <span className="bento-highlight green">MEDS Network.</span>
                </h3>
                <p className="bento-description dark">
                  Inscrivez votre officine, gérez vos stocks en ligne et recevez 
                  des commandes directement. Sans commission les 30 premiers jours.
                </p>
                
                <div className="bento-features">
                  <span><CheckCircle2 size={14} /> Gestion des stocks</span>
                  <span><CheckCircle2 size={14} /> Clients en ligne</span>
                  <span><CheckCircle2 size={14} /> 0% commission</span>
                </div>

                <Link to="/register?role=PHARMACIE" className="bento-button secondary">
                  <span>Inscrire ma pharmacie</span>
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROCESSUS - 3 Étapes
      ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="process-section">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">
              <Zap size={14} />
              Simple et rapide
            </span>
            <h2 className="section-title">
              En 3 étapes, vos médicaments{' '}
              <span className="title-highlight">arrivent chez vous</span>
            </h2>
          </div>

          <div className="process-grid">
            <div className="process-visual" data-aos="fade-right">
              <div className="process-mockup">
                <div className="mockup-screen">
                  {/* Résultats de recherche mockup */}
                  <div className="mockup-search">
                    <p className="mockup-label">Résultats pour</p>
                    <p className="mockup-drug">Paracétamol 500mg</p>
                    <span className="mockup-available">3 pharmacies</span>
                  </div>
                  
                  <div className="mockup-list">
                    {[
                      { name: 'Pharmacie Plateau', dist: '0.4 km', price: '1 500 FCFA', open: true },
                      { name: 'Pharmacie Médina', dist: '1.2 km', price: '1 400 FCFA', open: true },
                      { name: 'Pharmacie Sacré-Cœur', dist: '2.1 km', price: '1 600 FCFA', open: false },
                    ].map((item) => (
                      <div key={item.name} className={`mockup-item ${!item.open ? 'closed' : ''}`}>
                        <MapPin size={16} className={item.open ? 'text-green' : 'text-gray'} />
                        <div className="mockup-item-info">
                          <strong>{item.name}</strong>
                          <span>{item.dist} · {item.price}</span>
                        </div>
                        <span className={`mockup-status ${item.open ? 'open' : 'closed'}`}>
                          {item.open ? 'Ouvert' : 'Fermé'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge livraison flottant */}
              <div className="process-badge delivery-badge">
                <Navigation size={16} />
                <div>
                  <strong>12 min</strong>
                  <span>Livraison estimée</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            <div className="process-steps" data-aos="fade-left">
              {[
                {
                  step: '01',
                  title: 'Recherchez ou scannez',
                  desc: 'Tapez le nom du médicament ou photographiez votre ordonnance. L\'IA détecte automatiquement votre traitement.',
                  icon: <ScanText size={24} />
                },
                {
                  step: '02',
                  title: 'Choisissez et payez',
                  desc: 'Sélectionnez la pharmacie la plus proche, confirmez votre commande et payez via Wave en toute sécurité.',
                  icon: <ShieldCheck size={24} />
                },
                {
                  step: '03',
                  title: 'Recevez chez vous',
                  desc: 'Un livreur est assigné immédiatement. Suivez sa position en temps réel jusqu\'à votre domicile.',
                  icon: <Package size={24} />
                }
              ].map((item, index) => (
                <div key={item.step} className="process-step">
                  <div className="step-marker">
                    <div className="step-number">{item.step}</div>
                    {index < 2 && <div className="step-connector" />}
                  </div>
                  <div className="step-content">
                    <div className="step-icon-wrapper">
                      {item.icon}
                    </div>
                    <h4 className="step-title">{item.title}</h4>
                    <p className="step-description">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TÉMOIGNAGES
      ══════════════════════════════════════════════════════ */}
      <section className="testimonials-section">
        <div className="african-pattern-bg" />
        <div className="container mx-auto px-6 lg:px-12">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">
              <Star size={14} />
              Ils nous font confiance
            </span>
            <h2 className="section-title">
              Ce que disent nos{' '}
              <span className="title-highlight">utilisateurs</span>
            </h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name} 
                className="testimonial-card"
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <div className="testimonial-accent" />
                <div className="testimonial-stars">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} size={16} className="star-filled" />
                  ))}
                </div>
                <blockquote className="testimonial-text">
                  <span className="quote-mark">"</span>
                  {testimonial.text}
                  <span className="quote-mark">"</span>
                </blockquote>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.initials}
                  </div>
                  <div className="author-info">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs mobile */}
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`Témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════ */}
      <section className="final-cta">
        <div className="cta-background">
          <div className="cta-gradient-overlay" />
          <div className="cta-grid-pattern" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="cta-content" data-aos="fade-up">
            <div className="cta-badge">
              <Sparkles size={16} />
              Rejoignez la révolution santé
            </div>
            
            <h2 className="cta-title">
              Prêt à transformer
              <br />
              <span className="cta-title-highlight">l'accès à votre santé ?</span>
            </h2>
            
            <p className="cta-description">
              Rejoignez les milliers de Sénégalais qui font confiance à MEDS 
              pour leur santé au quotidien.
            </p>
            
            <div className="cta-actions">
              <Link to="/register" className="cta-main-button">
                <Heart size={20} className="cta-heart" />
                <span>Créer mon compte gratuitement</span>
                <ArrowRight size={20} />
              </Link>
              
              <a href="tel:+221000000000" className="cta-call-button">
                <Phone size={18} />
                <span>Nous appeler</span>
              </a>
            </div>
            
            <div className="cta-trust">
              <div className="trust-item">
                <ShieldCheck size={14} />
                Sécurisé et crypté
              </div>
              <div className="trust-item">
                <CheckCircle2 size={14} />
                Support 24h/24
              </div>
              <div className="trust-item">
                <Award size={14} />
                Certifié
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;