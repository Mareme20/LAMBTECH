import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  Package, ShoppingBag, TrendingUp, AlertCircle, Clock, 
  ChevronRight, Loader2, Users, Plus, X, Activity, 
  Stethoscope, Trash2, Building2, DollarSign, CheckCircle2,
  ArrowUp, ArrowDown, Zap, Filter, Search, Eye, Edit3,
  BarChart3, PieChart, Sparkles, Shield
} from 'lucide-react';
import { StockService, CommandeService, MedicamentService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import './pharmacieDashboard.css';

/* ═══════════════════════════════════════════════════════════════
   COMPOSANTS PARTAGÉS
   ═══════════════════════════════════════════════════════════════ */

const SectionHeader: React.FC<{ 
  title: string; 
  subtitle: string; 
  icon?: React.ReactNode;
  badge?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, icon, badge, action }) => (
  <div className="ph-section-header">
    <div className="ph-header-left">
      {badge && (
        <div className="ph-badge">
          {icon}
          <span>{badge}</span>
        </div>
      )}
      <h1 className="ph-title">{title}</h1>
      <p className="ph-subtitle">{subtitle}</p>
    </div>
    {action && <div className="ph-header-action">{action}</div>}
  </div>
);

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  trend?: { value: string; positive: boolean };
}> = ({ icon, value, label, color, trend }) => (
  <div className={`ph-stat-card ${color}`}>
    <div className="ph-stat-icon-wrapper">
      {icon}
    </div>
    <div className="ph-stat-content">
      <span className="ph-stat-value">{value}</span>
      <span className="ph-stat-label">{label}</span>
      {trend && (
        <span className={`ph-stat-trend ${trend.positive ? 'positive' : 'negative'}`}>
          {trend.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {trend.value}
        </span>
      )}
    </div>
    <div className="ph-stat-glow" />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   PAGE: ACCUEIL PHARMACIE
   ═══════════════════════════════════════════════════════════════ */

const PharmacieHome: React.FC = () => {
  const { socket } = useSocket();
  const [orders, setOrders] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    lowStock: 0,
    completedToday: 0
  });

  const fetchData = async () => {
    try {
      const [ordersRes, stockRes] = await Promise.all([
        CommandeService.findAll(),
        StockService.findAll()
      ]);
      
      setOrders(ordersRes);
      setStocks(stockRes.filter((s: any) => s.quantite < 10));
      
      const totalRevenue = ordersRes
        .filter((o: any) => ['LIVREE', 'PRETE', 'LIVRAISON'].includes(o.statut))
        .reduce((acc: number, o: any) => acc + Number(o.montantTotal), 0);
      setRevenue(totalRevenue);

      const today = new Date().toDateString();
      setStats({
        totalOrders: ordersRes.length,
        pendingOrders: ordersRes.filter((o: any) => o.statut === 'EN_ATTENTE').length,
        lowStock: stockRes.filter((s: any) => s.quantite < 10).length,
        completedToday: ordersRes.filter((o: any) => 
          o.statut === 'LIVREE' && new Date(o.dateCommande).toDateString() === today
        ).length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (socket) {
      socket.on('nouvelle_commande', () => {
        fetchData();
        playNotificationSound();
      });
      socket.on('commande_statut', () => fetchData());
    }

    return () => {
      if (socket) {
        socket.off('nouvelle_commande');
        socket.off('commande_statut');
      }
    };
  }, [socket]);

  const playNotificationSound = () => {
    // Son de notification optionnel
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  if (loading) {
    return (
      <div className="ph-loading-screen">
        <Loader2 className="animate-spin ph-loading-icon" size={48} />
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  const urgentOrders = orders.filter(o => o.statut === 'EN_ATTENTE').slice(0, 5);
  const lowStockItems = stocks.slice(0, 5);

  return (
    <div className="ph-container">
      <SectionHeader 
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre pharmacie"
        icon={<Building2 size={16} />}
        badge="Pharmacie"
      />

      {/* Statistiques */}
      <div className="ph-stats-grid">
        <StatCard
          icon={<ShoppingBag size={22} />}
          value={stats.totalOrders.toString()}
          label="Commandes totales"
          color="sage"
          trend={{ value: '12%', positive: true }}
        />
        <StatCard
          icon={<AlertCircle size={22} />}
          value={stats.lowStock.toString()}
          label="Alertes stock bas"
          color="warning"
          trend={{ value: '3 nouveaux', positive: false }}
        />
        <StatCard
          icon={<DollarSign size={22} />}
          value={`${revenue.toLocaleString()} FCFA`}
          label="Chiffre d'affaires"
          color="blue"
          trend={{ value: '8%', positive: true }}
        />
        <StatCard
          icon={<Clock size={22} />}
          value={stats.pendingOrders.toString()}
          label="En attente"
          color="terracotta"
        />
      </div>

      {/* Grille principale */}
      <div className="ph-main-grid">
        {/* Commandes urgentes */}
        <div className="ph-card">
          <div className="ph-card-header">
            <h3 className="ph-card-title">
              <Clock size={20} />
              Commandes en attente
            </h3>
            {urgentOrders.length > 0 && (
              <span className="ph-count-badge urgent">{urgentOrders.length}</span>
            )}
            <a href="/pharmacie/orders" className="ph-card-link">
              Voir tout <ChevronRight size={14} />
            </a>
          </div>

          {urgentOrders.length > 0 ? (
            <div className="ph-order-list">
              {urgentOrders.map((order) => (
                <div key={order.id} className="ph-order-item">
                  <div className="ph-order-icon">
                    <Package size={18} />
                  </div>
                  <div className="ph-order-info">
                    <strong>#{order.id}</strong>
                    <span>{order.patient?.nomComplet || 'Patient'}</span>
                  </div>
                  <div className="ph-order-amount">
                    {order.montantTotal} FCFA
                  </div>
                  <span className="ph-status-badge warning">En attente</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="ph-empty-state small">
              <CheckCircle2 size={32} className="ph-empty-icon" />
              <p>Aucune commande en attente</p>
              <span>Tout est à jour !</span>
            </div>
          )}
        </div>

        {/* Alertes stock */}
        <div className="ph-card">
          <div className="ph-card-header">
            <h3 className="ph-card-title">
              <AlertCircle size={20} />
              Alertes inventaire
            </h3>
            {lowStockItems.length > 0 && (
              <span className="ph-count-badge danger">{lowStockItems.length}</span>
            )}
            <a href="/pharmacie/stock" className="ph-card-link">
              Gérer <ChevronRight size={14} />
            </a>
          </div>

          {lowStockItems.length > 0 ? (
            <div className="ph-stock-alerts">
              {lowStockItems.map((item) => (
                <div key={item.id} className="ph-stock-item">
                  <div className="ph-stock-info">
                    <div className={`ph-stock-indicator ${item.quantite < 5 ? 'critical' : 'low'}`} />
                    <div>
                      <strong>{item.medicament?.nomCommercial}</strong>
                      <span>{item.medicament?.forme}</span>
                    </div>
                  </div>
                  <div className="ph-stock-qty">
                    <span className={item.quantite < 5 ? 'text-critical' : 'text-warning'}>
                      {item.quantite} unités
                    </span>
                    <div className="ph-stock-bar">
                      <div 
                        className={`ph-stock-level ${item.quantite < 5 ? 'critical' : 'low'}`}
                        style={{ width: `${Math.min((item.quantite / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ph-empty-state small">
              <CheckCircle2 size={32} className="ph-empty-icon" />
              <p>Stock suffisant</p>
              <span>Tous les produits sont bien approvisionnés</span>
            </div>
          )}
        </div>
      </div>

      {/* Carte promotionnelle */}
      <div className="ph-promo-card">
        <div className="ph-promo-bg">
          <div className="ph-promo-gradient" />
          <div className="ph-promo-pattern" />
        </div>
        <div className="ph-promo-content">
          <div className="ph-promo-icon">
            <Sparkles size={32} />
          </div>
          <div>
            <h3 className="ph-promo-title">Développez votre activité</h3>
            <p className="ph-promo-text">
              Les pharmacies sur MEDS voient leurs ventes augmenter en moyenne de 35%. 
              Optimisez vos stocks et attirez plus de clients.
            </p>
            <a href="/pharmacie/stats" className="ph-promo-btn">
              <BarChart3 size={16} />
              Voir mes statistiques
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: INVENTAIRE (STOCK)
   ═══════════════════════════════════════════════════════════════ */

const StockPage: React.FC = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [medicaments, setMedicaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      alert("Erreur : Votre compte n'est lié à aucune pharmacie.");
      return;
    }

    try {
      await StockService.create({
        medicamentId: Number(selectedMed),
        pharmacieId: user.pharmacieId,
        quantite: quantity
      });
      setShowModal(false);
      setSelectedMed('');
      setQuantity(0);
      fetchStocks();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de l'ajout du stock.");
    }
  };

  const handleUpdateQuantity = async (medicamentId: number, newQty: number) => {
    if (!user?.pharmacieId || newQty < 0) return;
    try {
      await StockService.updateQuantity(user.pharmacieId, medicamentId, newQty);
      fetchStocks();
    } catch (err) {
      alert("Erreur lors de la mise à jour du stock.");
    }
  };

  const filteredStocks = stocks.filter(s => 
    s.medicament?.nomCommercial?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableMeds = medicaments.filter(m => 
    !stocks.some(s => s.medicamentId === m.id)
  );

  return (
    <div className="ph-container">
      <SectionHeader 
        title="Inventaire"
        subtitle="Gérez vos stocks et vos prix"
        icon={<Package size={16} />}
        badge="Stock"
        action={
          <button 
            onClick={() => setShowModal(true)}
            className="ph-btn-primary"
          >
            <Plus size={18} />
            Ajouter un produit
          </button>
        }
      />

      {/* Barre de recherche */}
      <div className="ph-search-bar">
        <Search size={18} className="ph-search-icon" />
        <input
          type="text"
          placeholder="Rechercher un médicament..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="ph-search-input"
        />
        <Filter size={16} className="ph-filter-icon" />
      </div>

      {/* Tableau */}
      <div className="ph-table-container">
        <div className="ph-table">
          <div className="ph-table-header">
            <div className="ph-th">Médicament</div>
            <div className="ph-th">Catégorie</div>
            <div className="ph-th">Stock</div>
            <div className="ph-th">Prix</div>
            <div className="ph-th">Statut</div>
          </div>
          
          <div className="ph-table-body">
            {loading ? (
              <div className="ph-loading-row">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : filteredStocks.length > 0 ? (
              filteredStocks.map(s => (
                <div key={s.id} className="ph-table-row">
                  <div className="ph-td product-cell">
                    <div className={`ph-product-icon ${s.quantite < 10 ? 'low' : ''}`}>
                      {s.quantite < 10 ? <AlertCircle size={16} /> : <Package size={16} />}
                    </div>
                    <div>
                      <strong>{s.medicament?.nomCommercial}</strong>
                      <span>{s.medicament?.molecule}</span>
                    </div>
                  </div>
                  <div className="ph-td">
                    <span className="ph-category-badge">{s.medicament?.forme}</span>
                  </div>
                  <div className="ph-td">
                    <div className="ph-qty-control">
                      <button 
                        onClick={() => handleUpdateQuantity(s.medicamentId, s.quantite - 1)}
                        className="ph-qty-btn"
                        disabled={s.quantite <= 0}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={s.quantite}
                        onChange={(e) => handleUpdateQuantity(s.medicamentId, Number(e.target.value))}
                        className="ph-qty-input"
                      />
                      <button 
                        onClick={() => handleUpdateQuantity(s.medicamentId, s.quantite + 1)}
                        className="ph-qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="ph-td">
                    <span className="ph-price">{s.medicament?.prixUnitaire} FCFA</span>
                  </div>
                  <div className="ph-td">
                    <span className={`ph-stock-status ${s.quantite === 0 ? 'out' : s.quantite < 10 ? 'low' : 'ok'}`}>
                      {s.quantite === 0 ? 'Rupture' : s.quantite < 10 ? 'Bas' : 'OK'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="ph-empty-table">
                <Package size={48} className="ph-empty-icon" />
                <p>Aucun produit trouvé</p>
                <span>Ajoutez des médicaments à votre inventaire</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Ajout */}
      {showModal && (
        <div className="ph-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ph-modal" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="ph-modal-close">
              <X size={24} />
            </button>
            
            <div className="ph-modal-header">
              <div className="ph-modal-icon">
                <Plus size={24} />
              </div>
              <h2>Ajouter au stock</h2>
              <p>Sélectionnez un médicament pour l'ajouter à votre pharmacie</p>
            </div>
            
            <form onSubmit={handleAddStock} className="ph-modal-form">
              <div className="ph-form-group">
                <label>Médicament</label>
                <select 
                  value={selectedMed} 
                  onChange={e => setSelectedMed(e.target.value)}
                  required
                  className="ph-select"
                >
                  <option value="">Sélectionner un médicament...</option>
                  {availableMeds.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nomCommercial} - {m.forme}
                    </option>
                  ))}
                </select>
                {availableMeds.length === 0 && (
                  <p className="ph-form-hint">Tous les médicaments sont déjà dans votre stock.</p>
                )}
              </div>
              
              <div className="ph-form-group">
                <label>Quantité initiale</label>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={e => setQuantity(Number(e.target.value))}
                  placeholder="Ex: 50"
                  min="1"
                  required
                  className="ph-input"
                />
              </div>
              
              <button 
                type="submit" 
                className="ph-btn-submit"
                disabled={!selectedMed || quantity <= 0}
              >
                <Plus size={18} />
                Confirmer l'ajout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: CATALOGUE MÉDICAMENTS
   ═══════════════════════════════════════════════════════════════ */

const MedsPage: React.FC = () => {
  const [meds, setMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      alert("Erreur lors de la suppression.");
    }
  };

  const filteredMeds = meds.filter(m => 
    m.nomCommercial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.molecule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ph-container">
      <SectionHeader 
        title="Catalogue Médicaments"
        subtitle="Gérez la liste globale des produits"
        icon={<Stethoscope size={16} />}
        badge="Catalogue"
        action={
          <button 
            onClick={() => setShowAddModal(true)}
            className="ph-btn-primary"
          >
            <Plus size={18} />
            Nouveau médicament
          </button>
        }
      />

      <div className="ph-search-bar">
        <Search size={18} className="ph-search-icon" />
        <input
          type="text"
          placeholder="Rechercher par nom ou molécule..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="ph-search-input"
        />
      </div>

      <div className="ph-table-container">
        <div className="ph-table">
          <div className="ph-table-header">
            <div className="ph-th">Produit</div>
            <div className="ph-th">Molécule</div>
            <div className="ph-th">Forme/Dosage</div>
            <div className="ph-th">Prix Base</div>
            <div className="ph-th">Actions</div>
          </div>
          
          <div className="ph-table-body">
            {loading ? (
              <div className="ph-loading-row">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : filteredMeds.length > 0 ? (
              filteredMeds.map(m => (
                <div key={m.id} className="ph-table-row">
                  <div className="ph-td product-cell">
                    <div className="ph-product-icon catalog">
                      <Stethoscope size={16} />
                    </div>
                    <strong>{m.nomCommercial}</strong>
                  </div>
                  <div className="ph-td">
                    <span className="ph-molecule">{m.molecule}</span>
                  </div>
                  <div className="ph-td">
                    <span className="ph-category-badge">{m.forme}</span>
                  </div>
                  <div className="ph-td">
                    <span className="ph-price">{m.prixUnitaire} FCFA</span>
                  </div>
                  <div className="ph-td">
                    <div className="ph-actions">
                      <button className="ph-action-btn">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteMed(m.id)}
                        className="ph-action-btn danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="ph-empty-table">
                <Stethoscope size={48} className="ph-empty-icon" />
                <p>Aucun médicament trouvé</p>
                <span>Ajoutez des médicaments au catalogue</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Ajout */}
      {showAddModal && (
        <div className="ph-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="ph-modal wide" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAddModal(false)} className="ph-modal-close">
              <X size={24} />
            </button>
            
            <div className="ph-modal-header">
              <div className="ph-modal-icon catalog">
                <Stethoscope size={24} />
              </div>
              <h2>Nouveau Médicament</h2>
              <p>Ajoutez un produit au catalogue global</p>
            </div>
            
            <form onSubmit={handleCreateMed} className="ph-modal-form">
              <div className="ph-form-grid">
                <div className="ph-form-group">
                  <label>Nom Commercial</label>
                  <input 
                    required 
                    type="text" 
                    className="ph-input"
                    value={formData.nomCommercial} 
                    onChange={e => setFormData({...formData, nomCommercial: e.target.value})} 
                    placeholder="Ex: Doliprane" 
                  />
                </div>
                <div className="ph-form-group">
                  <label>Molécule</label>
                  <input 
                    required 
                    type="text" 
                    className="ph-input"
                    value={formData.molecule} 
                    onChange={e => setFormData({...formData, molecule: e.target.value})} 
                    placeholder="Ex: Paracétamol" 
                  />
                </div>
                <div className="ph-form-group">
                  <label>Forme / Dosage</label>
                  <input 
                    required 
                    type="text" 
                    className="ph-input"
                    value={formData.forme} 
                    onChange={e => setFormData({...formData, forme: e.target.value})} 
                    placeholder="Ex: 500mg, Comprimé" 
                  />
                </div>
                <div className="ph-form-group">
                  <label>Prix Unitaire (FCFA)</label>
                  <input 
                    required 
                    type="number" 
                    className="ph-input"
                    value={formData.prixUnitaire} 
                    onChange={e => setFormData({...formData, prixUnitaire: Number(e.target.value)})} 
                    placeholder="Ex: 1500" 
                  />
                </div>
              </div>
              
              <button type="submit" className="ph-btn-submit">
                <Plus size={18} />
                Enregistrer dans le catalogue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: COMMANDES
   ═══════════════════════════════════════════════════════════════ */

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

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
      await fetchOrders();
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusInfo = (status: string) => {
    const statuses: any = {
      'EN_ATTENTE': { color: 'warning', label: 'En attente', icon: <Clock size={14} /> },
      'PAYEE': { color: 'info', label: 'Payée', icon: <Shield size={14} /> },
      'PREPARATION': { color: 'purple', label: 'Préparation', icon: <Package size={14} /> },
      'PRETE': { color: 'sage', label: 'Prête', icon: <CheckCircle2 size={14} /> },
      'LIVRAISON': { color: 'blue', label: 'Livraison', icon: <Zap size={14} /> },
      'LIVREE': { color: 'success', label: 'Livrée', icon: <CheckCircle2 size={14} /> },
      'ANNULEE': { color: 'danger', label: 'Annulée', icon: <X size={14} /> },
    };
    return statuses[status] || statuses['EN_ATTENTE'];
  };

  const filters = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'PAYEE', label: 'Payées' },
    { value: 'PREPARATION', label: 'En préparation' },
    { value: 'PRETE', label: 'Prêtes' },
    { value: 'LIVREE', label: 'Livrées' },
  ];

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(o => o.statut === filter);

  return (
    <div className="ph-container">
      <SectionHeader 
        title="Gestion des Commandes"
        subtitle="Validez et préparez les commandes reçues"
        icon={<ShoppingBag size={16} />}
        badge="Commandes"
      />

      {/* Filtres */}
      <div className="ph-filters">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`ph-filter-btn ${filter === f.value ? 'active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste des commandes */}
      <div className="ph-orders-container">
        {loading ? (
          <div className="ph-loading-screen">
            <Loader2 className="animate-spin ph-loading-icon" size={40} />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="ph-orders-list">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.statut);
              return (
                <div key={order.id} className="ph-order-card">
                  <div className="ph-order-header">
                    <div className="ph-order-id-section">
                      <div className="ph-order-id-icon">
                        <ShoppingBag size={20} />
                      </div>
                      <div>
                        <strong>Commande #{order.id}</strong>
                        <span>{new Date(order.dateCommande).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                    
                    <div className="ph-order-status-section">
                      <span className={`ph-status-badge ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                      <span className={`ph-mode-badge ${order.modeRecuperation === 'RETRAIT' ? 'retrait' : 'livraison'}`}>
                        {order.modeRecuperation === 'RETRAIT' ? '🏪 Retrait' : '🛵 Livraison'}
                      </span>
                    </div>
                  </div>

                  <div className="ph-order-body">
                    <div className="ph-order-customer">
                      <Users size={16} />
                      <div>
                        <strong>{order.patient?.nomComplet}</strong>
                        <span>{order.patient?.telephone}</span>
                      </div>
                    </div>

                    <div className="ph-order-items">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="ph-order-item-row">
                          <span>• {item.quantite}x {item.medicament?.nomCommercial}</span>
                          <span className="ph-item-price">{item.prixUnitaire} FCFA</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="ph-order-footer">
                    <div className="ph-order-total">
                      <span>Total</span>
                      <strong>{order.montantTotal} FCFA</strong>
                    </div>

                    <div className="ph-order-actions">
                      {order.statut === 'PAYEE' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'PREPARATION')}
                          disabled={updating === order.id}
                          className="ph-action-btn-primary"
                        >
                          {updating === order.id ? <Loader2 className="animate-spin" size={14} /> : 'Lancer préparation'}
                        </button>
                      )}
                      {order.statut === 'PREPARATION' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'PRETE')}
                          disabled={updating === order.id}
                          className="ph-action-btn-success"
                        >
                          {updating === order.id ? <Loader2 className="animate-spin" size={14} /> : 
                            order.modeRecuperation === 'RETRAIT' ? 'Prêt pour retrait' : 'Prêt pour livraison'}
                        </button>
                      )}
                      {order.statut === 'PRETE' && order.modeRecuperation === 'RETRAIT' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'LIVREE')}
                          disabled={updating === order.id}
                          className="ph-action-btn-success"
                        >
                          {updating === order.id ? <Loader2 className="animate-spin" size={14} /> : 'Confirmer remise'}
                        </button>
                      )}
                      {!['LIVREE', 'ANNULEE'].includes(order.statut) && (
                        <button 
                          onClick={() => updateStatus(order.id, 'ANNULEE')}
                          disabled={updating === order.id}
                          className="ph-action-btn-danger"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ph-empty-state large">
            <ShoppingBag size={64} className="ph-empty-icon" />
            <h3>Aucune commande</h3>
            <p>Aucune commande ne correspond à ce filtre</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: STATISTIQUES
   ═══════════════════════════════════════════════════════════════ */

const StatsPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    CommandeService.findAll().then(res => setOrders(res));
  }, []);

  const totalRevenue = orders
    .filter(o => ['LIVREE', 'PRETE', 'LIVRAISON'].includes(o.statut))
    .reduce((acc, o) => acc + Number(o.montantTotal), 0);

  const completedOrders = orders.filter(o => o.statut === 'LIVREE').length;
  const successRate = orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0;

  return (
    <div className="ph-container">
      <SectionHeader 
        title="Analyses & Statistiques"
        subtitle="Performance de votre pharmacie"
        icon={<BarChart3 size={16} />}
        badge="Stats"
      />

      <div className="ph-stats-grid">
        <StatCard
          icon={<DollarSign size={22} />}
          value={`${totalRevenue.toLocaleString()} FCFA`}
          label="Chiffre d'affaires"
          color="sage"
          trend={{ value: '15%', positive: true }}
        />
        <StatCard
          icon={<ShoppingBag size={22} />}
          value={completedOrders.toString()}
          label="Commandes livrées"
          color="blue"
          trend={{ value: '8%', positive: true }}
        />
        <StatCard
          icon={<Activity size={22} />}
          value={`${successRate}%`}
          label="Taux de succès"
          color="purple"
          trend={{ value: '5%', positive: true }}
        />
      </div>

      <div className="ph-card">
        <div className="ph-card-header">
          <h3 className="ph-card-title">
            <PieChart size={20} />
            Répartition par produit
          </h3>
        </div>
        <div className="ph-chart-placeholder">
          <BarChart3 size={48} className="ph-chart-icon" />
          <p>Statistiques détaillées</p>
          <span>Les graphiques avancés seront disponibles prochainement</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ROUTEUR PHARMACIE
   ═══════════════════════════════════════════════════════════════ */

const PharmacieDashboard: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  
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