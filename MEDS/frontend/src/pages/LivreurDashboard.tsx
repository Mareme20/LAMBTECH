import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Navigation, MapPin, Clock, CheckCircle2, XCircle, Truck, Star, Calendar } from 'lucide-react';

/* ─── Page: Accueil Livreur ─── */
const LivreurHome: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const courses = [
    { id: '#MEDS-0042', from: 'Pharmacie Plateau', to: 'Cité Keur Gorgui', client: 'Aissatou D.', dist: '2.3 km', gain: '1 200 FCFA', status: 'assigned' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-outfit font-black text-3xl text-primary">Espace Livreur</h1>
          <p className="text-gray-500 mt-1 font-medium">Gérez vos courses et votre disponibilité</p>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-3xl px-6 py-4 border border-gray-100 shadow-soft">
          <div>
            <p className="font-outfit font-black text-primary text-sm">Disponibilité</p>
            <p className={`text-xs font-bold mt-0.5 ${isOnline ? 'text-accent' : 'text-gray-400'}`}>
              {isOnline ? '● En ligne — En attente' : '○ Hors ligne'}
            </p>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none ${isOnline ? 'bg-accent shadow-glow-green' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${isOnline ? 'left-8' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Courses ce mois', value: '28', icon: <Truck size={20} className="text-accent" />, bg: 'bg-accent/10' },
          { label: 'Gains (FCFA)', value: '32 400', icon: <Star size={20} className="text-yellow-400" />, bg: 'bg-yellow-50' },
          { label: 'Note moyenne', value: '4.9 ★', icon: <Star size={20} className="text-yellow-400 fill-yellow-400" />, bg: 'bg-yellow-50' },
          { label: 'Km parcourus', value: '142 km', icon: <Navigation size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft">
            <div className={`w-11 h-11 ${s.bg} rounded-2xl flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="font-outfit font-black text-primary text-2xl">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-outfit font-black text-primary text-lg">Course en attente</h2>
          </div>
          {!isOnline ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4"><Truck size={28} className="text-gray-300" /></div>
              <p className="font-outfit font-black text-primary text-lg mb-2">Vous êtes hors ligne</p>
              <p className="text-gray-400 text-sm font-medium">Activez votre disponibilité pour recevoir des courses</p>
            </div>
          ) : (
            <div>
              {courses.length > 0 ? courses.map(c => (
                <div key={c.id} className="p-6">
                  <div className="bg-accent/5 border border-accent/20 rounded-3xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-outfit font-black text-primary text-sm">{c.id}</span>
                      <span className="text-xs font-black px-3 py-1.5 rounded-full bg-blue-50 text-blue-500 animate-pulse">Nouvelle course !</span>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center shrink-0 mt-0.5"><MapPin size={14} className="text-white" /></div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Départ</p>
                          <p className="font-outfit font-black text-primary text-sm">{c.from}</p>
                        </div>
                      </div>
                      <div className="ml-3.5 w-px h-4 bg-gray-200" />
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5"><Navigation size={14} className="text-accent" /></div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Destination</p>
                          <p className="font-outfit font-black text-primary text-sm">{c.to}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{c.client}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold">
                      <span className="flex items-center gap-1 text-gray-500"><Navigation size={14} className="text-accent" />{c.dist}</span>
                      <span className="flex items-center gap-1 text-accent">{c.gain}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 bg-red-50 text-red-400 font-bold text-sm py-3 rounded-2xl hover:bg-red-100 transition-colors">
                      <XCircle size={16} /> Refuser
                    </button>
                    <button className="btn-primary justify-center text-sm py-3 rounded-2xl">
                      <CheckCircle2 size={16} /> Accepter
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse"><Clock size={28} className="text-accent" /></div>
                  <p className="font-outfit font-black text-primary text-lg mb-2">En attente d'une course</p>
                  <p className="text-gray-400 text-sm font-medium">Vous serez notifié dès qu'une course est disponible</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Historique Courses ─── */
const CoursesHistoryPage: React.FC = () => {
  const history = [
    { id: '#MEDS-0039', client: 'Moussa K.', dist: '1.8 km', gain: '1 000 FCFA', date: 'Aujourd\'hui 09:30', note: 5, from: 'Pharmacie Fann', to: 'Point E' },
    { id: '#MEDS-0035', client: 'Fatou S.', dist: '3.1 km', gain: '1 500 FCFA', date: 'Hier 17:45', note: 5, from: 'Pharmacie Mermoz', to: 'Almadies' },
    { id: '#MEDS-0031', client: 'Cheikh B.', dist: '0.9 km', gain: '800 FCFA', date: 'Hier 14:20', note: 4, from: 'Pharmacie Plateau', to: 'Dakar Ville' },
  ];

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-outfit font-black text-3xl text-primary">Mes Courses</h1>
          <p className="text-gray-500 mt-1 font-medium">Historique complet de vos livraisons</p>
        </div>
        <button className="btn-ghost py-2.5 px-4 text-sm flex items-center gap-2"><Calendar size={16}/> Filtrer par date</button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="hidden md:grid grid-cols-6 px-6 py-4 bg-surfaceAlt text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <span className="col-span-2">Détails Trajet</span><span>Client</span><span>Date</span><span>Distance</span><span className="text-right">Gains & Note</span>
        </div>
        <div className="divide-y divide-gray-50">
          {history.map(h => (
            <div key={h.id} className="grid md:grid-cols-6 px-6 py-5 hover:bg-surfaceAlt/50 transition-colors gap-y-4 items-center">
              <div className="col-span-2">
                <p className="font-outfit font-black text-primary text-sm">{h.id}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{h.from}</span>
                  <ChevronRight size={10} className="text-gray-300"/>
                  <span className="text-xs font-bold text-gray-600">{h.to}</span>
                </div>
              </div>
              <span className="font-bold text-primary text-sm">{h.client}</span>
              <span className="text-xs text-gray-500 font-medium">{h.date}</span>
              <span className="text-sm font-bold text-gray-600 flex items-center gap-1"><Navigation size={14} className="text-accent"/> {h.dist}</span>
              <div className="text-right">
                <p className="font-outfit font-black text-accent text-base">{h.gain}</p>
                <p className="text-xs text-yellow-400 font-bold mt-0.5">{'★'.repeat(h.note)}{'☆'.repeat(5 - h.note)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Routeur interne Livreur ─── */
const LivreurDashboard: React.FC = () => {
  const path = window.location.pathname;
  const page = path.includes('/livreur/courses') ? <CoursesHistoryPage /> : <LivreurHome />;

  return (
    <DashboardLayout role="LIVREUR" userName="Lamine G.">
      {page}
    </DashboardLayout>
  );
};

export default LivreurDashboard;
