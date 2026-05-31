import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      navigate('/patient');
    }, 1000);
  };

  return (
    <div className="w-full animate-fade-up">
      <div className="mb-8">
        <h2 className="font-outfit font-black text-3xl text-primary mb-2">Bon retour ! 👋</h2>
        <p className="text-gray-500 font-medium">Connectez-vous pour accéder à votre espace MEDS</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 px-4 py-3.5 rounded-2xl mb-6 text-sm font-semibold border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2" htmlFor="email">
            Adresse email
          </label>
          <input
            type="email" id="email" required
            className="form-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-600" htmlFor="password">Mot de passe</label>
            <a href="#" className="text-sm font-bold text-accent hover:text-emerald-600 transition-colors">
              Oublié ?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} id="password" required
              className="form-input pr-12"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-4 text-base mt-2">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connexion...
            </span>
          ) : 'Se connecter'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs font-bold text-gray-300">OU</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Demo access buttons */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        {[
          { label: 'Patient', path: '/patient', color: 'border-accent/30 text-accent hover:bg-accent/5' },
          { label: 'Pharmacie', path: '/pharmacie', color: 'border-blue-200 text-blue-500 hover:bg-blue-50' },
          { label: 'Admin', path: '/admin', color: 'border-purple-200 text-purple-500 hover:bg-purple-50' },
        ].map(d => (
          <button key={d.label} onClick={() => navigate(d.path)}
            className={`text-xs font-black py-2.5 rounded-2xl border transition-all ${d.color}`}>
            Démo {d.label}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 font-medium">
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-black text-accent hover:text-emerald-600 transition-colors">
          S'inscrire gratuitement
        </Link>
      </p>
    </div>
  );
};

export default Login;
