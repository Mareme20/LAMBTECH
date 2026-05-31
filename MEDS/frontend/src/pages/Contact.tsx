import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="pt-32 pb-20 animate-fade-up">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-block section-label">Contactez-nous</div>
          <h1 className="font-outfit font-black text-4xl md:text-5xl text-primary mb-4">Nous sommes à votre écoute</h1>
          <p className="text-gray-500 font-medium">Une question, un partenariat, un problème avec une commande ?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0"><Phone className="text-accent" /></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Téléphone</p><p className="font-outfit font-black text-xl text-primary">+221 77 123 45 67</p></div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0"><Mail className="text-blue-500" /></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p><p className="font-outfit font-black text-xl text-primary">contact@meds.sn</p></div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0"><MapPin className="text-purple-500" /></div>
              <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bureaux</p><p className="font-outfit font-black text-xl text-primary">Dakar, Sénégal</p></div>
            </div>
          </div>

          <form className="bg-white p-10 rounded-3xl shadow-float border border-gray-100 space-y-5">
            <h2 className="font-outfit font-black text-2xl text-primary mb-6">Envoyez un message</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-gray-600 mb-2">Prénom</label><input type="text" className="form-input" placeholder="Aissatou" /></div>
              <div><label className="block text-sm font-bold text-gray-600 mb-2">Nom</label><input type="text" className="form-input" placeholder="Diallo" /></div>
            </div>
            <div><label className="block text-sm font-bold text-gray-600 mb-2">Email</label><input type="email" className="form-input" placeholder="votre@email.com" /></div>
            <div><label className="block text-sm font-bold text-gray-600 mb-2">Message</label><textarea className="form-input min-h-[120px] resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea></div>
            <button className="btn-primary w-full justify-center py-4 mt-4">Envoyer le message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
