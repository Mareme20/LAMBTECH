import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Stethoscope, CheckCircle2 } from 'lucide-react';
import AOS from 'aos';

const AuthLayout: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-14 overflow-hidden bg-primary">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] gpu-blob" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] gpu-blob" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 w-max">
            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-accent" />
            </div>
            <span className="font-outfit font-black text-2xl text-white tracking-tight">
              MEDS<span className="text-accent">.</span>
            </span>
          </Link>
        </div>

        {/* Main pitch */}
        <div className="relative z-10 my-auto">
          <h1 className="font-outfit font-black text-4xl lg:text-5xl text-white leading-[1.1] mb-6">
            Votre santé,<br />
            <span className="italic font-heading text-accent">simplifiée.</span>
          </h1>
          <p className="text-gray-300 font-medium text-base max-w-sm leading-relaxed mb-10">
            Accédez à vos médicaments, gérez vos ordonnances et suivez vos livraisons, le tout en quelques secondes.
          </p>
          <div className="space-y-4">
            {[
              'Pharmacies géolocalisées en temps réel',
              'Scan IA d\'ordonnance en 10 secondes',
              'Livraison en moins de 30 minutes',
              'Paiement sécurisé via Wave',
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="text-accent" />
                </div>
                <p className="text-gray-300 text-sm font-medium">{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
          <p className="text-white text-sm font-medium italic leading-relaxed mb-4">
            "J'ai commandé du Doliprane à 23h pour ma fille fébrile, livré en 25 min. MEDS m'a sauvé la mise !"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center text-white text-xs font-black">AD</div>
            <div>
              <p className="text-white text-sm font-bold">Aissatou Diallo</p>
              <p className="text-gray-400 text-xs font-medium">Patiente — Dakar</p>
            </div>
            <div className="ml-auto text-yellow-400 text-xs font-black">★★★★★</div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 py-12 relative bg-surface">
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-12 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-accent" />
          </div>
          <span className="font-outfit font-black text-xl text-primary">MEDS<span className="text-accent">.</span></span>
        </Link>

        <div className="w-full max-w-md" data-aos="fade-up">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
