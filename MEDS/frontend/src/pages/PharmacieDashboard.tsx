import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Package, ShoppingBag, TrendingUp, AlertCircle, Clock, ChevronRight, BarChart2, Activity } from 'lucide-react';

/* ─── Page: Accueil Pharmacie ─── */
const PharmacieHome: React.FC = () => {
  const orders = [
    { id: '#MEDS-0042', patient: 'Aissatou D.', med: 'Paracétamol 500mg × 2', time: '10:32', status: 'Nouveau', color: 'bg-blue-50 text-blue-500' },
    { id: '#MEDS-0041', patient: 'Moussa K.', med: 'Amoxicilline 1g × 1', time: '09:15', status: 'En préparation', color: 'bg-orange-50 text-orange-400' },
  ];

  const stocks = [
    { name: 'Paracétamol 500mg', qty: 3, max: 100, alert: true },
    { name: 'Doliprane 1000mg', qty: 8, max: 100, alert: true },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-outfit font-black text-3xl text-primary">Tableau de bord</h1>
        <p className="text-gray-500 mt-1 font-medium">Aperçu rapide de votre activité</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Commandes du jour", value: '14', icon: <ShoppingBag size={20} className="text-accent" />, bg: 'bg-accent/10', trend: '+3 vs hier' },
          { label: 'En attente', value: '3', icon: <Clock size={20} className="text-orange-400" />, bg: 'bg-orange-50', trend: '' },
          { label: 'Alerte stock', value: '2', icon: <AlertCircle size={20} className="text-red-400" />, bg: 'bg-red-50', trend: 'Rupture imminente' },
          { label: 'CA du jour (FCFA)', value: '47K', icon: <TrendingUp size={20} className="text-blue-500" />, bg: 'bg-blue-50', trend: '+12%' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft">
            <div className={`w-11 h-11 ${s.bg} rounded-2xl flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="font-outfit font-black text-primary text-2xl">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            {s.trend && <p className={`text-[10px] font-bold mt-1 ${s.trend.includes('+') ? 'text-accent' : 'text-red-400'}`}>{s.trend}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-outfit font-black text-primary text-lg">Commandes urgentes</h2>
            <a href="/pharmacie/orders" className="text-xs font-bold text-accent hover:text-emerald-600 flex items-center gap-1">Voir tout <ChevronRight size={14} /></a>
          </div>
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surfaceAlt rounded-2xl flex items-center justify-center shrink-0"><Package size={18} className="text-gray-400" /></div>
                <div><p className="font-outfit font-black text-primary text-sm">{o.id}</p><p className="text-xs text-gray-400 font-medium">{o.med}</p></div>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${o.color}`}>{o.status}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-outfit font-black text-primary text-lg">Alertes Inventaire</h2>
            <a href="/pharmacie/stock" className="text-xs font-bold text-accent hover:text-emerald-600 flex items-center gap-1">Gérer le stock <ChevronRight size={14} /></a>
          </div>
          {stocks.map((s) => (
            <div key={s.name} className="py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-primary flex items-center gap-2"><AlertCircle size={14} className="text-red-400" /> {s.name}</span>
                <span className="text-xs font-black text-red-400">{s.qty} restants</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Inventaire (Stock) ─── */
const StockPage: React.FC = () => {
  const stocks = [
    { name: 'Paracétamol 500mg', category: 'Antalgique', qty: 3, max: 100, price: '1500 FCFA', alert: true },
    { name: 'Amoxicilline 1g', category: 'Antibiotique', qty: 45, max: 100, price: '2500 FCFA', alert: false },
    { name: 'Ibuprofène 400mg', category: 'Anti-inflammatoire', qty: 22, max: 100, price: '1800 FCFA', alert: false },
    { name: 'Doliprane 1000mg', category: 'Antalgique', qty: 8, max: 100, price: '1600 FCFA', alert: true },
    { name: 'Vitamine C', category: 'Vitamine', qty: 67, max: 100, price: '1200 FCFA', alert: false },
  ];

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-outfit font-black text-3xl text-primary">Inventaire</h1>
          <p className="text-gray-500 mt-1 font-medium">Gérez vos stocks et prix</p>
        </div>
        <button className="btn-primary py-2.5 px-6 text-sm">Ajouter un produit</button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-4 bg-surfaceAlt text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <span className="col-span-2">Médicament</span><span>Catégorie</span><span>Stock</span><span>Prix</span>
        </div>
        <div className="divide-y divide-gray-50">
          {stocks.map(s => (
            <div key={s.name} className="grid grid-cols-5 items-center px-6 py-4 hover:bg-surfaceAlt/50 transition-colors">
              <div className="col-span-2 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${s.alert ? 'bg-red-50' : 'bg-accent/10'}`}>
                  {s.alert ? <AlertCircle size={14} className="text-red-400" /> : <Package size={14} className="text-accent" />}
                </div>
                <span className="font-outfit font-black text-primary text-sm">{s.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-max">{s.category}</span>
              <div className="flex items-center gap-3 pr-8">
                <span className={`text-xs font-black w-8 ${s.alert ? 'text-red-400' : 'text-primary'}`}>{s.qty}</span>
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${s.alert ? 'bg-red-400' : 'bg-accent'}`} style={{ width: `${(s.qty / s.max) * 100}%` }} />
                </div>
              </div>
              <span className="font-outfit font-black text-primary text-sm">{s.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Commandes ─── */
const OrdersPage: React.FC = () => {
  const orders = [
    { id: '#MEDS-0042', patient: 'Aissatou D.', med: 'Paracétamol 500mg × 2', time: '10:32', type: 'Livraison', status: 'Nouveau', color: 'bg-blue-50 text-blue-500' },
    { id: '#MEDS-0041', patient: 'Moussa K.', med: 'Amoxicilline 1g × 1', time: '09:15', type: 'Click & Collect', status: 'En préparation', color: 'bg-orange-50 text-orange-400' },
    { id: '#MEDS-0040', patient: 'Fatou S.', med: 'Ibuprofène 400mg × 3', time: '08:50', type: 'Livraison', status: 'Prêt', color: 'bg-accent/10 text-accent' },
    { id: '#MEDS-0039', patient: 'Cheikh B.', med: 'Doliprane 1000mg × 2', time: '08:20', type: 'Click & Collect', status: 'Livré', color: 'bg-gray-100 text-gray-400' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-outfit font-black text-3xl text-primary">Gestion des Commandes</h1>
        <p className="text-gray-500 mt-1 font-medium">Traitez les commandes en cours</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="hidden md:grid grid-cols-6 px-6 py-4 bg-surfaceAlt text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <span>N° Commande</span><span className="col-span-2">Détails Patient</span><span>Type</span><span>Heure</span><span>Statut</span>
        </div>
        <div className="divide-y divide-gray-50">
          {orders.map(o => (
            <div key={o.id} className="grid md:grid-cols-6 items-center px-6 py-4 hover:bg-surfaceAlt/50 transition-colors gap-y-4">
              <span className="font-outfit font-black text-primary text-sm">{o.id}</span>
              <div className="col-span-2">
                <p className="font-bold text-primary text-sm">{o.patient}</p>
                <p className="text-xs text-gray-500 font-medium">{o.med}</p>
              </div>
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><ShoppingBag size={12} /> {o.type}</span>
              <span className="text-xs text-gray-400 font-medium">{o.time}</span>
              <span className={`text-[11px] font-black px-3 py-1.5 rounded-full w-max ${o.color}`}>{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Statistiques ─── */
const StatsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-outfit font-black text-3xl text-primary">Statistiques</h1>
        <p className="text-gray-500 mt-1 font-medium">Analyse de vos ventes</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-soft p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Activity size={40} className="text-accent/20 mb-4" />
          <p className="font-outfit font-bold text-primary text-lg">Graphique des Ventes Mensuelles</p>
          <p className="text-sm text-gray-400">Le module de graphique sera branché au backend.</p>
        </div>
        <div className="bg-primary rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          <div>
            <h2 className="font-outfit font-black text-white text-lg mb-1">Meilleure vente</h2>
            <p className="text-gray-400 text-sm">Ce mois-ci</p>
          </div>
          <div>
            <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-4"><BarChart2 size={24} className="text-accent" /></div>
            <p className="font-outfit font-black text-white text-2xl">Paracétamol 500mg</p>
            <p className="text-accent font-bold text-sm mt-1">420 unités vendues (+15%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Routeur interne Pharmacie ─── */
const PharmacieDashboard: React.FC = () => {
  const path = window.location.pathname;
  const page =
    path.includes('/pharmacie/stock') ? <StockPage /> :
    path.includes('/pharmacie/orders') ? <OrdersPage /> :
    path.includes('/pharmacie/stats') ? <StatsPage /> :
    <PharmacieHome />;

  return (
    <DashboardLayout role="PHARMACIE" userName="Pharmacie Plateau">
      {page}
    </DashboardLayout>
  );
};

export default PharmacieDashboard;
