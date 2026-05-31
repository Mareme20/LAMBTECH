import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import {
  MapPin, ScanText, ShieldCheck,
  ArrowRight, CheckCircle2, Zap, BookOpen, Award,
  ChevronRight, Star, Package, Navigation, Phone
} from 'lucide-react';

const Home: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 750, once: true, offset: 50 });
  }, []);

  return (
    <div className="flex flex-col font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="min-h-screen pt-28 pb-20 relative flex flex-col justify-center">
        {/* Aurora blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] pointer-events-none animate-blob gpu-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none animate-blob gpu-blob" style={{ animationDelay: '4s' }} />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Tagline badge */}
            <div className="badge-pill mb-8 mx-auto w-max" data-aos="fade-down">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              Disponible 24h/24 — Dakar & alentours
            </div>

            <h1 className="font-outfit text-5xl md:text-6xl lg:text-[5rem] font-black leading-[1.08] mb-8 text-primary tracking-tight" data-aos="fade-up">
              Vos médicaments,{' '}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-300 italic font-heading pr-2">livrés en minutes.</span>
            </h1>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm font-semibold text-gray-500 mb-12" data-aos="fade-up" data-aos-delay="100">
              <span className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-soft border border-gray-50">
                <MapPin className="w-4 h-4 text-accent" /> Pharmacies à proximité
              </span>
              <span className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-soft border border-gray-50">
                <ScanText className="w-4 h-4 text-accent" /> Scan IA d'ordonnance
              </span>
              <span className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-soft border border-gray-50">
                <Package className="w-4 h-4 text-accent" /> Paiement Wave
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
              <Link to="/register" className="btn-primary text-base px-10 py-4">
                Trouver un médicament <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register?role=PHARMACIE" className="btn-ghost text-base px-10 py-4">
                Inscrire ma pharmacie
              </Link>
            </div>
          </div>

          {/* 3-Card hero layout (inspired by TerangaLearn) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 relative max-w-5xl mx-auto">
            {/* Left float card */}
            <div className="w-full md:w-1/3 flex justify-center" data-aos="fade-right">
              <div className="w-60 h-72 bg-surfaceAlt rounded-5xl relative overflow-hidden border border-gray-100 shadow-float flex items-end justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                <div className="absolute top-6 left-6 right-6 text-left">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">MEDS AI</div>
                  <p className="font-outfit font-black text-2xl text-primary leading-tight">Scan votre ordonnance</p>
                </div>
                {/* Floating badge */}
                <div className="absolute -left-4 bottom-12 bg-white px-4 py-3 rounded-2xl z-20 flex items-center gap-3 shadow-float border border-gray-100 animate-float">
                  <div className="bg-accent/10 p-2 rounded-xl"><CheckCircle2 className="w-5 h-5 text-accent" /></div>
                  <div>
                    <p className="text-primary text-xs font-bold">Détecté</p>
                    <p className="text-gray-400 text-[10px]">Paracétamol 500mg</p>
                  </div>
                </div>
                <div className="w-full h-32 bg-gradient-to-t from-white/80 to-transparent absolute bottom-0" />
              </div>
            </div>

            {/* Center CTA */}
            <div className="w-full md:w-1/3 flex flex-col items-center z-30 py-12 md:py-0" data-aos="zoom-in">
              <p className="text-sm text-gray-500 font-medium max-w-[260px] text-center leading-relaxed mb-8">
                Accédez à vos traitements sans vous déplacer. Fiable, rapide, sécurisé.
              </p>
              <Link to="/register" className="btn-primary">
                Commencer <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="mt-6 flex -space-x-2">
                {['AD','FK','MB','ND'].map((ini, i) => (
                  <div key={ini} className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-emerald-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md" style={{animationDelay:`${i*0.1}s`}}>
                    {ini}
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full bg-surfaceAlt border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500 shadow-md">+</div>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-2">+2 400 patients nous font confiance</p>
            </div>

            {/* Right float card */}
            <div className="w-full md:w-1/3 flex justify-center" data-aos="fade-left">
              <div className="w-60 h-72 bg-primary rounded-5xl relative overflow-hidden border border-white/10 shadow-glow-dark flex items-end justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <div className="absolute top-6 left-6 right-6 text-left">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Livraison</div>
                  <p className="font-outfit font-black text-2xl text-white leading-tight">En route vers chez vous</p>
                </div>
                {/* Floating badge */}
                <div className="absolute -right-4 bottom-12 bg-white px-4 py-3 rounded-2xl z-20 flex items-center gap-3 shadow-float border border-gray-100 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="bg-blue-50 p-2 rounded-xl"><Navigation className="w-5 h-5 text-blue-500" /></div>
                  <div>
                    <p className="text-primary text-xs font-bold">Arrivée</p>
                    <p className="text-gray-400 text-[10px]">Dans ~12 min</p>
                  </div>
                </div>
                <div className="w-full h-32 bg-gradient-to-t from-primary/80 to-transparent absolute bottom-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-6 lg:px-12 mb-28" data-aos="fade-up">
        <div className="bg-white rounded-5xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40">
          {[
            { icon: <Zap className="w-5 h-5 text-accent" />, stat: '< 30 min', desc: 'Délai moyen de livraison en zone urbaine.', className: 'stat-divider pb-8 md:pb-0 md:pr-10' },
            { icon: <BookOpen className="w-5 h-5 text-primary" />, stat: '340+', desc: 'Médicaments disponibles dans le réseau.', className: 'stat-divider py-8 md:py-0 md:px-10' },
            { icon: <Award className="w-5 h-5 text-accent" />, stat: '24/7', desc: 'Accès aux pharmacies de garde géolocalisées.', className: 'pt-8 md:pt-0 md:pl-10' },
          ].map(({ icon, stat, desc, className }) => (
            <div key={stat} className={`flex items-start gap-4 w-full md:w-1/3 ${className}`}>
              <div className="w-12 h-12 bg-surfaceAlt border border-gray-200 rounded-2xl flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div>
                <h3 className="font-outfit text-primary text-3xl font-black mb-1">{stat}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[200px]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section id="services" className="container mx-auto px-6 lg:px-12 mb-32 text-center">
        <span className="section-label" data-aos="fade-up">Pour tous vos besoins</span>
        <h2 className="font-outfit text-4xl md:text-5xl font-black text-primary mb-4 mt-3" data-aos="fade-up" data-aos-delay="100">
          Une expérience santé <br />
          <span className="italic font-heading text-accent">repensée pour l'Afrique.</span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-16 font-medium" data-aos="fade-up" data-aos-delay="150">
          MEDS connecte patients, pharmacies et livreurs sur une seule plateforme intelligente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <MapPin className="w-7 h-7 text-accent" />, bg: 'bg-accent/10', border: 'border-accent/30', title: 'Géolocalisation intelligente', desc: 'Visualisez instantanément les pharmacies ouvertes autour de vous et vérifiez la disponibilité de vos médicaments en temps réel, sans appel.' },
            { icon: <ScanText className="w-7 h-7 text-primary" />, bg: 'bg-primary/10', border: 'border-primary/20', title: 'IA & Scan d\'ordonnance', desc: 'Photographiez votre ordonnance. Notre moteur OCR extrait automatiquement vos médicaments et prépare votre panier. Plus d\'erreur de frappe.' },
            { icon: <Package className="w-7 h-7 text-blue-500" />, bg: 'bg-blue-50', border: 'border-blue-200', title: 'Paiement & Livraison', desc: 'Payez en toute sécurité via Wave. Un livreur est assigné automatiquement dès la confirmation. Suivez votre livraison en direct.' },
          ].map(({ icon, bg, border, title, desc }, i) => (
            <div key={title} className="glass-card p-8 rounded-4xl text-left" data-aos="fade-up" data-aos-delay={i * 100}>
              <div className={`w-16 h-16 ${bg} rounded-3xl mb-6 flex items-center justify-center border ${border}`}>
                {icon}
              </div>
              <h3 className="font-outfit font-black text-primary text-xl mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BENTO — 2 CTA CARDS (comme TerangaLearn)
      ══════════════════════════════════════════════════════ */}
      <section id="pharmacies" className="container mx-auto px-6 lg:px-12 mb-28 grid md:grid-cols-2 gap-8">
        {/* Dark card — Patient */}
        <div className="bg-primary rounded-5xl p-10 md:p-14 flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-primary/20 group" data-aos="fade-right">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -z-0" />
          <Package className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5 rotate-12 transition-transform group-hover:scale-110" />
          <h3 className="font-outfit font-black text-3xl md:text-4xl text-white mb-5 max-w-sm leading-tight z-10">
            Se soigner ne devrait pas être un <span className="italic font-heading text-accent/90">parcours du combattant.</span>
          </h3>
          <p className="text-sm text-gray-300 max-w-xs mb-8 z-10 font-medium leading-relaxed">
            Trouvez, commandez et recevez vos médicaments depuis votre téléphone, à toute heure.
          </p>
          <Link to="/register" className="btn-primary w-max z-10">
            Je suis patient <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Light card — Pharmacie */}
        <div className="bg-white rounded-5xl p-10 md:p-14 flex flex-col justify-center relative overflow-hidden border border-gray-100 shadow-float group" data-aos="fade-left">
          <div className="absolute inset-0 bg-gradient-to-bl from-accent/5 to-transparent" />
          <div className="absolute right-0 top-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -z-0" />
          <ShieldCheck className="absolute -right-4 top-8 w-48 h-48 text-accent/5 rotate-[-15deg] transition-transform group-hover:scale-110" />
          <h3 className="font-outfit font-black text-3xl md:text-4xl text-primary mb-5 max-w-sm leading-tight z-10">
            Développez votre pharmacie avec{' '}
            <span className="text-accent underline decoration-2 underline-offset-4">MEDS Network.</span>
          </h3>
          <p className="text-sm text-gray-500 max-w-xs mb-8 z-10 font-medium leading-relaxed">
            Inscrivez votre pharmacie, gérez vos stocks en ligne et recevez des commandes directement. Sans commission sur les premières 30 jours.
          </p>
          <Link to="/register?role=PHARMACIE" className="btn-dark w-max z-10">
            Inscrire ma pharmacie <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="container mx-auto px-6 lg:px-12 mb-32 grid md:grid-cols-2 gap-16 items-center">
        <div data-aos="fade-right">
          <span className="section-label">Simple et rapide</span>
          <h2 className="font-outfit text-4xl md:text-5xl font-black text-primary leading-[1.1] mb-6 mt-3">
            En 3 étapes,<br />
            vos médicaments<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-300">arrivent chez vous.</span>
          </h2>
          <div className="space-y-8 mt-10">
            {[
              { step: '01', title: 'Recherchez ou scannez', desc: 'Tapez le nom du médicament ou photographiez votre ordonnance. L\'IA détecte automatiquement votre traitement.' },
              { step: '02', title: 'Choisissez et payez', desc: 'Sélectionnez la pharmacie la plus proche disponible, confirmez votre commande et payez via Wave en 2 secondes.' },
              { step: '03', title: 'Recevez chez vous', desc: 'Un livreur est assigné immédiatement. Suivez sa position en temps réel jusqu\'à votre domicile.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-5">
                <div className="w-12 h-12 bg-accent/10 text-accent font-outfit font-black text-sm rounded-2xl flex items-center justify-center shrink-0 border border-accent/20">
                  {step}
                </div>
                <div>
                  <h4 className="font-outfit font-black text-primary text-base mb-1">{title}</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UI Mockup */}
        <div className="relative" data-aos="fade-left">
          <div className="bg-white rounded-5xl p-3 border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden">
            {/* Fake app mockup */}
            <div className="bg-surfaceAlt rounded-4xl p-6 h-[440px] overflow-hidden relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Résultats pour</p>
                  <p className="font-outfit font-black text-primary text-xl">Paracétamol 500mg</p>
                </div>
                <span className="bg-accent/10 text-accent text-xs font-black px-3 py-1.5 rounded-full">3 dispo</span>
              </div>
              {[
                { name: 'Pharmacie Plateau', dist: '0.4 km', price: '1 500 FCFA', status: 'Ouvert', open: true },
                { name: 'Pharmacie Médina', dist: '1.2 km', price: '1 400 FCFA', status: 'Ouvert', open: true },
                { name: 'Pharmacie Sacré-Cœur', dist: '2.1 km', price: '1 600 FCFA', status: 'Fermé', open: false },
              ].map((item) => (
                <div key={item.name} className="glass-card rounded-3xl p-4 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.open ? 'bg-accent/10' : 'bg-gray-100'}`}>
                      <MapPin className={`w-5 h-5 ${item.open ? 'text-accent' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="font-outfit font-bold text-primary text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.dist} · {item.price}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${item.open ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-400'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute -left-10 top-16 bg-white px-5 py-4 rounded-3xl z-20 w-52 border border-gray-100 shadow-float animate-float">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Livraison</span>
              <Navigation className="w-4 h-4 text-accent" />
            </div>
            <p className="font-outfit font-black text-primary text-lg">12 min</p>
            <div className="w-full bg-surfaceAlt h-1.5 rounded-full mt-2">
              <div className="bg-gradient-to-r from-accent to-emerald-300 w-3/5 h-full rounded-full" />
            </div>
          </div>

          <div className="absolute -right-6 bottom-16 bg-primary px-5 py-4 rounded-3xl z-20 shadow-2xl shadow-black/20 flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-white text-sm font-outfit font-black">Commande confirmée</p>
              <p className="text-gray-400 text-xs font-medium">Paiement Wave reçu ✓</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-surfaceAlt border-y border-gray-100 py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="section-label" data-aos="fade-up">Ils nous font confiance</span>
            <h2 className="font-outfit text-4xl md:text-5xl font-black text-primary mt-3" data-aos="fade-up" data-aos-delay="100">
              Ce que disent nos <span className="italic font-heading text-accent">utilisateurs.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Aissatou D.', role: 'Patiente — Dakar', stars: 5, text: 'J\'ai commandé du Doliprane à 23h pour ma fille, livré en 25 minutes. Incroyable. Je ne reviendrai jamais à l\'ancienne méthode.' },
              { name: 'Dr. Ibrahima S.', role: 'Pharmacien — Plateau', stars: 5, text: 'Depuis que nous avons rejoint MEDS, nos ventes en ligne ont triplé. La gestion des stocks en temps réel est une vraie révolution.' },
              { name: 'Moussa K.', role: 'Livreur indépendant', stars: 5, text: 'J\'ai augmenté mes revenus de 40% ce mois-ci. L\'application est simple, les courses sont proches et le paiement est immédiat.' },
            ].map(({ name, role, stars, text }, i) => (
              <div key={name} className="glass-card p-8 rounded-4xl" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="flex gap-1 mb-4">
                  {Array(stars).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center text-white text-sm font-black">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-outfit font-black text-primary text-sm">{name}</p>
                    <p className="text-xs text-gray-400 font-medium">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.03),transparent_50%)]" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center" data-aos="fade-up">
          <h2 className="font-outfit text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Prêt à transformer<br />
            <span className="italic font-heading text-accent">l'accès à votre santé ?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-xl mx-auto font-medium">
            Rejoignez des milliers de patients et de pharmacies qui font confiance à MEDS au quotidien.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-primary text-base px-10 py-4">
              Créer mon compte gratuitement
            </Link>
            <a href="tel:+221000000000" className="btn-ghost bg-transparent border-white/20 text-white hover:bg-white/10 text-base px-10 py-4">
              <Phone className="w-5 h-5" /> Nous appeler
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
