import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  MapPin, ScanText, MessageSquareHeart, ShoppingBag,
  Package, CheckCircle2, Search, Loader2, Info, ChevronRight
} from 'lucide-react';
import { MedicamentService, CommandeService, AIService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import styles from './PatientDashboard.module.css';
import MapComponent from '../components/MapComponent';

/* ─── Page: Accueil Patient ─── */
const PatientHome: React.FC = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { label: 'Commandes', value: '0', icon: <ShoppingBag size={20} className="text-accent" />, bg: 'bg-accent/10' },
    { label: 'Livraisons', value: '0', icon: <Package size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Scans IA', value: '0', icon: <ScanText size={20} className="text-purple-500" />, bg: 'bg-purple-50' },
    { label: 'Pharmacies proches', value: '0', icon: <MapPin size={20} className="text-orange-400" />, bg: 'bg-orange-50' },
  ]);

  useEffect(() => {
    if (!token) return; // Éviter l'appel si pas encore authentifié
    
    CommandeService.findAll().then(res => {
      setOrders(res);
      const deliveryCount = res.filter(o => o.statut === 'LIVREE').length;
      setStats(prev => [
        { ...prev[0], value: res.length.toString() },
        { ...prev[1], value: deliveryCount.toString() },
        ...prev.slice(2)
      ]);
    }).catch(err => {
      console.error("Erreur chargement commandes:", err);
    });
  }, [token]);

  const latestOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className={styles.container}>
      <div className="mb-8">
        <h1 className={styles.title}>Bienvenue {user?.nom} 👋</h1>
        <p className={styles.subtitle}>Que faisons-nous aujourd'hui ?</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={`${styles.statIcon} ${s.bg}`}>{s.icon}</div>
            <div>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Dernière commande</h2>
            {latestOrder && (
              <span className={`${styles.badge} ${latestOrder.statut === 'LIVREE' ? styles.badgeGreen : styles.badgeBlue}`}>
                {latestOrder.statut}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 p-4 bg-surfaceAlt rounded-2xl mb-4">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
              <Package size={20} className="text-accent" />
            </div>
            {latestOrder ? (
              <div>
                <p className="font-outfit font-black text-primary text-sm">Commande #{latestOrder.id}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{latestOrder.pharmacie?.nom}</p>
                <p className="text-xs font-black text-accent mt-1">{latestOrder.montantTotal} FCFA</p>
              </div>
            ) : (
              <div>
                <p className="font-outfit font-black text-primary text-sm">Aucune commande récente</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Commencez par rechercher un médicament</p>
              </div>
            )}
          </div>
          <a href="/patient/orders" className="text-xs font-bold text-accent flex items-center gap-1 justify-center py-2 border-t border-gray-50">
            Voir mon historique <ChevronRight size={14} />
          </a>
        </div>
        <div className={styles.promoCard}>
          <div className="absolute right-0 bottom-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          <h2 className={styles.promoTitle}>Scanner une ordonnance</h2>
          <p className={styles.promoText}>L'IA prépare votre panier en quelques secondes.</p>
          <a href="/patient/scan" className="btn-primary text-sm px-5 py-2.5 w-max">
            <ScanText size={16} /> Scanner maintenant
          </a>
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Recherche ─── */
const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordering, setOrdering] = useState<string | null>(null);
  const [userLoc, setUserLoc] = useState<[number, number]>([14.6937, -17.4441]); // Fallback Dakar

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn("Geolocation denied or failed, using fallback.")
      );
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await MedicamentService.searchNearby(userLoc[0], userLoc[1], 10, query);
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (r: any) => {
    setOrdering(r.id);
    try {
      const orderData = {
        pharmacieId: r.pharmacieId,
        montantTotal: r.medicament.prixBase,
        items: [{
          medicamentId: r.medicamentId,
          quantite: 1,
          prixUnitaire: r.medicament.prixBase
        }]
      };
      await CommandeService.create(orderData);
      alert("Commande créée avec succès !");
    } catch (err) {
      alert("Erreur lors de la commande.");
    } finally {
      setOrdering(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className="mb-8">
        <h1 className={styles.title}>Rechercher</h1>
        <p className={styles.subtitle}>Trouvez vos médicaments autour de vous</p>
      </div>
      <div className={styles.searchBox}>
        <div className={styles.searchInputWrapper}>
          <div className={styles.searchInput}>
            <Search size={18} className="text-gray-400 shrink-0" />
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              type="text" 
              placeholder="Ex: Paracétamol..." 
              onKeyDown={e => e.key === 'Enter' && handleSearch()} 
            />
          </div>
          <button onClick={handleSearch} disabled={loading} className="btn-primary px-6 py-3 text-sm rounded-2xl">
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Rechercher'}
          </button>
        </div>
        <p className="text-xs text-gray-400 font-semibold flex items-center gap-1">
          <MapPin size={12} className="text-accent" /> 
          {userLoc[0] === 14.6937 ? 'Localisation par défaut — Dakar' : 'Localisation actuelle activée'}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft flex items-center justify-between hover:border-accent/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <MapPin size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-outfit font-black text-primary text-base">{r.pharmacie?.nom}</p>
                  <p className="text-xs text-gray-400 font-bold mb-1">{r.medicament?.nomCommercial}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 font-medium">{r.distance?.toFixed(1)} km</span>
                    <span className="text-xs font-bold text-primary">{r.medicament.prixBase} FCFA</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleOrder(r); }} 
                disabled={ordering === r.id}
                className="btn-primary text-xs px-4 py-2 rounded-xl"
              >
                {ordering === r.id ? <Loader2 className="animate-spin" size={14} /> : 'Commander'}
              </button>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-soft text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-accent" />
          </div>
          <p className="font-outfit font-black text-primary text-xl mb-2">Cherchez vos médicaments</p>
          <p className="text-gray-400 text-sm font-medium">Tapez le nom d'un médicament et appuyez Entrée</p>
        </div>
      )}
    </div>
  );
};

/* ─── Page: Scan OCR ─── */
const ScanPage: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [ordering, setOrdering] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);
  const [userLoc, setUserLoc] = useState<[number, number]>([14.6937, -17.4441]); // Fallback Dakar

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn("Geolocation denied or failed, using fallback.")
      );
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    try {
      const res = await AIService.scanPrescription(file);
      setResult(res);
      
      if (res.medicaments && res.medicaments.length > 0) {
        setLoadingPharmacies(true);
        const medNames = res.medicaments.map((m: any) => m.nom);
        const pharmRes = await MedicamentService.searchPrescriptionNearby(userLoc[0], userLoc[1], medNames);
        setPharmacies(pharmRes);
        setLoadingPharmacies(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleOrderFromScan = async (pharm: any) => {
    setOrdering(pharm.id);
    try {
      const items = pharm.medsDetails.map((m: any) => ({
        medicamentId: m.id || 1, 
        quantite: 1,
        prixUnitaire: m.prix
      }));

      const orderData = {
        pharmacieId: pharm.id,
        montantTotal: pharm.medsDetails.reduce((acc: number, m: any) => acc + m.prix, 0),
        items: items
      };

      await CommandeService.create(orderData);
      alert(`Commande passée à ${pharm.nom} !`);
    } catch (err) {
      alert("Erreur lors de la création de la commande.");
    } finally {
      setOrdering(null);
    }
  };

  if (result) {
    return (
      <div className="animate-fade-up">
        <div className="mb-8">
          <h1 className={styles.title}>Analyse terminée</h1>
          <p className={styles.subtitle}>Médicaments détectés et pharmacies proches</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
              <h3 className="font-outfit font-black text-primary text-lg mb-4 flex items-center gap-2">
                <Info size={20} className="text-accent" /> Ordonnance analysée
              </h3>
              <div className="space-y-4">
                {result.medicaments?.map((m: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surfaceAlt rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center`}>
                        <CheckCircle2 size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-outfit font-black text-primary text-base">{m.nom}</p>
                        <p className="text-sm text-gray-400 font-medium">{m.dosage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
              <h3 className="font-outfit font-black text-primary text-lg mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-accent" /> Pharmacies les plus proches
              </h3>
              {loadingPharmacies ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div>
              ) : pharmacies.length > 0 ? (
                <div className="space-y-3">
                  {pharmacies.slice(0, 5).map((p) => (
                    <div key={p.id} className="p-4 border border-gray-100 rounded-2xl hover:border-accent/30 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-outfit font-black text-primary">{p.nom}</p>
                          <p className="text-xs text-gray-400">{p.adresse}</p>
                        </div>
                        <span className="text-[11px] font-black px-3 py-1.5 rounded-full bg-blue-50 text-blue-500">
                          {p.distance.toFixed(1)} km
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs font-bold text-gray-500">{p.score}/{p.totalMeds} médicament(s)</span>
                        <button 
                          onClick={() => handleOrderFromScan(p)}
                          disabled={ordering === p.id}
                          className="btn-primary text-[10px] px-3 py-1.5 rounded-lg"
                        >
                          {ordering === p.id ? <Loader2 className="animate-spin" size={12} /> : 'Commander ici'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Aucune pharmacie trouvée à proximité.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-2 overflow-hidden">
                <MapComponent pharmacies={pharmacies} userLocation={userLoc} />
             </div>
             <div className="flex gap-4">
                <button onClick={() => setResult(null)} className="btn-ghost py-4 flex-1">Nouveau scan</button>
                <button 
                  onClick={() => pharmacies.length > 0 && handleOrderFromScan(pharmacies[0])}
                  disabled={ordering !== null || pharmacies.length === 0}
                  className="btn-primary py-4 flex-1"
                >
                  {ordering === (pharmacies[0]?.id) ? <Loader2 className="animate-spin" /> : 'Commander à la plus proche'}
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scanContainer}>
      <div className={styles.viewfinder}>
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          {scanning ? <Loader2 className="text-accent animate-spin" size={48} /> : <ScanText size={48} className="text-white/20" />}
        </div>
        
        {scanning && <div className={styles.radar} />}
        
        <div className="absolute inset-x-0 top-12 text-center px-4">
          <p className="text-white font-black text-lg">Scannez votre ordonnance</p>
          <p className="text-white/80 text-sm font-medium">L'IA détectera automatiquement les médicaments</p>
        </div>
        
        <div className="absolute inset-x-0 bottom-8 flex justify-center">
          <label className={`w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${scanning ? 'bg-accent border-accent' : 'bg-white/20 backdrop-blur-md'}`}>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={scanning} />
            <div className={`w-14 h-14 bg-white rounded-full transition-all ${scanning ? 'scale-50' : 'scale-100'}`} />
          </label>
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Chat ─── */
const ChatPage: React.FC = () => {
  const [msgs, setMsgs] = useState([{ role: 'bot', text: 'Bonjour ! Je suis l\'assistant IA de MEDS. Comment puis-je vous aider ?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await AIService.chat(userMsg);
      setMsgs(m => [...m, { role: 'bot', text: res.reponse || res.response }]);
    } catch (err) {
      setMsgs(m => [...m, { role: 'bot', text: "Désolé, j'ai rencontré une erreur." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className="mb-8">
        <h1 className={styles.title}>Assistant IA Santé</h1>
        <p className={styles.subtitle}>Posez vos questions de santé</p>
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <div className="w-9 h-9 rounded-2xl bg-accent/10 flex items-center justify-center"><MessageSquareHeart size={18} className="text-accent" /></div>
          <div><p className="font-outfit font-black text-primary text-sm">MEDS AI</p><p className="text-[11px] text-gray-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />En ligne</p></div>
        </div>
        <div className={styles.chatBody}>
          {msgs.map((m, i) => (
            <div key={i} className={`${styles.message} ${m.role === 'user' ? styles.msgUser : styles.msgBot}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className={`${styles.message} ${styles.msgBot}`}>En train d'écrire...</div>}
        </div>
        <div className="px-4 py-4 border-t border-gray-100 flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} type="text" placeholder="Posez votre question..." className="form-input rounded-2xl flex-1 py-3" />
          <button onClick={send} disabled={loading} className="btn-primary px-5 py-3 rounded-2xl text-sm">Envoyer</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Historique ─── */
const OrdersHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CommandeService.findAll().then(res => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

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
        <h1 className={styles.title}>Mes commandes</h1>
        <p className={styles.subtitle}>Historique complet de vos achats</p>
      </div>

      <div className="space-y-4">
        {loading ? <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div> : 
         orders.length > 0 ? orders.map(o => (
           <div key={o.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-surfaceAlt rounded-2xl flex items-center justify-center">
                   <ShoppingBag size={24} className="text-gray-400" />
                 </div>
                 <div>
                   <p className="font-outfit font-black text-primary text-lg">Commande #{o.id}</p>
                   <p className="text-xs text-gray-400 font-medium">{new Date(o.dateCommande).toLocaleDateString()}</p>
                 </div>
               </div>
               <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${getStatusColor(o.statut)}`}>
                 {o.statut}
               </span>
             </div>
             <div className="pl-16 space-y-2">
               {o.items?.map((item: any, i: number) => (
                 <p key={i} className="text-sm text-gray-500 font-medium">• {item.quantite}x {item.medicament?.nomCommercial}</p>
               ))}
               <div className="pt-4 flex justify-between items-center border-t border-gray-50 mt-4">
                 <p className="text-xs font-bold text-gray-400">Pharmacie: <span className="text-primary">{o.pharmacie?.nom}</span></p>
                 <p className="font-outfit font-black text-accent text-xl">{o.montantTotal} FCFA</p>
               </div>
             </div>
           </div>
         )) : (
           <div className="text-center py-20">
             <ShoppingBag size={48} className="mx-auto text-gray-100 mb-4" />
             <p className="text-gray-400">Vous n'avez pas encore passé de commande.</p>
           </div>
         )}
      </div>
    </div>
  );
};

/* ─── Routeur interne Patient ─── */
const PatientDashboard: React.FC = () => {
  const path = window.location.pathname;
  let page = <PatientHome />;
  
  if (path.includes('/patient/orders')) page = <OrdersHistory />;
  else if (path.includes('/patient/scan')) page = <ScanPage />;
  else if (path.includes('/patient/chat')) page = <ChatPage />;
  else if (path.includes('/patient/recherche')) page = <SearchPage />;

  return (
    <DashboardLayout role="PATIENT" userName="Patient">
      {page}
    </DashboardLayout>
  );
};

export default PatientDashboard;
