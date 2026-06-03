import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Activity, AlertCircle, BarChart3, Loader2, TrendingUp, MapPin } from 'lucide-react';
import { AIService } from '../services/api.service';
import styles from './AdminDashboard.module.css'; // Reuse admin styles

const DistrictHome: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className="mb-8">
        <h1 className={styles.title}>Observatoire de Santé</h1>
        <p className={styles.subtitle}>Veille épidémiologique régionale</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Indice de Vigilance', value: 'Modéré', icon: <Activity size={20} className="text-accent" />, bg: 'bg-accent/10' },
          { label: 'Alertes Actives', value: '0', icon: <AlertCircle size={20} className="text-red-400" />, bg: 'bg-red-50' },
          { label: 'Tendance Mensuelle', value: '+12%', icon: <TrendingUp size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
            <div className={`w-11 h-11 ${s.bg} rounded-2xl flex items-center justify-center mb-4`}>{s.icon}</div>
            <p className="font-outfit font-black text-primary text-2xl">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <h2 className="font-outfit font-black text-2xl mb-4">Statut de la Région</h2>
        <p className="text-white/80 text-sm max-w-md">Les données actuelles ne montrent aucune épidémie majeure déclarée. La surveillance continue via les logs de recherche MEDS.</p>
      </div>
    </div>
  );
};

const DistrictStats: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AIService.getAlerts().then((res: any) => {
      setAlerts(res.alertes || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className="mb-8">
        <h1 className={styles.title}>Analyses IA & Épidémiologie</h1>
        <p className={styles.subtitle}>Détection précoce des anomalies sanitaires</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                <BarChart3 size={20} className="text-accent" />
                <h2 className="font-outfit font-black text-primary text-lg">Alertes de Surveillance</h2>
            </div>
            <div className="p-6">
                {loading ? <Loader2 className="animate-spin text-accent" /> : (
                    alerts.length > 0 ? alerts.map((a, i) => (
                    <div key={i} className="mb-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                        <p className="font-bold text-red-600">{a.maladie}</p>
                        <p className="text-sm text-red-400">{a.description}</p>
                    </div>
                    )) : <p className="text-gray-400 text-sm">Aucune alerte critique détectée ce jour.</p>
                )}
            </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
            <div className="flex items-center gap-2 mb-6">
                <MapPin size={20} className="text-blue-500" />
                <h2 className="font-outfit font-black text-primary text-lg">Zones de Vigilance</h2>
            </div>
            <div className="space-y-4">
                {['Dakar Plateau', 'Pikine', 'Guédiawaye'].map(zone => (
                    <div key={zone} className="flex items-center justify-between p-4 bg-surfaceAlt rounded-2xl">
                        <span className="text-sm font-bold text-primary">{zone}</span>
                        <span className="text-[10px] font-black px-2 py-1 rounded-full bg-accent/10 text-accent">Sain</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const DistrictDashboard: React.FC = () => {
  const path = window.location.pathname;
  let page = <DistrictHome />;
  if (path.includes('/district/stats')) page = <DistrictStats />;

  return (
    <DashboardLayout role="DISTRICT" userName="District de Santé">
      {page}
    </DashboardLayout>
  );
};

export default DistrictDashboard;
