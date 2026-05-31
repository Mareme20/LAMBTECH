import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  MapPin, ScanText, MessageSquareHeart, ShoppingBag,
  Package, Clock, CheckCircle2, AlertCircle, Search
} from 'lucide-react';

/* ─── Page: Accueil Patient ─── */
const PatientHome: React.FC = () => (
  <div>
    <div className="mb-8">
      <h1 className="font-outfit font-black text-3xl text-primary">Bienvenue 👋</h1>
      <p className="text-gray-500 mt-1 font-medium">Que faisons-nous aujourd'hui ?</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Commandes', value: '3', icon: <ShoppingBag size={20} className="text-accent" />, bg: 'bg-accent/10' },
        { label: 'Livraisons', value: '2', icon: <Package size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
        { label: 'Scans IA', value: '1', icon: <ScanText size={20} className="text-purple-500" />, bg: 'bg-purple-50' },
        { label: 'Pharmacies proches', value: '7', icon: <MapPin size={20} className="text-orange-400" />, bg: 'bg-orange-50' },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft flex items-center gap-4">
          <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center shrink-0`}>{s.icon}</div>
          <div>
            <p className="font-outfit font-black text-primary text-2xl">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-outfit font-black text-primary text-lg">Dernière commande</h2>
          <span className="text-[11px] font-black px-3 py-1.5 rounded-full bg-blue-50 text-blue-500">En livraison</span>
        </div>
        <div className="flex items-center gap-4 p-4 bg-surfaceAlt rounded-2xl mb-4">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
            <Package size={20} className="text-accent" />
          </div>
          <div>
            <p className="font-outfit font-black text-primary text-sm">Amoxicilline 1g × 1</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Pharmacie Médina · 1 400 FCFA</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Clock size={14} className="text-accent" />
          Livraison estimée dans <span className="font-black text-primary ml-1">~12 min</span>
        </div>
        <div className="w-full bg-surfaceAlt h-2 rounded-full mt-3">
          <div className="bg-gradient-to-r from-accent to-emerald-300 h-full rounded-full" style={{ width: '65%' }} />
        </div>
      </div>
      <div className="bg-primary rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
        <h2 className="font-outfit font-black text-white text-lg mb-3">Scanner une ordonnance</h2>
        <p className="text-gray-300 text-sm font-medium mb-6 max-w-xs">L'IA prépare votre panier en quelques secondes.</p>
        <button className="btn-primary text-sm px-5 py-2.5 w-max">
          <ScanText size={16} /> Scanner maintenant
        </button>
      </div>
    </div>
  </div>
);

/* ─── Page: Recherche ─── */
const SearchPage: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [searched, setSearched] = React.useState(false);
  const results = [
    { name: 'Pharmacie Plateau', dist: '0.4 km', price: '1 500 FCFA', status: 'Ouvert', qty: 12 },
    { name: 'Pharmacie Médina', dist: '1.2 km', price: '1 400 FCFA', status: 'Ouvert', qty: 3 },
    { name: 'Pharmacie HLM', dist: '1.8 km', price: '1 550 FCFA', status: 'Ouvert', qty: 8 },
    { name: 'Pharmacie Sacré-Cœur', dist: '2.5 km', price: '1 600 FCFA', status: 'Fermé', qty: 0 },
  ];
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-outfit font-black text-3xl text-primary">Rechercher</h1>
        <p className="text-gray-500 mt-1 font-medium">Trouvez vos médicaments autour de vous</p>
      </div>
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 mb-6">
        <div className="flex gap-3 mb-3">
          <div className="flex-1 flex items-center gap-3 bg-surfaceAlt rounded-2xl px-4 py-3.5">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input value={query} onChange={e => setQuery(e.target.value)} type="text" placeholder="Ex: Paracétamol..." className="bg-transparent text-sm text-primary placeholder:text-gray-400 focus:outline-none w-full font-medium" onKeyDown={e => e.key === 'Enter' && setSearched(true)} />
          </div>
          <button onClick={() => setSearched(true)} className="btn-primary px-6 py-3 text-sm rounded-2xl">Rechercher</button>
        </div>
        <p className="text-xs text-gray-400 font-semibold flex items-center gap-1"><MapPin size={12} className="text-accent" /> Localisation activée — Dakar</p>
      </div>
      {searched ? (
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-500 mb-4">{results.length} résultats pour "<span className="text-primary">{query || 'Paracétamol'}</span>"</p>
          {results.map(r => (
            <div key={r.name} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft flex items-center justify-between hover:border-accent/30 hover:shadow-premium transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${r.status === 'Ouvert' ? 'bg-accent/10' : 'bg-gray-100'}`}>
                  <MapPin size={20} className={r.status === 'Ouvert' ? 'text-accent' : 'text-gray-400'} />
                </div>
                <div>
                  <p className="font-outfit font-black text-primary text-base">{r.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 font-medium">{r.dist}</span>
                    <span className="text-xs font-bold text-primary">{r.price}</span>
                    {r.qty > 0 && <span className="text-xs text-gray-400">{r.qty} en stock</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-black px-3 py-1.5 rounded-full ${r.status === 'Ouvert' ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-400'}`}>{r.status}</span>
                {r.status === 'Ouvert' && <button className="btn-primary text-xs px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">Commander</button>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-soft text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-4"><Search size={28} className="text-accent" /></div>
          <p className="font-outfit font-black text-primary text-xl mb-2">Cherchez vos médicaments</p>
          <p className="text-gray-400 text-sm font-medium">Tapez le nom d'un médicament et appuyez Entrée</p>
        </div>
      )}
    </div>
  );
};

/* ─── Page: Commandes ─── */
const OrdersPage: React.FC = () => {
  const orders = [
    { id: '#MEDS-0042', med: 'Paracétamol 500mg × 2', pharmacy: 'Pharmacie Plateau', date: '31 mai 2026', status: 'Livré', color: 'bg-accent/10 text-accent' },
    { id: '#MEDS-0039', med: 'Amoxicilline 1g × 1', pharmacy: 'Pharmacie Médina', date: '28 mai 2026', status: 'En livraison', color: 'bg-blue-50 text-blue-500' },
    { id: '#MEDS-0031', med: 'Ibuprofène 400mg × 3', pharmacy: 'Pharmacie HLM', date: '20 mai 2026', status: 'Livré', color: 'bg-accent/10 text-accent' },
  ];
  return (
    <div>
      <div className="mb-8"><h1 className="font-outfit font-black text-3xl text-primary">Mes commandes</h1><p className="text-gray-500 mt-1 font-medium">Historique de vos commandes</p></div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="hidden md:grid grid-cols-5 px-6 py-3 bg-surfaceAlt text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <span>N°</span><span className="col-span-2">Médicament</span><span>Pharmacie</span><span>Statut</span>
        </div>
        {orders.map(o => (
          <div key={o.id} className="grid md:grid-cols-5 gap-2 px-6 py-4 items-center border-b border-gray-50 last:border-0 hover:bg-surfaceAlt/50 transition-colors">
            <span className="font-outfit font-black text-primary text-sm">{o.id}</span>
            <span className="text-sm font-medium text-gray-700 md:col-span-2">{o.med}</span>
            <span className="text-sm text-gray-500 font-medium">{o.pharmacy}</span>
            <span className={`text-[11px] font-black px-3 py-1.5 rounded-full w-max ${o.color}`}>{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Page: Scan OCR (Mobile-First Viewfinder) ─── */
const ScanPage: React.FC = () => {
  const [scanning, setScanning] = React.useState(false);
  const [result, setResult] = React.useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResult(true);
    }, 3000); // Simulate 3s IA processing
  };

  if (result) {
    return (
      <div className="animate-fade-up">
        <div className="mb-8"><h1 className="font-outfit font-black text-3xl text-primary">Analyse terminée</h1><p className="text-gray-500 mt-1 font-medium">Médicaments détectés sur l'ordonnance</p></div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6 max-w-2xl">
          <div className="space-y-4 mb-8">
            {[
              { name: 'Paracétamol 500mg', dose: '3 fois/jour · 5 jours', found: true },
              { name: 'Amoxicilline 1g', dose: '2 fois/jour · 7 jours', found: true },
              { name: 'Ibuprofène 400mg', dose: '1 fois/jour · 3 jours', found: false },
            ].map(m => (
              <div key={m.name} className="flex items-center justify-between p-4 bg-surfaceAlt rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.found ? 'bg-accent/10' : 'bg-orange-50'}`}>
                    {m.found ? <CheckCircle2 size={20} className="text-accent" /> : <AlertCircle size={20} className="text-orange-400" />}
                  </div>
                  <div><p className="font-outfit font-black text-primary text-base">{m.name}</p><p className="text-sm text-gray-400 font-medium">{m.dose}</p></div>
                </div>
                <span className={`text-xs font-black px-3 py-1.5 rounded-full ${m.found ? 'bg-accent/10 text-accent' : 'bg-orange-50 text-orange-400'}`}>{m.found ? 'Trouvé' : 'Intro.'}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setResult(false)} className="btn-ghost py-4 flex-1">Nouveau scan</button>
            <button className="btn-primary py-4 flex-1">Commander (2)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative -mx-4 md:mx-0 md:bg-white md:rounded-3xl md:border md:border-gray-100 md:shadow-soft overflow-hidden flex flex-col items-center justify-center h-[calc(100vh-140px)] md:h-[600px] bg-black">
      {/* Viewfinder UI */}
      <div className="relative w-full max-w-sm aspect-[3/4] sm:aspect-square rounded-3xl overflow-hidden border-2 border-white/20">
        {/* Background Image / Camera Feed Placeholder */}
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <ScanText size={48} className="text-white/20" />
        </div>
        
        {/* Radar Scanner Line */}
        {scanning && <div className="absolute inset-0 w-full h-full scan-radar" />}
        
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-accent rounded-tl-xl"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-accent rounded-tr-xl"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-accent rounded-bl-xl"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-accent rounded-br-xl"></div>
        
        {/* Helper text */}
        <div className="absolute inset-x-0 top-12 text-center px-4">
          <p className="text-white font-black drop-shadow-md text-lg">Placez l'ordonnance dans le cadre</p>
          <p className="text-white/80 text-sm font-medium drop-shadow-md">L'IA détectera automatiquement les médicaments</p>
        </div>
        
        {/* Shutter / Scan Button */}
        <div className="absolute inset-x-0 bottom-8 flex justify-center">
          <button 
            onClick={handleScan}
            disabled={scanning}
            className={`w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center transition-transform active:scale-95 ${scanning ? 'bg-accent border-accent animate-pulse' : 'bg-white/20 backdrop-blur-md'}`}
          >
            <div className={`w-14 h-14 bg-white rounded-full transition-all ${scanning ? 'scale-50' : 'scale-100'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Page: Chat ─── */
const ChatPage: React.FC = () => {
  const [msgs, setMsgs] = React.useState([{ role: 'bot', text: 'Bonjour ! Je suis l\'assistant IA de MEDS. Comment puis-je vous aider ?' }]);
  const [input, setInput] = React.useState('');
  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { role: 'user', text: input }, { role: 'bot', text: 'Je comprends votre question. Consultez un professionnel de santé pour des conseils personnalisés.' }]);
    setInput('');
  };
  return (
    <div>
      <div className="mb-8"><h1 className="font-outfit font-black text-3xl text-primary">Assistant IA Santé</h1><p className="text-gray-500 mt-1 font-medium">Posez vos questions de santé</p></div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden" style={{ height: '540px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-surfaceAlt">
          <div className="w-9 h-9 rounded-2xl bg-accent/10 flex items-center justify-center"><MessageSquareHeart size={18} className="text-accent" /></div>
          <div><p className="font-outfit font-black text-primary text-sm">MEDS AI</p><p className="text-[11px] text-gray-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />En ligne</p></div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-3xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-accent text-white rounded-br-lg' : 'bg-surfaceAlt text-gray-700 rounded-bl-lg'}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="px-4 py-4 border-t border-gray-100 flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} type="text" placeholder="Posez votre question..." className="form-input rounded-2xl flex-1 py-3" />
          <button onClick={send} className="btn-primary px-5 py-3 rounded-2xl text-sm">Envoyer</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Routeur interne Patient ─── */
const PatientDashboard: React.FC = () => {
  const path = window.location.pathname;
  const page =
    path.includes('/patient/orders') ? <OrdersPage /> :
    path.includes('/patient/scan') ? <ScanPage /> :
    path.includes('/patient/chat') ? <ChatPage /> :
    path.includes('/patient/recherche') ? <SearchPage /> :
    <PatientHome />;

  return (
    <DashboardLayout role="PATIENT" userName="Aissatou D.">
      {page}
    </DashboardLayout>
  );
};

export default PatientDashboard;
