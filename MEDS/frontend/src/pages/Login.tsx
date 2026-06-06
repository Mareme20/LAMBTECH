import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, 
  Heart, Shield, UserCog, Building2, Building 
} from 'lucide-react';
import { AuthService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import './login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await AuthService.login(email, password);
      login(response);
      
      const role = response.user.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'PHARMACIE') navigate('/pharmacie');
      else if (role === 'LIVREUR') navigate('/livreur');
      else if (role === 'DISTRICT') navigate('/district');
      else navigate('/patient');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants invalides');
      // Animation de shake sur l'erreur
      const form = document.querySelector('.login-form');
      form?.classList.add('shake-error');
      setTimeout(() => form?.classList.remove('shake-error'), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    let demoEmail = '';
    const demoPassword = 'password';

    switch (role) {
      case 'ADMIN': demoEmail = 'admin@meds.test'; break;
      case 'PHARMACIE': demoEmail = 'pharmacie1@meds.test'; break;
      case 'LIVREUR': demoEmail = 'livreur1@meds.test'; break;
      case 'PATIENT': demoEmail = 'patient1@meds.test'; break;
      case 'DISTRICT': demoEmail = 'admin@meds.test'; break;
    }

    setLoading(true);
    setError('');
    try {
      const response = await AuthService.login(demoEmail, demoPassword);
      login(response);
      const targetRole = response.user.role;
      if (targetRole === 'ADMIN') navigate('/admin');
      else if (targetRole === 'PHARMACIE') navigate('/pharmacie');
      else if (targetRole === 'LIVREUR') navigate('/livreur');
      else if (targetRole === 'DISTRICT') navigate('/district');
      else navigate('/patient');
    } catch (err: any) {
      setError("Le compte de démo n'est pas encore créé. Lancez 'npm run seed' dans le backend.");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { 
      label: 'Patient', 
      role: 'PATIENT', 
      icon: <Heart className="demo-icon" />,
      color: 'demo-patient',
      description: 'Espace patient'
    },
    { 
      label: 'Pharmacie', 
      role: 'PHARMACIE', 
      icon: <Building2 className="demo-icon" />,
      color: 'demo-pharmacy',
      description: 'Gestion officine'
    },
    { 
      label: 'Admin', 
      role: 'ADMIN', 
      icon: <Shield className="demo-icon" />,
      color: 'demo-admin',
      description: 'Administration'
    },
    { 
      label: 'District', 
      role: 'DISTRICT', 
      icon: <Building className="demo-icon" />,
      color: 'demo-district',
      description: 'Supervision'
    },
  ];

  return (
    <div className="login-wrapper">
      {/* ══════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════ */}
      <div className="login-header">
        <div className="login-badge">
          <div className="badge-pulse" />
          <span>Espace sécurisé</span>
        </div>
        
        <h1 className="login-title">
          Bon retour <span className="wave-emoji">👋</span>
        </h1>
        
        <p className="login-subtitle">
          Connectez-vous pour accéder à votre espace santé personnalisé
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════
          MESSAGE D'ERREUR ANIMÉ
      ══════════════════════════════════════════════════════ */}
      {error && (
        <div className="error-container">
          <div className="error-card">
            <div className="error-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="error-message">{error}</p>
            <button onClick={() => setError('')} className="error-close">
              ×
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          FORMULAIRE DE CONNEXION
      ══════════════════════════════════════════════════════ */}
      <form onSubmit={handleLogin} className="login-form">
        {/* Champ Email */}
        <div className={`form-field ${focusedField === 'email' ? 'field-focused' : ''} ${email ? 'field-filled' : ''}`}>
          <label className="field-label" htmlFor="email">
            <Mail className="label-icon" />
            Adresse email
          </label>
          <div className="field-input-wrapper">
            <input
              type="email"
              id="email"
              required
              className="field-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="votre@email.com"
            />
            {email && (
              <div className="field-indicator valid">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
          <div className="field-border" />
        </div>

        {/* Champ Mot de passe */}
        <div className={`form-field ${focusedField === 'password' ? 'field-focused' : ''} ${password ? 'field-filled' : ''}`}>
          <div className="field-label-row">
            <label className="field-label" htmlFor="password">
              <Lock className="label-icon" />
              Mot de passe
            </label>
            <a href="/forgot-password" className="forgot-link">
              Mot de passe oublié ?
            </a>
          </div>
          <div className="field-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              required
              className="field-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="field-border" />
        </div>

        {/* Bouton de connexion */}
        <button 
          type="submit" 
          disabled={loading} 
          className={`submit-button ${loading ? 'submit-loading' : ''}`}
        >
          <span className="submit-content">
            {loading ? (
              <>
                <Loader2 className="submit-spinner" size={20} />
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="submit-arrow" size={20} />
              </>
            )}
          </span>
          <div className="submit-shine" />
        </button>
      </form>

      {/* ══════════════════════════════════════════════════════
          SÉPARATEUR
      ══════════════════════════════════════════════════════ */}
      <div className="divider-section">
        <div className="divider-line" />
        <span className="divider-text">ou connexion rapide</span>
        <div className="divider-line" />
      </div>

      {/* ══════════════════════════════════════════════════════
          COMPTES DÉMO
      ══════════════════════════════════════════════════════ */}
      <div className="demo-section">
        <p className="demo-section-title">Comptes de démonstration</p>
        <div className="demo-grid">
          {demoAccounts.map((demo) => (
            <button
              key={demo.role}
              type="button"
              onClick={() => handleDemoLogin(demo.role)}
              disabled={loading}
              className={`demo-card ${demo.color}`}
            >
              <div className="demo-card-content">
                <div className="demo-icon-wrapper">
                  {demo.icon}
                </div>
                <div className="demo-info">
                  <span className="demo-label">{demo.label}</span>
                  <span className="demo-description">{demo.description}</span>
                </div>
                <ArrowRight className="demo-arrow" size={16} />
              </div>
              <div className="demo-card-shine" />
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <div className="login-footer">
        <p className="footer-text">
          Pas encore de compte ?{' '}
          <Link to="/register" className="footer-link">
            Créer un compte gratuitement
            <ArrowRight className="footer-link-arrow" size={14} />
          </Link>
        </p>
        
        <div className="security-note">
          <Shield className="security-icon" size={14} />
          <span>Connexion sécurisée et cryptée</span>
        </div>
      </div>
    </div>
  );
};

export default Login;