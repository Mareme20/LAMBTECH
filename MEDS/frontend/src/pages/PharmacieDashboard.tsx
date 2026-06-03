import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Package, ShoppingBag, TrendingUp, AlertCircle, Clock, ChevronRight, BarChart2, Loader2, Users, Plus, X, Activity, Stethoscope, Trash2, Edit3 } from 'lucide-react';
import { StockService, CommandeService, MedicamentService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import styles from './PharmacieDashboard.module.css';

/* ─── Page: Accueil Pharmacie ─── */
const PharmacieHome: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, stockRes] = await Promise.all([
          CommandeService.findAll(),
          StockService.findAll()
        ]);
        setOrders(ordersRes);
        setStocks(stockRes.filter(s => s.quantite < 10));
        
        const totalRevenue = ordersRes
          .filter(o => o.statut === 'LIVREE' || o.statut === 'PRETE' || o.statut === 'LIVRAISON')
          .reduce((acc, o) => acc + Number(o.montantTotal), 0);
        setRevenue(totalRevenue);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className={styles.container}>
      <div className="mb-8">
        <h1 className={styles.title}>Tableau de bord</h1>
        <p className={styles.subtitle}>Aperçu rapide de votre activité</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Commandes", value: orders.length, icon: <ShoppingBag size={20} className="text-accent" />, bg: 'bg-accent/10' },
          { label: 'Alertes stock', value: stocks.length, icon: <AlertCircle size={20} className="text-red-400" />, bg: 'bg-red-50' },
          { label: 'Revenu (FCFA)', value: revenue.toLocaleString(), icon: <TrendingUp size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'En attente', value: orders.filter(o => o.statut === 'EN_ATTENTE').length, icon: <Clock size={20} className="text-orange-400" />, bg: 'bg-orange-50' },
        ].map(s => (
          <div key={s.label} className={styles.card}>
            <div className={`w-11 h-11 ${s.bg} rounded-2xl flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="font-outfit font-black text-primary text-2xl">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.grid2}>
        <div className={styles.card}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-outfit font-black text-primary text-lg">Commandes urgentes</h2>
            <a href="/pharmacie/orders" className="text-xs font-bold text-accent flex items-center gap-1">Voir tout <ChevronRight size={14} /></a>
          </div>
          {orders.filter(o => o.statut === 'EN_ATTENTE').slice(0, 5).length > 0 ? 
            orders.filter(o => o.statut === 'EN_ATTENTE').slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surfaceAlt rounded-2xl flex items-center justify-center"><Package size={18} className="text-gray-400" /></div>
                <div><p className="font-outfit font-black text-primary text-sm">#{o.id}</p><p className="text-xs text-gray-400 font-medium">{o.statut}</p></div>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full bg-orange-50 text-orange-500`}>{o.statut}</span>
            </div>
          )) : <p className="text-sm text-gray-400">Aucune commande urgente</p>}
        </div>
        <div className={styles.card}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-outfit font-black text-primary text-lg">Alertes Inventaire</h2>
            <a href="/pharmacie/stock" className="text-xs font-bold text-accent flex items-center gap-1">Gérer le stock <ChevronRight size={14} /></a>
          </div>
          {stocks.length > 0 ? stocks.slice(0, 5).map((s) => (
            <div key={s.id} className="py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-primary flex items-center gap-2"><AlertCircle size={14} className="text-red-400" /> {s.medicament?.nomCommercial}</span>
                <span className="text-xs font-black text-red-400">{s.quantite} restants</span>
              </div>
            </div>
          )) : <p className="text-sm text-gray-400">Tout est en règle</p>}
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Inventaire (Stock) ─── */
const StockPage: React.FC = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [medicaments, setMedicaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const { user } = useAuth();

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await StockService.findAll();
      setStocks(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    MedicamentService.findAll().then(setMedicaments);
  }, []);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed || quantity <= 0) return;

    if (!user?.pharmacieId) {
      alert("Erreur : Votre compte n'est lié à aucune pharmacie. Veuillez contacter l'administrateur.");
      return;
    }

    try {
      await StockService.create({
        medicamentId: Number(selectedMed),
        pharmacieId: user.pharmacieId,
        quantite: quantity
      });
      setShowModal(false);
      fetchStocks();
      alert("Stock ajouté avec succès !");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de l'ajout du stock. (Il est possible que ce produit soit déjà dans votre inventaire)");
    }
  };

  const handleUpdateQuantity = async (medicamentId: number, newQty: number) => {
    if (!user?.pharmacieId) return;
    try {
      await StockService.updateQuantity(user.pharmacieId, medicamentId, newQty);
      fetchStocks();
    } catch (err) {
      alert("Erreur lors de la mise à jour du stock.");
    }
  };

  return (
    <div className={styles.container}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className={styles.title}>Inventaire</h1>
          <p className={styles.subtitle}>Gérez vos stocks et prix</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
        >
          <Plus size={18} /> Ajouter un produit
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <span>Médicament</span><span>Catégorie</span><span>Stock</span><span>Prix</span>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div> : stocks.map(s => (
            <div key={s.id} className={styles.tableRow}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.quantite < 10 ? 'bg-red-50' : 'bg-accent/10'}`}>
                  {s.quantite < 10 ? <AlertCircle size={14} className="text-red-400" /> : <Package size={14} className="text-accent" />}
                </div>
                <span className={styles.medName}>{s.medicament?.nomCommercial}</span>
              </div>
              <span className={styles.category}>{s.medicament?.forme}</span>
              <div className={styles.stockInfo}>
                <input 
                  type="number" 
                  value={s.quantite} 
                  onChange={(e) => handleUpdateQuantity(s.medicamentId, Number(e.target.value))}
                  className="w-16 bg-transparent border-b border-gray-200 focus:border-accent outline-none text-xs font-black"
                />
                <div className={styles.stockBar}>
                  <div className={`${styles.stockLevel} ${s.quantite < 10 ? styles.levelCritical : styles.levelGood}`} style={{ width: `${Math.min(s.quantite, 100)}%` }} />
                </div>
              </div>
              <span className={styles.price}>{s.medicament?.prixUnitaire} FCFA</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative animate-fade-up">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-primary"><X size={24} /></button>
            <h2 className="font-outfit font-black text-2xl text-primary mb-2">Ajouter au stock</h2>
            <p className="text-gray-400 text-sm mb-6">Sélectionnez un médicament existant pour l'ajouter à votre pharmacie.</p>
            
            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Médicament</label>
                <select 
                  value={selectedMed} 
                  onChange={e => setSelectedMed(e.target.value)}
                  className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {medicaments.filter(m => !stocks.some(s => s.medicamentId === m.id)).map(m => (
                    <option key={m.id} value={m.id}>{m.nomCommercial} ({m.forme})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Quantité initiale</label>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                  placeholder="Ex: 50"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full py-4 rounded-2xl mt-4">Confirmer l'ajout</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Page: Gestion Médicaments (Global) ─── */
const MedsPage: React.FC = () => {
  const [meds, setMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    nomCommercial: '',
    molecule: '',
    forme: '',
    prixUnitaire: 0
  });

  const fetchMeds = async () => {
    setLoading(true);
    try {
      const res = await MedicamentService.findAll();
      setMeds(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  const handleCreateMed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await MedicamentService.create(formData);
      setShowAddModal(false);
      setFormData({ nomCommercial: '', molecule: '', forme: '', prixUnitaire: 0 });
      fetchMeds();
      alert("Médicament ajouté au catalogue global !");
    } catch (err) {
      alert("Erreur lors de la création.");
    }
  };

  const handleDeleteMed = async (id: number) => {
    if (!window.confirm("Supprimer ce médicament du catalogue global ?")) return;
    try {
      await MedicamentService.delete(id);
      fetchMeds();
    } catch (err) {
      alert("Erreur lors de la suppression (possiblement utilisé dans un stock).");
    }
  };

  return (
    <div className={styles.container}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className={styles.title}>Catalogue Médicaments</h1>
          <p className={styles.subtitle}>Gérez la liste globale des produits</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
        >
          <Plus size={18} /> Nouveau Médicament
        </button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Produit</span><span>Molécule</span><span>Forme</span><span>Prix Base</span><span>Actions</span>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div> : meds.map(m => (
            <div key={m.id} className={styles.tableRow}>
              <div className="flex items-center gap-3">
                <Stethoscope size={16} className="text-primary" />
                <span className="font-outfit font-black text-primary text-sm">{m.nomCommercial}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">{m.molecule}</span>
              <span className="text-xs text-gray-500 font-medium">{m.forme}</span>
              <span className="text-xs font-black text-accent">{m.prixUnitaire} FCFA</span>
              <div className="flex gap-2">
                <button onClick={() => handleDeleteMed(m.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative animate-fade-up">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-primary"><X size={24} /></button>
            <h2 className="font-outfit font-black text-2xl text-primary mb-6">Nouveau Médicament</h2>
            
            <form onSubmit={handleCreateMed} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Nom Commercial</label>
                  <input required type="text" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.nomCommercial} onChange={e => setFormData({...formData, nomCommercial: e.target.value})} placeholder="Ex: Doliprane" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Molécule</label>
                  <input required type="text" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.molecule} onChange={e => setFormData({...formData, molecule: e.target.value})} placeholder="Ex: Paracétamol" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Forme/Dosage</label>
                  <input required type="text" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.forme} onChange={e => setFormData({...formData, forme: e.target.value})} placeholder="Ex: 500mg, Comprimé" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Prix Unitaire (FCFA)</label>
                  <input required type="number" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.prixUnitaire} onChange={e => setFormData({...formData, prixUnitaire: Number(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-4 rounded-2xl mt-4">Enregistrer dans le catalogue</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Page: Commandes (Pharmacien) ─── */
const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await CommandeService.findAll();
      setOrders(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdating(id);
    try {
      await CommandeService.updateStatus(id, newStatus);
      await fetchOrders(); // Rafraîchir la liste
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE': return 'bg-orange-50 text-orange-500';
      case 'PAYEE': return 'bg-blue-50 text-blue-500';
      case 'PREPARATION': return 'bg-purple-50 text-purple-500';
      case 'LIVRAISON': return 'bg-indigo-50 text-indigo-500';
      case 'LIVREE': return 'bg-accent/10 text-accent';
      case 'ANNULEE': return 'bg-red-50 text-red-500';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  return (
    <div className={styles.container}>
      <div className="mb-8">
        <h1 className={styles.title}>Gestion des Commandes</h1>
        <p className={styles.subtitle}>Validez et préparez les commandes reçues</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {orders.map((o) => (
              <div key={o.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surfaceAlt flex items-center justify-center shrink-0">
                      <ShoppingBag size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-outfit font-black text-primary text-lg">Commande #{o.id}</span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${getStatusColor(o.statut)}`}>
                          {o.statut}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                        <Users size={14} /> {o.patient?.nomComplet} • {o.patient?.telephone}
                      </p>
                      <div className="mt-3 space-y-1">
                        {o.items?.map((item: any, idx: number) => (
                          <p key={idx} className="text-xs text-gray-400 font-medium">
                            • {item.quantite}x {item.medicament?.nomCommercial} ({item.prixUnitaire} FCFA)
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <p className="font-outfit font-black text-primary text-xl">{o.montantTotal} FCFA</p>
                    <div className="flex gap-2">
                      {o.statut === 'EN_ATTENTE' && (
                        <button 
                          onClick={() => updateStatus(o.id, 'PREPARATION')}
                          disabled={updating === o.id}
                          className="bg-blue-500 text-white text-[11px] font-black px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                        >
                          Préparer
                        </button>
                      )}
                      {o.statut === 'PREPARATION' && (
                        <button 
                          onClick={() => updateStatus(o.id, 'PRETE')}
                          disabled={updating === o.id}
                          className="bg-purple-500 text-white text-[11px] font-black px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors"
                        >
                          Marquer comme prête
                        </button>
                      )}
                      {o.statut !== 'LIVREE' && o.statut !== 'ANNULEE' && (
                        <button 
                          onClick={() => updateStatus(o.id, 'ANNULEE')}
                          disabled={updating === o.id}
                          className="bg-red-50 text-red-400 text-[11px] font-black px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-medium">Aucune commande pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Page: Statistiques ─── */
const StatsPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        CommandeService.findAll().then(res => {
            setOrders(res);
            setLoading(false);
        });
    }, []);

    const totalRevenue = orders
        .filter(o => o.statut === 'LIVREE' || o.statut === 'PRETE' || o.statut === 'LIVRAISON')
        .reduce((acc, o) => acc + Number(o.montantTotal), 0);

    const completedOrders = orders.filter(o => o.statut === 'LIVREE').length;

    return (
        <div className={styles.container}>
            <div className="mb-8">
                <h1 className={styles.title}>Analyses de vente</h1>
                <p className={styles.subtitle}>Performance de votre pharmacie</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft">
                    <TrendingUp className="text-accent mb-4" size={32} />
                    <p className="text-3xl font-outfit font-black text-primary">{totalRevenue.toLocaleString()} FCFA</p>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Chiffre d'affaires</p>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft">
                    <ShoppingBag className="text-blue-500 mb-4" size={32} />
                    <p className="text-3xl font-outfit font-black text-primary">{completedOrders}</p>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Commandes livrées</p>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft">
                    <Activity className="text-purple-500 mb-4" size={32} />
                    <p className="text-3xl font-outfit font-black text-primary">{orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}%</p>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Taux de succès</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft">
                <h2 className="font-outfit font-black text-primary text-xl mb-6">Répartition par produit</h2>
                <p className="text-gray-400 text-sm">Visualisation des données en cours de chargement...</p>
            </div>
        </div>
    );
};

/* ─── Routeur interne Pharmacie ─── */
const PharmacieDashboard: React.FC = () => {
  const path = window.location.pathname;
  let page = <PharmacieHome />;
  if (path.includes('/pharmacie/stock')) page = <StockPage />;
  else if (path.includes('/pharmacie/meds')) page = <MedsPage />;
  else if (path.includes('/pharmacie/orders')) page = <OrdersPage />;
  else if (path.includes('/pharmacie/stats')) page = <StatsPage />;

  return (
    <DashboardLayout role="PHARMACIE" userName="Pharmacien">
      {page}
    </DashboardLayout>
  );
};

export default PharmacieDashboard;
