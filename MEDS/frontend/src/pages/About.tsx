import React from 'react';
import { ShieldCheck, HeartPulse, Truck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20 animate-fade-up">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
        <div className="inline-block section-label">Notre Mission</div>
        <h1 className="font-outfit font-black text-4xl md:text-5xl lg:text-6xl text-primary leading-tight mb-6">
          Révolutionner l'accès aux <span className="text-accent">médicaments</span> au Sénégal.
        </h1>
        <p className="text-lg text-gray-500 font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
          MEDS est née d'un constat simple : trouver le bon médicament, surtout la nuit ou en cas d'urgence, est un parcours du combattant. Notre plateforme connecte directement les patients, les pharmacies et un réseau de coursiers dédiés.
        </p>
      </div>

      <div className="bg-surfaceAlt py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <HeartPulse size={28} className="text-accent" />, title: 'Santé avant tout', desc: 'Nous facilitons l\'accès aux traitements vitaux avec une plateforme pensée pour l\'urgence.' },
              { icon: <ShieldCheck size={28} className="text-accent" />, title: 'Confiance & Sécurité', desc: 'Toutes nos pharmacies partenaires sont agréées. Les ordonnances sont traitées avec la plus stricte confidentialité.' },
              { icon: <Truck size={28} className="text-accent" />, title: 'Rapidité absolue', desc: 'Grâce à notre algorithme de dispatching, la livraison est assurée en moins de 30 minutes.' },
            ].map(v => (
              <div key={v.title} className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {v.icon}
                </div>
                <h3 className="font-outfit font-black text-xl text-primary mb-3">{v.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
