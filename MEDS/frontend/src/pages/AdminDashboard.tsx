import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Users, ShoppingBag, TrendingUp, AlertCircle, MapPin, Activity, ChevronRight, Shield, HeartPulse } from 'lucide-react';

/* ─── Page: Accueil Admin ─── */
const AdminHome: React.FC = () => {
  const activity = [
    { type: 'Commande validée', detail: '#MEDS-0042 — Pharmacie Plateau', time: 'il y a 5 min', color: 'bg-accent/10 text-accent' },
    { type: 'Nouveau livreur', detail: 'Moussa K. s\'est inscrit', time: 'il y a 20 min', color: 'bg-blue-50 text-blue-500' },
    { type: 'Alerte stock', detail: 'Paracétamol — Pharmacie Médina (3 restants)', time: 'il y a 1h', color: 'bg-red-50 text-red-400' },
    { type: 'Paiement Wave', detail: 'Transaction #TXN-8821 reçue (1 400 FCFA)', time: 'il y a 2h', color: 'bg-accent/10 text-accent' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-outfit font-black text-3xl text-primary">Administration MEDS</h1>
        <p className="text-gray-500 mt-1 font-medium">Vue globale du système</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Utilisateurs', value: '2 418', icon: <Users size={20} className="text-accent" />, bg: 'bg-accent/10', trend: '+34' },
          { label: 'Commandes/mois', value: '1 245', icon: <ShoppingBag size={20} className="text-blue-500" />, bg: 'bg-blue-50', trend: '+12%' },
          { label: 'Recherches totales', value: '3 574', icon: <TrendingUp size={20} className="text-purple-500" />, bg: 'bg-purple-50', trend: '+8%' },
          { label: 'Alertes stock', value: '12', icon: <AlertCircle size={20} className="text-red-400" />, bg: 'bg-red-50', trend: '5 critiques' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft">
            <div className={`w-11 h-11 ${s.bg} rounded-2xl flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="font-outfit font-black text-primary text-2xl">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            <p className="text-xs text-accent font-bold mt-1">{s.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={18} className="text-accent" />
            <h2 className="font-outfit font-black text-primary text-lg">Activité système en direct</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {activity.map((a, i) => (
              <div key={i} className="py-4 last:pb-0">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${a.color}`}>{a.type}</span>
                <p className="text-sm text-gray-700 font-bold mt-2">{a.detail}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-1">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-primary rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center text-center items-center h-[400px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm border border-accent/20 shadow-glow-green">
            <Shield size={32} className="text-accent" />
          </div>
          <h2 className="font-outfit font-black text-white text-2xl mb-2">État du système : Optimal</h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">Serveurs Node.js et Base de données PostgreSQL fonctionnent correctement.</p>
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Utilisateurs ─── */
const UsersPage: React.FC = () => {
  const users = [
    { name: 'Aissatou Diallo', role: 'PATIENT', email: 'aissatou@email.com', date: '31 Mai 2026', status: 'Actif' },
    { name: 'Pharmacie Plateau', role: 'PHARMACIE', email: 'contact@plateau.sn', date: '12 Avr 2026', status: 'Actif' },
    { name: 'Moussa K.', role: 'LIVREUR', email: 'moussa@email.com', date: '28 Mai 2026', status: 'En vérification' },
  ];

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-outfit font-black text-3xl text-primary">Gestion des Utilisateurs</h1>
          <p className="text-gray-500 mt-1 font-medium">Patients, Pharmacies et Livreurs</p>
        </div>
        <button className="btn-primary py-2.5 px-6 text-sm">Ajouter un profil</button>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="hidden md:grid grid-cols-5 px-6 py-4 bg-surfaceAlt text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <span className="col-span-2">Utilisateur</span><span>Rôle</span><span>Date d'inscription</span><span>Statut</span>
        </div>
        <div className="divide-y divide-gray-50">
          {users.map((u, i) => (
            <div key={i} className="grid md:grid-cols-5 px-6 py-4 hover:bg-surfaceAlt/50 transition-colors gap-y-2 items-center">
              <div className="col-span-2 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center text-white text-sm font-black">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className="font-outfit font-black text-primary text-sm">{u.name}</p>
                  <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full w-max ${u.role === 'PATIENT' ? 'bg-blue-50 text-blue-500' : u.role === 'PHARMACIE' ? 'bg-accent/10 text-accent' : 'bg-purple-50 text-purple-500'}`}>{u.role}</span>
              <span className="text-xs text-gray-500 font-bold">{u.date}</span>
              <span className={`text-[11px] font-black px-3 py-1.5 rounded-full w-max ${u.status === 'Actif' ? 'bg-accent/10 text-accent' : 'bg-orange-50 text-orange-400'}`}>{u.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Épidémiologie & Prédiction IA ─── */
const EpiPage: React.FC = () => {
  const epi = [
    { med: 'Paracétamol 500mg', searches: 1240, lat: '14.69°N', lon: '17.44°W', trend: '+45%', alert: true },
    { med: 'Amoxicilline 1g', searches: 856, lat: '14.72°N', lon: '17.47°W', trend: '+5%', alert: false },
    { med: 'Antipaludéens', searches: 643, lat: '14.68°N', lon: '17.42°W', trend: '+82%', alert: true },
    { med: 'Vitamine C', searches: 314, lat: '14.71°N', lon: '17.43°W', trend: '+22%', alert: false },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-outfit font-black text-3xl text-primary">Prédiction Épidémiologique</h1>
          <span className="bg-accent/10 text-accent text-[10px] font-black uppercase px-2 py-1 rounded-md border border-accent/20">Propulsé par IA</span>
        </div>
        <p className="text-gray-500 font-medium">Modélisation et détection précoce d'épidémies locales</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-primary rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between h-[280px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} className="text-red-400" />
              <h2 className="font-outfit font-black text-white text-xl">Alerte IA : Risque d'épidémie détecté</h2>
            </div>
            <p className="text-gray-400 text-sm max-w-md">L'algorithme MEDS a détecté une hausse anormale des ventes et recherches d'Antipaludéens (+82%) et de Paracétamol (+45%) dans la zone de la Médina sur les dernières 48h.</p>
          </div>
          
          <div className="relative z-10 flex gap-4 mt-6">
            <button className="bg-white text-primary font-bold text-sm px-6 py-3 rounded-2xl hover:bg-gray-100 transition-colors shadow-glow-dark">Avertir le Ministère</button>
            <button className="bg-white/10 text-white border border-white/20 font-bold text-sm px-6 py-3 rounded-2xl hover:bg-white/20 transition-colors">Afficher la carte de chaleur</button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6 flex flex-col">
          <h3 className="font-outfit font-black text-primary text-lg mb-4">Statut Prédictif Global</h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-600">Risque Paludisme</span>
                <span className="text-red-400">Élevé</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-red-400 h-full rounded-full w-[85%]" /></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-600">Risque Grippe/Covid</span>
                <span className="text-accent">Faible</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-accent h-full rounded-full w-[25%]" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse size={18} className="text-accent" />
            <h2 className="font-outfit font-black text-primary text-lg">Top Recherches & Ventes en temps réel</h2>
          </div>
          <button className="text-xs font-bold text-accent hover:text-emerald-600 flex items-center gap-1">Exporter CSV <ChevronRight size={14}/></button>
        </div>
        <div className="grid grid-cols-4 px-6 py-3 bg-surfaceAlt text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <span className="col-span-2">Médicament & Localisation</span><span className="text-right">Recherches</span><span className="text-right">Tendance (48h)</span>
        </div>
        <div className="divide-y divide-gray-50">
          {epi.map((e, i) => (
            <div key={e.med} className={`grid grid-cols-4 items-center px-6 py-5 hover:bg-surfaceAlt/50 transition-colors ${e.alert ? 'bg-red-50/30' : ''}`}>
              <div className="col-span-2 flex items-center gap-4">
                <span className={`w-8 h-8 rounded-xl bg-surfaceAlt text-xs font-black flex items-center justify-center shrink-0 ${e.alert ? 'text-red-400 bg-red-100' : 'text-gray-400'}`}>#{i + 1}</span>
                <div>
                  <p className="font-outfit font-black text-primary text-sm flex items-center gap-2">
                    {e.med} {e.alert && <AlertCircle size={14} className="text-red-400" />}
                  </p>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1"><MapPin size={10} /> Dakar ({e.lat}, {e.lon})</p>
                </div>
              </div>
              <div className="text-right pr-4">
                <p className="font-outfit font-black text-primary text-base">{e.searches.toLocaleString()}</p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${e.alert ? 'bg-gradient-to-r from-red-400 to-orange-400' : 'bg-gradient-to-r from-accent to-emerald-300'}`} style={{ width: `${(e.searches / 1240) * 100}%` }} />
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-black px-3 py-1.5 rounded-full ${e.alert ? 'bg-red-100 text-red-500' : 'bg-accent/10 text-accent'}`}>{e.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Routeur interne Admin ─── */
const AdminDashboard: React.FC = () => {
  const path = window.location.pathname;
  const page =
    path.includes('/admin/users') ? <UsersPage /> :
    path.includes('/admin/stats') ? <EpiPage /> :
    <AdminHome />;

  return (
    <DashboardLayout role="ADMIN" userName="Super Admin">
      {page}
    </DashboardLayout>
  );
};

export default AdminDashboard;
