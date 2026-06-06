import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  MapPin, ScanText, MessageSquareHeart, ShoppingBag,
  Package, CheckCircle2, Search, Loader2, Info, ChevronRight,
  Heart, Clock, Star, Navigation, Shield, Sparkles, Droplets,
  Sun, Moon, AlertCircle, ArrowRight, Zap
} from 'lucide-react';
import { MedicamentService, CommandeService, AIService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import MapComponent from '../components/MapComponent';
import './patientDashboard.css';

/* ═══════════════════════════════════════════════════════════════
   COMPOSANTS PARTAGÉS
   ═══════════════════════════════════════════════════════════════ */

const SectionHeader: React.FC<{ 
  title: string; 
  subtitle: string; 
  icon?: React.ReactNode;
  badge?: string;
}> = ({ title, subtitle, icon, badge }) => (
  <div className="pd-section-header">
    {badge && (
      <div className="pd-badge">
        {icon}
        <span>{badge}</span>
      </div>
    )}
    <h1 className="pd-title">{title}</h1>
    <p className="pd-subtitle">{subtitle}</p>
  </div>
);

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  trend?: string;
}> = ({ icon, value, label, color, trend }) => (
  <div className={`pd-stat-card ${color}`}>
    <div className="pd-stat-icon-wrapper">
      {icon}
    </div>
    <div className="pd-stat-content">
      <span className="pd-stat-value">{value}</span>
      <span className="pd-stat-label">{label}</span>
      {trend && <span className="pd-stat-trend">{trend}</span>}
    </div>
    <div className="pd-stat-glow" />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   PAGE: ACCUEIL PATIENT
   ═══════════════════════════════════════════════════════════════ */

const PatientHome: React.FC = () => {
  const { user, token } = useAuth();
  const { socket } = useSocket();
  const [orders, setOrders] = useState<any[]>([]);
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState([
    { 
      icon: <ShoppingBag size={22} />, 
      value: '0', 
      label: 'Commandes totales', 
      color: 'sage',
      trend: ''
    },
    { 
      icon: <Package size={22} />, 
      value: '0', 
      label: 'Livraisons reçues', 
      color: 'blue',
      trend: ''
    },
    { 
      icon: <ScanText size={22} />, 
      value: '0', 
      label: 'Scans effectués', 
      color: 'purple',
      trend: ''
    },
    { 
      icon: <MapPin size={22} />, 
      value: '5', 
      label: 'Pharmacies proches', 
      color: 'terracotta',
      trend: 'Dans 2 km'
    },
  ]);

  useEffect(() => {
    // Déterminer le message de bienvenue selon l'heure
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
    
    fetchOrders();
    setupSocket();
    
    return () => cleanupSocket();
  }, [token, socket]);

  const fetchOrders = () => {
    if (!token) return;
    CommandeService.findAll().then(res => {
      setOrders(res);
      const deliveredCount = res.filter((o: any) => o.statut === 'LIVREE').length;
      const scannedCount = res.filter((o: any) => o.source === 'SCAN').length;
      setStats(prev => [
        { ...prev[0], value: res.length.toString() },
        { ...prev[1], value: deliveredCount.toString() },
        { ...prev[2], value: scannedCount.toString() },
        ...prev.slice(3)
      ]);
    }).catch(err => {
      console.error("Erreur chargement commandes:", err);
    });
  };

  const setupSocket = () => {
    if (socket) {
      socket.on('commande_statut', fetchOrders);
      socket.on('course_assignee', fetchOrders);
    }
  };

  const cleanupSocket = () => {
    if (socket) {
      socket.off('commande_statut');
      socket.off('course_assignee');
    }
  };

  const latestOrder = orders.length > 0 ? orders[0] : null;
  const activeOrders = orders.filter(o => !['LIVREE', 'ANNULEE'].includes(o.statut));

  const quickActions = [
    { 
      icon: <ScanText size={24} />, 
      label: 'Scanner une\nordonnance', 
      href: '/patient/scan',
      color: 'action-scan',
      badge: 'IA'
    },
    { 
      icon: <Search size={24} />, 
      label: 'Rechercher un\nmédicament', 
      href: '/patient/recherche',
      color: 'action-search',
      badge: ''
    },
    { 
      icon: <MessageSquareHeart size={24} />, 
      label: 'Assistant\nsanté IA', 
      href: '/patient/chat',
      color: 'action-chat',
      badge: '24/7'
    },
    { 
      icon: <ShoppingBag size={24} />, 
      label: 'Mes\ncommandes', 
      href: '/patient/orders',
      color: 'action-orders',
      badge: ''
    },
  ];

  const getStatusInfo = (status: string) => {
    const statuses: any = {
      'EN_ATTENTE': { color: 'status-waiting', icon: <Clock size={14} />, label: 'En attente' },
      'PAYEE': { color: 'status-paid', icon: <Shield size={14} />, label: 'Payée' },
      'PREPARATION': { color: 'status-preparing', icon: <Package size={14} />, label: 'En préparation' },
      'LIVRAISON': { color: 'status-delivering', icon: <Navigation size={14} />, label: 'En livraison' },
      'LIVREE': { color: 'status-delivered', icon: <CheckCircle2 size={14} />, label: 'Livrée' },
      'ANNULEE': { color: 'status-cancelled', icon: <AlertCircle size={14} />, label: 'Annulée' },
    };
    return statuses[status] || statuses['EN_ATTENTE'];
  };

  return (
    <div className="pd-container">
      {/* Header avec greeting */}
      <div className="pd-welcome-section">
        <div className="pd-welcome-content">
          <div className="pd-welcome-text">
            <div className="pd-greeting-badge">
              <Sparkles size={14} />
              <span>{greeting} {user?.nom} 👋</span>
            </div>
            <h1 className="pd-welcome-title">
              Votre santé,{' '}
              <span className="pd-welcome-highlight">simplifiée</span>
            </h1>
            <p className="pd-welcome-subtitle">
              Que souhaitez-vous faire aujourd'hui ?
            </p>
          </div>
          <div className="pd-welcome-illustration">
            <div className="pd-illustration-circle">
              <Heart size={32} className="pd-illustration-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="pd-quick-actions">
        {quickActions.map((action, index) => (
          <a 
            key={index} 
            href={action.href} 
            className={`pd-quick-action-card ${action.color}`}
          >
            <div className="pd-action-icon">
              {action.icon}
              {action.badge && (
                <span className="pd-action-badge">{action.badge}</span>
              )}
            </div>
            <span className="pd-action-label">
              {action.label.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </span>
          </a>
        ))}
      </div>

      {/* Statistiques */}
      <div className="pd-stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Dernière commande & Commandes actives */}
      <div className="pd-orders-section">
        <div className="pd-card">
          <div className="pd-card-header">
            <h3 className="pd-card-title">
              <Package size={20} />
              Dernière commande
            </h3>
            {latestOrder && (
              <span className={`pd-status-badge ${getStatusInfo(latestOrder.statut).color}`}>
                {getStatusInfo(latestOrder.statut).icon}
                {getStatusInfo(latestOrder.statut).label}
              </span>
            )}
          </div>
          
          {latestOrder ? (
            <div className="pd-order-preview">
              <div className="pd-order-pharmacy">
                <div className="pd-pharmacy-icon">
                  <MapPin size={18} />
                </div>
                <div>
                  <strong>{latestOrder.pharmacie?.nom || 'Pharmacie'}</strong>
                  <span>Commande #{latestOrder.id}</span>
                </div>
              </div>
              
              <div className="pd-order-items">
                {latestOrder.items?.slice(0, 2).map((item: any, i: number) => (
                  <div key={i} className="pd-order-item">
                    <Droplets size={14} />
                    <span>{item.medicament?.nomCommercial || 'Médicament'}</span>
                    <span className="pd-item-qty">x{item.quantite}</span>
                  </div>
                ))}
                {(latestOrder.items?.length || 0) > 2 && (
                  <p className="pd-more-items">
                    +{latestOrder.items.length - 2} autres articles
                  </p>
                )}
              </div>
              
              <div className="pd-order-total">
                <span>Total</span>
                <strong>{latestOrder.montantTotal} FCFA</strong>
              </div>
            </div>
          ) : (
            <div className="pd-empty-state">
              <ShoppingBag size={40} className="pd-empty-icon" />
              <p>Aucune commande récente</p>
              <span>Commencez par rechercher un médicament</span>
            </div>
          )}
          
          <a href="/patient/orders" className="pd-card-link">
            Voir l'historique complet
            <ChevronRight size={16} />
          </a>
        </div>

        {/* Commandes actives */}
        <div className="pd-card">
          <div className="pd-card-header">
            <h3 className="pd-card-title">
              <Clock size={20} />
              Commandes en cours
            </h3>
            {activeOrders.length > 0 && (
              <span className="pd-count-badge">{activeOrders.length}</span>
            )}
          </div>
          
          {activeOrders.length > 0 ? (
            <div className="pd-active-orders">
              {activeOrders.slice(0, 3).map((order: any) => (
                <div key={order.id} className="pd-active-order">
                  <div className="pd-active-order-header">
                    <span className={`pd-status-dot ${getStatusInfo(order.statut).color}`} />
                    <strong>#{order.id}</strong>
                    <span className={`pd-status-text ${getStatusInfo(order.statut).color}`}>
                      {getStatusInfo(order.statut).label}
                    </span>
                  </div>
                  <div className="pd-active-order-details">
                    <span>{order.pharmacie?.nom}</span>
                    <span>{order.montantTotal} FCFA</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pd-empty-state small">
              <Zap size={32} className="pd-empty-icon" />
              <p>Aucune commande en cours</p>
              <span>Tout est livré !</span>
            </div>
          )}
        </div>
      </div>

      {/* Carte promo scan */}
      <div className="pd-promo-card">
        <div className="pd-promo-bg">
          <div className="pd-promo-gradient" />
          <div className="pd-promo-pattern" />
        </div>
        <div className="pd-promo-content">
          <div className="pd-promo-icon-wrapper">
            <ScanText size={28} />
          </div>
          <div>
            <h3 className="pd-promo-title">Scanner une ordonnance</h3>
            <p className="pd-promo-text">
              Notre IA analyse votre prescription et prépare automatiquement votre panier
            </p>
            <a href="/patient/scan" className="pd-promo-button">
              <span>Scanner maintenant</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: RECHERCHE
   ═══════════════════════════════════════════════════════════════ */

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordering, setOrdering] = useState<string | null>(null);
  const [userLoc, setUserLoc] = useState<[number, number]>([14.6937, -17.4441]);
  const [modeRecuperation, setModeRecuperation] = useState<'LIVRAISON' | 'RETRAIT'>('LIVRAISON');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn("Geolocation denied")
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
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
        modeRecuperation,
        items: [{
          medicamentId: r.medicamentId,
          quantite: 1,
          prixUnitaire: r.medicament.prixBase
        }]
      };
      const res = await CommandeService.create(orderData);
      if (res.payment_url) {
        window.location.href = res.payment_url;
      } else {
        alert("Commande créée avec succès !");
      }
    } catch (err) {
      alert("Erreur lors de la commande.");
    } finally {
      setOrdering(null);
    }
  };

  return (
    <div className="pd-container">
      <SectionHeader 
        title="Rechercher un médicament"
        subtitle="Trouvez vos traitements dans les pharmacies autour de vous"
        icon={<Search size={16} />}
        badge="Recherche"
      />

      {/* Mode de récupération */}
      <div className="pd-mode-selector">
        <button 
          onClick={() => setModeRecuperation('LIVRAISON')}
          className={`pd-mode-btn ${modeRecuperation === 'LIVRAISON' ? 'active' : ''}`}
        >
          <Navigation size={16} />
          Livraison
        </button>
        <button 
          onClick={() => setModeRecuperation('RETRAIT')}
          className={`pd-mode-btn ${modeRecuperation === 'RETRAIT' ? 'active' : ''}`}
        >
          <MapPin size={16} />
          Retrait
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="pd-search-box">
        <div className="pd-search-input-wrapper">
          <Search size={20} className="pd-search-icon" />
          <input 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            type="text" 
            placeholder="Ex: Paracétamol, Doliprane..." 
            onKeyDown={e => e.key === 'Enter' && handleSearch()} 
            className="pd-search-input"
          />
        </div>
        <button 
          onClick={handleSearch} 
          disabled={loading || !query.trim()} 
          className="pd-search-btn"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Rechercher'}
        </button>
      </div>

      <p className="pd-location-info">
        <MapPin size={14} />
        {userLoc[0] === 14.6937 ? 'Localisation par défaut — Dakar' : 'Localisation actuelle activée'}
      </p>

      {/* Résultats */}
      {results.length > 0 ? (
        <div className="pd-results-list">
          {results.map((r, i) => (
            <div key={i} className="pd-result-card">
              <div className="pd-result-pharmacy">
                <div className="pd-pharmacy-avatar">
                  <MapPin size={20} />
                </div>
                <div className="pd-pharmacy-info">
                  <strong>{r.pharmacie?.nom}</strong>
                  <span className="pd-med-name">{r.medicament?.nomCommercial}</span>
                  <div className="pd-result-meta">
                    <span className="pd-distance">{r.distance?.toFixed(1)} km</span>
                    <span className="pd-separator">•</span>
                    <span className="pd-price">{r.medicament.prixBase} FCFA</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleOrder(r); }} 
                disabled={ordering === r.id}
                className="pd-order-btn"
              >
                {ordering === r.id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : modeRecuperation === 'LIVRAISON' ? (
                  <>
                    <Navigation size={14} />
                    Livrer
                  </>
                ) : (
                  <>
                    <MapPin size={14} />
                    Réserver
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="pd-empty-search">
          <Search size={48} className="pd-empty-icon-large" />
          <h3>Recherchez vos médicaments</h3>
          <p>Tapez le nom d'un médicament et appuyez sur Entrée</p>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: SCAN OCR
   ═══════════════════════════════════════════════════════════════ */

const ScanPage: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [ordering, setOrdering] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);
  const [userLoc, setUserLoc] = useState<[number, number]>([14.6937, -17.4441]);
  const [modeRecuperation, setModeRecuperation] = useState<'LIVRAISON' | 'RETRAIT'>('LIVRAISON');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn("Geolocation denied")
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
    const subtotal = pharm.medsDetails.reduce((acc: number, m: any) => acc + m.prix, 0);
    const deliveryFee = modeRecuperation === 'LIVRAISON' ? 1000 : 0;
    const total = subtotal + deliveryFee;

    const confirmMsg = `Récapitulatif de votre commande à ${pharm.nom} :
- Articles trouvés : ${pharm.score}/${pharm.totalMeds}
- Sous-total : ${subtotal} FCFA
- Frais de livraison : ${deliveryFee} FCFA
-------------------------
TOTAL : ${total} FCFA

${pharm.score < pharm.totalMeds ? "⚠️ Certains médicaments ne sont pas disponibles ici." : ""}

Voulez-vous procéder au paiement ?`;

    if (!window.confirm(confirmMsg)) return;

    setOrdering(pharm.id);
    try {
      const items = pharm.medsDetails.map((m: any) => ({
        medicamentId: m.id || 1,
        quantite: 1,
        prixUnitaire: m.prix
      }));

      const orderData = {
        pharmacieId: pharm.id,
        montantTotal: total,
        modeRecuperation,
        items
      };

      const res = await CommandeService.create(orderData);
      if (res.payment_url) {
        window.location.href = res.payment_url;
      } else {
        alert('Commande confirmée !');
      }
    } catch (err) {
      alert("Erreur lors de la création de la commande.");
    } finally {
      setOrdering(null);
    }
  };

  if (result) {
    return (
      <div className="pd-scan-result">
        <SectionHeader 
          title="Analyse terminée"
          subtitle="Médicaments détectés et pharmacies disponibles"
          icon={<CheckCircle2 size={16} />}
          badge="Scan réussi"
        />

        <div className="pd-mode-selector">
          <button 
            onClick={() => setModeRecuperation('LIVRAISON')}
            className={`pd-mode-btn ${modeRecuperation === 'LIVRAISON' ? 'active' : ''}`}
          >
            <Navigation size={16} />
            Livraison
          </button>
          <button 
            onClick={() => setModeRecuperation('RETRAIT')}
            className={`pd-mode-btn ${modeRecuperation === 'RETRAIT' ? 'active' : ''}`}
          >
            <MapPin size={16} />
            Retrait
          </button>
        </div>

        <div className="pd-scan-grid">
          {/* Médicaments détectés */}
          <div className="pd-card">
            <h3 className="pd-card-title">
              <Info size={18} />
              Ordonnance analysée
            </h3>
            <div className="pd-med-list">
              {result.medicaments?.map((m: any, i: number) => (
                <div key={i} className="pd-med-item">
                  <CheckCircle2 size={16} className="pd-med-check" />
                  <div>
                    <strong>{m.nom}</strong>
                    <span>{m.dosage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte */}
          <div className="pd-card pd-map-card">
            <MapComponent pharmacies={pharmacies} userLocation={userLoc} />
          </div>
        </div>

        {/* Pharmacies */}
        <div className="pd-card">
          <h3 className="pd-card-title">
            <MapPin size={18} />
            Pharmacies disponibles
          </h3>
          
          {loadingPharmacies ? (
            <div className="pd-loading-center">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : pharmacies.length > 0 ? (
            <div className="pd-pharmacy-list">
              {pharmacies.slice(0, 5).map((p) => (
                <div key={p.id} className="pd-pharmacy-card">
                  <div className="pd-pharmacy-header">
                    <div>
                      <strong>{p.nom}</strong>
                      <span>{p.adresse}</span>
                    </div>
                    <span className="pd-distance-badge">{p.distance.toFixed(1)} km</span>
                  </div>
                  
                  <div className="pd-pharmacy-meds">
                    {p.medsDetails.map((m: any, idx: number) => (
                      <div key={idx} className="pd-pharmacy-med-item">
                        <CheckCircle2 size={14} className="pd-med-check-small" />
                        <span>{m.nomTrouve}</span>
                        <strong>{m.prix} FCFA</strong>
                      </div>
                    ))}
                  </div>

                  {p.score < p.totalMeds && (
                    <p className="pd-missing-meds">
                      <AlertCircle size={14} />
                      {p.totalMeds - p.score} médicament(s) manquant(s)
                    </p>
                  )}

                  <div className="pd-pharmacy-footer">
                    <div className="pd-total-estimate">
                      <span>Total estimé</span>
                      <strong>
                        {p.medsDetails.reduce((acc: any, m: any) => acc + m.prix, 0) + (modeRecuperation === 'LIVRAISON' ? 1000 : 0)} FCFA
                      </strong>
                    </div>
                    <button 
                      onClick={() => handleOrderFromScan(p)}
                      disabled={ordering === p.id}
                      className="pd-order-btn"
                    >
                      {ordering === p.id ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : p.score === p.totalMeds ? 'Commander tout' : 'Commander partiel'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="pd-no-results">Aucune pharmacie trouvée à proximité.</p>
          )}
        </div>

        <div className="pd-scan-actions">
          <button onClick={() => setResult(null)} className="pd-btn-secondary">
            Nouveau scan
          </button>
          <button 
            onClick={() => pharmacies.length > 0 && handleOrderFromScan(pharmacies[0])}
            disabled={ordering !== null || pharmacies.length === 0}
            className="pd-btn-primary"
          >
            Commander à la plus proche
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-scan-upload">
      <SectionHeader 
        title="Scanner une ordonnance"
        subtitle="Photographiez votre prescription, l'IA fait le reste"
        icon={<ScanText size={16} />}
        badge="Scan IA"
      />

      <div className="pd-viewfinder">
        <div className="pd-viewfinder-inner">
          {scanning ? (
            <>
              <Loader2 className="animate-spin pd-scan-spinner" size={64} />
              <div className="pd-radar" />
            </>
          ) : (
            <ScanText size={64} className="pd-scan-placeholder" />
          )}
          
          <div className="pd-viewfinder-text">
            <p>Scannez votre ordonnance</p>
            <span>L'IA détectera automatiquement les médicaments</span>
          </div>
          
          <div className="pd-upload-btn-wrapper">
            <label className="pd-upload-btn">
              <input 
                type="file" 
                className="pd-file-input" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={scanning} 
              />
              <div className="pd-upload-ring" />
              <div className="pd-upload-inner" />
            </label>
          </div>
        </div>
      </div>

      <div className="pd-scan-tips">
        <div className="pd-tip">
          <CheckCircle2 size={14} />
          <span>Placez l'ordonnance sur une surface plane</span>
        </div>
        <div className="pd-tip">
          <CheckCircle2 size={14} />
          <span>Assurez-vous d'un bon éclairage</span>
        </div>
        <div className="pd-tip">
          <CheckCircle2 size={14} />
          <span>L'image doit être nette et lisible</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: CHAT IA
   ═══════════════════════════════════════════════════════════════ */

const ChatPage: React.FC = () => {
  const [msgs, setMsgs] = useState([
    { 
      role: 'bot', 
      text: 'Bonjour ! Je suis l\'assistant IA de MEDS. Comment puis-je vous aider avec votre santé aujourd\'hui ?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);

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
      setMsgs(m => [...m, { role: 'bot', text: "Désolé, j'ai rencontré une erreur technique." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Quels sont les effets du Paracétamol ?',
    'Comment prendre soin de ma tension ?',
    'Quels médicaments pour le rhume ?',
    'Puis-je prendre ces deux médicaments ?'
  ];

  return (
    <div className="pd-chat-container">
      <SectionHeader 
        title="Assistant Santé IA"
        subtitle="Posez vos questions de santé en toute confidentialité"
        icon={<MessageSquareHeart size={16} />}
        badge="MEDS AI"
      />

      <div className="pd-chat-box">
        {/* Header */}
        <div className="pd-chat-header">
          <div className="pd-chat-avatar">
            <MessageSquareHeart size={20} />
          </div>
          <div>
            <strong>MEDS AI</strong>
            <span className="pd-online-status">
              <span className="pd-online-dot" />
              En ligne
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="pd-chat-messages">
          {msgs.map((m, i) => (
            <div key={i} className={`pd-message ${m.role === 'user' ? 'pd-msg-user' : 'pd-msg-bot'}`}>
              <p>{m.text}</p>
            </div>
          ))}
          {loading && (
            <div className="pd-message pd-msg-bot">
              <div className="pd-typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        {msgs.length <= 1 && (
          <div className="pd-suggestions">
            <p className="pd-suggestions-title">Questions fréquentes</p>
            <div className="pd-suggestions-grid">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => { setInput(s); }} 
                  className="pd-suggestion-chip"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="pd-chat-input">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && send()} 
            type="text" 
            placeholder="Posez votre question santé..." 
            className="pd-chat-input-field"
          />
          <button 
            onClick={send} 
            disabled={loading || !input.trim()} 
            className="pd-chat-send-btn"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: HISTORIQUE COMMANDES
   ═══════════════════════════════════════════════════════════════ */

const OrdersHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CommandeService.findAll().then(res => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

  const getStatusInfo = (status: string) => {
    const statuses: any = {
      'EN_ATTENTE': { color: 'status-waiting', icon: <Clock size={14} />, label: 'En attente' },
      'PAYEE': { color: 'status-paid', icon: <Shield size={14} />, label: 'Payée' },
      'PREPARATION': { color: 'status-preparing', icon: <Package size={14} />, label: 'Préparation' },
      'LIVRAISON': { color: 'status-delivering', icon: <Navigation size={14} />, label: 'Livraison' },
      'LIVREE': { color: 'status-delivered', icon: <CheckCircle2 size={14} />, label: 'Livrée' },
      'ANNULEE': { color: 'status-cancelled', icon: <AlertCircle size={14} />, label: 'Annulée' },
    };
    return statuses[status] || statuses['EN_ATTENTE'];
  };

  return (
    <div className="pd-container">
      <SectionHeader 
        title="Mes commandes"
        subtitle="Historique complet de vos achats"
        icon={<ShoppingBag size={16} />}
        badge="Historique"
      />

      {loading ? (
        <div className="pd-loading-center">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : orders.length > 0 ? (
        <div className="pd-orders-timeline">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.statut);
            return (
              <div key={order.id} className="pd-order-card">
                <div className="pd-order-card-header">
                  <div className="pd-order-id">
                    <ShoppingBag size={18} />
                    <strong>Commande #{order.id}</strong>
                  </div>
                  <span className={`pd-status-badge ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </div>

                <div className="pd-order-card-body">
                  <div className="pd-order-pharmacy-info">
                    <MapPin size={14} />
                    <span>{order.pharmacie?.nom || 'Pharmacie'}</span>
                  </div>
                  
                  <div className="pd-order-items-list">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="pd-order-item-row">
                        <span>• {item.quantite}x {item.medicament?.nomCommercial || 'Médicament'}</span>
                        <span className="pd-item-price">{item.prixUnitaire} FCFA</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pd-order-card-footer">
                  <span className="pd-order-date">
                    {new Date(order.dateCommande).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="pd-order-total-amount">
                    {order.montantTotal} FCFA
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="pd-empty-state large">
          <ShoppingBag size={64} className="pd-empty-icon-large" />
          <h3>Aucune commande</h3>
          <p>Vous n'avez pas encore passé de commande</p>
          <a href="/patient/recherche" className="pd-btn-primary">
            Rechercher un médicament
          </a>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ROUTEUR PATIENT
   ═══════════════════════════════════════════════════════════════ */

const PatientDashboard: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  
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