import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Navigation, MapPin, Clock, CheckCircle2, Truck, Star, Loader2 } from 'lucide-react';
import { CommandeService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import styles from './LivreurDashboard.module.css';

const LivreurHome: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Courses', value: '0', icon: <Truck size={20} className="text-accent" />, bg: 'bg-accent/10' },
    { label: 'Gains', value: '0', icon: <Star size={20} className="text-yellow-400" />, bg: 'bg-yellow-50' },
    { label: 'Note', value: '5.0 ★', icon: <Star size={20} className="text-yellow-400 fill-yellow-400" />, bg: 'bg-yellow-50' },
    { label: 'Distance', value: '0 km', icon: <Navigation size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
  ]);

  const fetchOrders = async () => {
    try {
      const res = await CommandeService.findAll();
      const active = res.filter(o => o.statut === 'PRETE' || o.statut === 'LIVRAISON');
      const completed = res.filter(o => o.statut === 'LIVREE');
      setCourses(active);
      setStats(prev => [
        { ...prev[0], value: completed.length.toString() },
        { ...prev[1], value: (completed.length * 1500).toLocaleString() + ' FCFA' },
        ...prev.slice(2)
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    if (socket) {
      socket.on('course_assignee', (data: any) => {
        if (data.livreurId === user?.id) {
          alert("Une nouvelle course vous a été assignée !");
          fetchOrders();
        }
      });

      socket.on('commande_statut', () => {
        fetchOrders();
      });
    }

    return () => {
      if (socket) {
        socket.off('course_assignee');
        socket.off('commande_statut');
      }
    };
  }, [socket, user]);

  // GPS Simulation
  useEffect(() => {
    if (isOnline && socket && user) {
      const interval = setInterval(() => {
        // Simulation de mouvement autour de Dakar
        const lat = 14.7 + (Math.random() - 0.5) * 0.01;
        const lon = -17.4 + (Math.random() - 0.5) * 0.01;
        
        socket.emit('update_position', {
          livreurId: user.id,
          latitude: lat,
          longitude: lon
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOnline, socket, user]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await CommandeService.updateStatus(id, status);
      fetchOrders();
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className={styles.container}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={styles.title}>Espace Livreur</h1>
          <p className={styles.subtitle}>Gérez vos courses et votre disponibilité</p>
        </div>
        <div className={styles.toggleContainer}>
          <div>
            <p className={styles.toggleLabel}>Disponibilité</p>
            <p className={`${styles.toggleStatus} ${isOnline ? styles.statusOnline : styles.statusOffline}`}>
              {isOnline ? '● En ligne — En attente' : '○ Hors ligne'}
            </p>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`${styles.toggle} ${isOnline ? styles.toggleActive : ''}`}
          >
            <span className={`${styles.toggleThumb} ${isOnline ? styles.toggleThumbActive : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft">
            <div className={`w-11 h-11 ${s.bg} rounded-2xl flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="font-outfit font-black text-primary text-2xl">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.courseCard}>
        <div className={styles.courseHeader}>
          <h2 className="font-outfit font-black text-primary text-lg">Courses en cours</h2>
        </div>
        {!isOnline ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4"><Truck size={28} className="text-gray-300" /></div>
            <p className="font-outfit font-black text-primary text-lg mb-2">Vous êtes hors ligne</p>
            <p className="text-gray-400 text-sm font-medium">Activez votre disponibilité pour recevoir des courses</p>
          </div>
        ) : (
          <div>
            {loading ? <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div> : 
             courses.length > 0 ? courses.map(c => (
              <div key={c.id} className="bg-white border border-gray-100 rounded-3xl p-6 mb-4 shadow-sm">
                <div className={styles.courseHeader}>
                  <span className={styles.orderId}>#MEDS-{c.id}</span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full ${c.statut === 'PRETE' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                    {c.statut === 'PRETE' ? 'À RÉCUPÉRER' : 'EN LIVRAISON'}
                  </span>
                </div>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <div className={`${styles.timelineIcon} ${styles.iconStart}`}><MapPin size={14} /></div>
                    <div className={styles.timelineContent}>
                      <p className="text-xs font-black text-gray-400 uppercase">Départ (Pharmacie)</p>
                      <p className="font-bold text-primary">{c.pharmacie?.nom}</p>
                      <p className="text-xs text-gray-400">{c.pharmacie?.adresse}</p>
                    </div>
                  </div>
                  <div className={styles.timelineLine} />
                  <div className={styles.timelineItem}>
                    <div className={`${styles.timelineIcon} ${styles.iconEnd}`}><Navigation size={14} /></div>
                    <div className={styles.timelineContent}>
                      <p className="text-xs font-black text-gray-400 uppercase">Destination (Patient)</p>
                      <p className="font-bold text-primary">{c.patient?.nomComplet}</p>
                      <p className="text-xs text-gray-400">Tél: {c.patient?.telephone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {c.statut === 'PRETE' ? (
                    <button 
                      onClick={() => handleUpdateStatus(c.id, 'LIVRAISON')}
                      className="btn-primary w-full justify-center py-3 rounded-2xl text-sm col-span-2"
                    >
                      Récupérer le colis
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleUpdateStatus(c.id, 'LIVREE')}
                      className="bg-accent text-white font-bold w-full justify-center py-3 rounded-2xl text-sm col-span-2 flex items-center gap-2"
                    >
                      <CheckCircle2 size={18} /> Confirmer la livraison
                    </button>
                  )}
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
  );
};

const CoursesHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CommandeService.findAll().then(res => {
      setOrders(res.filter(o => o.statut === 'LIVREE'));
      setLoading(false);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className="mb-8">
        <h1 className={styles.title}>Historique des courses</h1>
        <p className={styles.subtitle}>Toutes vos livraisons terminées</p>
      </div>

      <div className="space-y-4">
        {loading ? <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-accent" /></div> : 
         orders.length > 0 ? orders.map(o => (
           <div key={o.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
             <div className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center">
                   <CheckCircle2 size={24} className="text-accent" />
                 </div>
                 <div>
                   <p className="font-outfit font-black text-primary text-lg">Course #MEDS-{o.id}</p>
                   <p className="text-xs text-gray-400 font-medium">{new Date(o.dateCommande).toLocaleDateString()}</p>
                 </div>
               </div>
               <p className="font-outfit font-black text-primary">1 500 FCFA</p>
             </div>
             <div className="pl-16 space-y-1">
                <p className="text-sm text-gray-500 font-medium flex items-center gap-2"><MapPin size={14} className="text-gray-300" /> {o.pharmacie?.nom}</p>
                <p className="text-sm text-gray-500 font-medium flex items-center gap-2"><Navigation size={14} className="text-gray-300" /> {o.patient?.nomComplet}</p>
             </div>
           </div>
         )) : (
           <div className="text-center py-20">
             <Truck size={48} className="mx-auto text-gray-100 mb-4" />
             <p className="text-gray-400">Aucune course terminée pour le moment.</p>
           </div>
         )}
      </div>
    </div>
  );
};

const LivreurDashboard: React.FC = () => {
  const path = window.location.pathname;
  let page = <LivreurHome />;
  if (path.includes('/livreur/courses')) page = <CoursesHistory />;

  return (
    <DashboardLayout role="LIVREUR" userName="Livreur">
      {page}
    </DashboardLayout>
  );
};

export default LivreurDashboard;
