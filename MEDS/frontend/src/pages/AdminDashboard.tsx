import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Users, ShoppingBag, TrendingUp, AlertCircle, MapPin, Activity, ChevronRight, Shield, Loader2, UserPlus, X, Store, Plus } from 'lucide-react';
import { AuthService } from '../services/auth.service';
import { AIService, PharmacieService } from '../services/api.service';
import styles from './AdminDashboard.module.css';
import { UserRole } from '../types';

/* ─── Page: Accueil Admin ─── */
const AdminHome: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className="mb-8">
        <h1 className={styles.title}>Administration MEDS</h1>
        <p className={styles.subtitle}>Vue globale du système</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Utilisateurs', value: '---', icon: <Users size={20} className="text-accent" />, bg: 'bg-accent/10' },
          { label: 'Commandes/mois', value: '---', icon: <ShoppingBag size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'Recherches', value: '---', icon: <TrendingUp size={20} className="text-purple-500" />, bg: 'bg-purple-50' },
          { label: 'Alertes', value: '---', icon: <AlertCircle size={20} className="text-red-400" />, bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft">
            <div className={`w-11 h-11 ${s.bg} rounded-2xl flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="font-outfit font-black text-primary text-2xl">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={18} className="text-accent" />
            <h2 className="font-outfit font-black text-primary text-lg">Activité système</h2>
          </div>
          <p className="text-sm text-gray-400">En attente de données temps réel...</p>
        </div>
        <div className="bg-primary rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center text-center items-center min-h-[300px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm border border-accent/20">
            <Shield size={32} className="text-accent" />
          </div>
          <h2 className="font-outfit font-black text-white text-2xl mb-2">État du système : Optimal</h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">Serveurs opérationnels.</p>
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Pharmacies ─── */
const PharmaciesPage: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    latitude: 14.7167,
    longitude: -17.4677,
    heureOuverture: '08:00',
    heureFermeture: '22:00'
  });

  const fetchPharmacies = () => {
    setLoading(true);
    PharmacieService.findAll().then(res => {
      setPharmacies(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handleAddPharmacie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await PharmacieService.create(formData);
      setShowAddModal(false);
      setFormData({ nom: '', adresse: '', telephone: '', latitude: 14.7167, longitude: -17.4677, heureOuverture: '08:00', heureFermeture: '22:00' });
      fetchPharmacies();
      alert("Pharmacie créée avec succès !");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de la création de la pharmacie");
    }
  };

  return (
    <div className={styles.container}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className={styles.title}>Gestion des Pharmacies</h1>
          <p className={styles.subtitle}>Réseau MEDS</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
        >
          <Plus size={18} /> Nouvelle Pharmacie
        </button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Nom</span><span>Adresse</span><span>Contact</span><span>Horaires</span>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div> : pharmacies.map((p) => (
            <div key={p.id} className={styles.tableRow}>
              <div className="flex items-center gap-3">
                <Store size={16} className="text-accent" />
                <span className="font-outfit font-black text-primary text-sm">{p.nom}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">{p.adresse}</span>
              <span className="text-xs text-gray-500 font-medium">{p.telephone}</span>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 text-blue-500">{p.heureOuverture} - {p.heureFermeture}</span>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative animate-fade-up max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-primary"><X size={24} /></button>
            <h2 className="font-outfit font-black text-2xl text-primary mb-6">Nouvelle Pharmacie</h2>
            
            <form onSubmit={handleAddPharmacie} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Nom de l'officine</label>
                <input required type="text" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                  value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} placeholder="Pharmacie de la Nation" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Adresse complète</label>
                <input required type="text" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                  value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} placeholder="Dakar, Plateau" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Téléphone</label>
                  <input required type="text" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} placeholder="+221 ..." />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Garde</label>
                  <select className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent">
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Latitude</label>
                  <input required type="number" step="any" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.latitude} onChange={e => setFormData({...formData, latitude: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Longitude</label>
                  <input required type="number" step="any" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.longitude} onChange={e => setFormData({...formData, longitude: Number(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-4 rounded-2xl mt-4">Créer la pharmacie</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Page: Utilisateurs ─── */
const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
    nomComplet: '',
    role: UserRole.PATIENT,
    adresse: '',
    telephone: '',
    pharmacieId: undefined as number | undefined
  });

  const fetchUsers = () => {
    setLoading(true);
    AuthService.getUsers().then(res => {
      setUsers(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
    PharmacieService.findAll().then(setPharmacies);
  }, []);

  const toggleStatus = async (id: number) => {
    await AuthService.toggleUserStatus(id);
    setUsers(users.map(u => u.id === id ? { ...u, estActif: !u.estActif } : u));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.register(formData);
      setShowAddModal(false);
      setFormData({ email: '', motDePasse: '', nomComplet: '', role: 'PATIENT', adresse: '', telephone: '', pharmacieId: undefined });
      fetchUsers();
      alert("Utilisateur créé avec succès !");
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de l'ajout de l'utilisateur");
    }
  };

  return (
    <div className={styles.container}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className={styles.title}>Gestion des Utilisateurs</h1>
          <p className={styles.subtitle}>Patients, Pharmacies et Livreurs</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
        >
          <UserPlus size={18} /> Ajouter un utilisateur
        </button>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className="col-span-1">Utilisateur</span><span>Rôle</span><span>Statut</span><span>Action</span>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div> : users.map((u) => (
            <div key={u.id} className={styles.tableRow}>
              <div>
                <p className="font-outfit font-black text-primary text-sm">{u.nom}</p>
                <p className="text-xs text-gray-400 font-medium">{u.email}</p>
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 text-blue-500 w-fit">{u.role}</span>
              <span className={`text-[11px] font-black px-3 py-1.5 rounded-full w-max ${u.estActif ? 'bg-accent/10 text-accent' : 'bg-red-50 text-red-500'}`}>
                {u.estActif ? 'Actif' : 'Inactif'}
              </span>
              <button onClick={() => toggleStatus(u.id)} className="text-xs font-bold text-primary hover:underline">
                Changer statut
              </button>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative animate-fade-up max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-primary"><X size={24} /></button>
            <h2 className="font-outfit font-black text-2xl text-primary mb-6">Nouvel Utilisateur</h2>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Nom Complet</label>
                  <input required type="text" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.nomComplet} onChange={e => setFormData({...formData, nomComplet: e.target.value})} placeholder="Jean Dupont" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Rôle</label>
                  <select className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                    <option value="PATIENT">Patient</option>
                    <option value="PHARMACIE">Pharmacien</option>
                    <option value="LIVREUR">Livreur</option>
                    <option value="DISTRICT">District Sanitaire</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
              </div>

              {formData.role === 'PHARMACIE' && (
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Associer à une Pharmacie</label>
                  <select required className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.pharmacieId} onChange={e => setFormData({...formData, pharmacieId: Number(e.target.value)})}>
                    <option value="">Sélectionner une pharmacie...</option>
                    {pharmacies.map(p => (
                      <option key={p.id} value={p.id}>{p.nom}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Email</label>
                  <input required type="email" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@test.com" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Téléphone</label>
                  <input required type="text" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                    value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} placeholder="+221 ..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Adresse</label>
                <input required type="text" className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                  value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} placeholder="Dakar, Plateau" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Mot de passe</label>
                <input required type="password" minLength={6} className="w-full bg-surfaceAlt border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 ring-accent"
                  value={formData.motDePasse} onChange={e => setFormData({...formData, motDePasse: e.target.value})} placeholder="••••••••" />
              </div>
              <button type="submit" className="btn-primary w-full py-4 rounded-2xl mt-4">Créer l'utilisateur</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Page: Épidémiologie ─── */
const EpiPage: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AIService.getAlerts().then((res: any) => {
      // Le backend renvoie { count: number, alertes: [] }
      setAlerts(res.alertes || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className="mb-8">
        <h1 className={styles.title}>Prédiction Épidémiologique</h1>
        <p className={styles.subtitle}>Modélisation et détection précoce via IA</p>
      </div>

      <div className={styles.alertCard}>
        <div className={styles.alertPulse} />
        <div className="relative z-10">
          <div className={styles.alertTitle}>
            <AlertCircle size={20} className="text-red-400" />
            <h2>Alerte IA : Analyse en cours</h2>
          </div>
          <p className={styles.alertDesc}>
            L'algorithme MEDS analyse les tendances de recherche et de vente pour détecter des anomalies sanitaires.
          </p>
        </div>
        <div className={styles.btnGroup}>
          <button className="bg-white text-primary font-bold text-sm px-6 py-3 rounded-2xl">Avertir les autorités</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-outfit font-black text-primary text-lg">Alertes détectées</h2>
        </div>
        <div className="p-6">
          {loading ? <Loader2 className="animate-spin text-accent" /> : (
            alerts.length > 0 ? alerts.map((a, i) => (
              <div key={i} className="mb-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="font-bold text-red-600">{a.maladie}</p>
                <p className="text-sm text-red-400">{a.description}</p>
              </div>
            )) : <p className="text-gray-400">Aucune alerte majeure détectée.</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Routeur interne Admin ─── */
const AdminDashboard: React.FC = () => {
  const path = window.location.pathname;
  let page = <AdminHome />;
  if (path.includes('/admin/users')) page = <UsersPage />;
  else if (path.includes('/admin/pharmacies')) page = <PharmaciesPage />;
  else if (path.includes('/admin/stats')) page = <EpiPage />;

  return (
    <DashboardLayout role="ADMIN" userName="Admin">
      {page}
    </DashboardLayout>
  );
};

export default AdminDashboard;
