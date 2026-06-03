import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await AuthService.login(email, password);
      login(response);
      
      // Redirect based on role
      const role = response.user.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'PHARMACIE') navigate('/pharmacie');
      else if (role === 'LIVREUR') navigate('/livreur');
      else if (role === 'DISTRICT') navigate('/district');
      else navigate('/patient');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className="mb-8">
        <h2 className={styles.title}>Bon retour ! 👋</h2>
        <p className={styles.subtitle}>Connectez-vous pour accéder à votre espace MEDS</p>
      </div>

      {error && (
        <div className={styles.errorBadge}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Adresse email
          </label>
          <input
            type="email" id="email" required
            className={styles.input}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.com"
          />
        </div>

        <div className={styles.formGroup}>
          <div className="flex justify-between items-center mb-2">
            <label className={styles.label} htmlFor="password">Mot de passe</label>
            <a href="#" className="text-sm font-bold text-accent hover:text-emerald-600 transition-colors">
              Oublié ?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} id="password" required
              className={`${styles.input} pr-12`}
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

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Connexion...
            </>
          ) : 'Se connecter'}
        </button>
      </form>

      <div className={styles.divider}>
        <div className={styles.line} />
        <span className={styles.dividerText}>OU</span>
        <div className={styles.line} />
      </div>

      <div className={styles.demoGrid}>
        {[
          { label: 'Patient', path: '/patient', color: 'border-accent/30 text-accent hover:bg-accent/5' },
          { label: 'Pharmacie', path: '/pharmacie', color: 'border-blue-200 text-blue-500 hover:bg-blue-50' },
          { label: 'Admin', path: '/admin', color: 'border-purple-200 text-purple-500 hover:bg-purple-50' },
          { label: 'District', path: '/district', color: 'border-emerald-200 text-emerald-500 hover:bg-emerald-50' },
        ].map(d => (
          <button key={d.label} type="button" onClick={() => navigate(d.path)}
            className={`${styles.demoBtn} ${d.color}`}>
            Démo {d.label}
          </button>
        ))}
      </div>

      <p className={styles.footerText}>
        Pas encore de compte ?{' '}
        <Link to="/register" className={styles.link}>
          S'inscrire gratuitement
        </Link>
      </p>
    </div>
  );
};

export default Login;
