import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Loader2, UserPlus, User, Mail, Phone, MapPin, 
  Lock, ArrowRight, Shield, Heart, CheckCircle2,
  Eye, EyeOff, Sparkles
} from 'lucide-react';
import { AuthService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import './register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
    nomComplet: '',
    role: UserRole.PATIENT,
    adresse: '',
    telephone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const dataToSubmit = { ...formData, role: UserRole.PATIENT as UserRole };
      const response = await AuthService.register(dataToSubmit);
      login(response);
      navigate('/patient');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      const form = document.querySelector('.register-form');
      form?.classList.add('shake-error');
      setTimeout(() => form?.classList.remove('shake-error'), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const strengthColor = (strength: number) => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#059669'];
    return colors[strength] || '#EF4444';
  };

  const strengthLabel = (strength: number) => {
    const labels = ['Très faible', 'Faible', 'Bon', 'Excellent'];
    return labels[strength - 1] || 'Très faible';
  };

  return (
    <div className="register-wrapper">
      {/* ══════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════ */}
      <div className="register-header">
        <div className="register-badge">
          <Sparkles className="badge-sparkle" size={14} />
          <span>Inscription gratuite</span>
        </div>
        
        <h1 className="register-title">
          Rejoignez MEDS <span className="hospital-emoji">🏥</span>
        </h1>
        
        <p className="register-subtitle">
          Créez votre compte patient et accédez à vos médicaments en quelques clics
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════
          INDICATEUR D'ÉTAPES
      ══════════════════════════════════════════════════════ */}
      <div className="steps-indicator">
        <div className={`step-dot ${step >= 1 ? 'step-active' : ''} ${step > 1 ? 'step-completed' : ''}`}>
          {step > 1 ? <CheckCircle2 size={14} /> : '1'}
        </div>
        <div className={`step-line ${step >= 2 ? 'step-line-active' : ''}`} />
        <div className={`step-dot ${step >= 2 ? 'step-active' : ''}`}>
          {step === 2 && !loading ? '2' : step > 2 ? <CheckCircle2 size={14} /> : '2'}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MESSAGE D'ERREUR
      ══════════════════════════════════════════════════════ */}
      {error && (
        <div className="error-container">
          <div className="error-card">
            <div className="error-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 5v4M9 12v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="error-message">{error}</p>
            <button onClick={() => setError('')} className="error-close">×</button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          FORMULAIRE EN 2 ÉTAPES
      ══════════════════════════════════════════════════════ */}
      <form onSubmit={handleRegister} className="register-form">
        {step === 1 && (
          <div className="form-step step-enter">
            <p className="step-title">Informations personnelles</p>
            
            {/* Nom complet */}
            <div className={`form-field ${focusedField === 'nomComplet' ? 'field-focused' : ''} ${formData.nomComplet ? 'field-filled' : ''}`}>
              <label className="field-label" htmlFor="nomComplet">
                <User className="label-icon" size={16} />
                Nom complet
              </label>
              <input
                type="text"
                id="nomComplet"
                required
                className="field-input"
                value={formData.nomComplet}
                onChange={handleChange}
                onFocus={() => setFocusedField('nomComplet')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ex: Aminata Sow"
              />
            </div>

            {/* Email & Téléphone */}
            <div className="form-row">
              <div className={`form-field ${focusedField === 'email' ? 'field-focused' : ''} ${formData.email ? 'field-filled' : ''}`}>
                <label className="field-label" htmlFor="email">
                  <Mail className="label-icon" size={16} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="field-input"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="aminata@email.com"
                />
              </div>
              
              <div className={`form-field ${focusedField === 'telephone' ? 'field-focused' : ''} ${formData.telephone ? 'field-filled' : ''}`}>
                <label className="field-label" htmlFor="telephone">
                  <Phone className="label-icon" size={16} />
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="telephone"
                  required
                  className="field-input"
                  value={formData.telephone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('telephone')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="+221 77 000 00 00"
                />
              </div>
            </div>

            {/* Adresse */}
            <div className={`form-field ${focusedField === 'adresse' ? 'field-focused' : ''} ${formData.adresse ? 'field-filled' : ''}`}>
              <label className="field-label" htmlFor="adresse">
                <MapPin className="label-icon" size={16} />
                Adresse de livraison
              </label>
              <input
                type="text"
                id="adresse"
                required
                className="field-input"
                value={formData.adresse}
                onChange={handleChange}
                onFocus={() => setFocusedField('adresse')}
                onBlur={() => setFocusedField(null)}
                placeholder="Dakar, Plateau, Rue 10"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step step-enter">
            <p className="step-title">Sécurisez votre compte</p>
            
            {/* Mot de passe */}
            <div className={`form-field ${focusedField === 'motDePasse' ? 'field-focused' : ''} ${formData.motDePasse ? 'field-filled' : ''}`}>
              <label className="field-label" htmlFor="motDePasse">
                <Lock className="label-icon" size={16} />
                Mot de passe
              </label>
              <div className="field-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="motDePasse"
                  required
                  className="field-input"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('motDePasse')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Créez un mot de passe sécurisé"
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
              
              {/* Indicateur de force */}
              {formData.motDePasse && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`strength-bar ${passwordStrength(formData.motDePasse) >= level ? 'bar-active' : ''}`}
                        style={{
                          backgroundColor: passwordStrength(formData.motDePasse) >= level 
                            ? strengthColor(passwordStrength(formData.motDePasse)) 
                            : 'transparent'
                        }}
                      />
                    ))}
                  </div>
                  <span 
                    className="strength-label"
                    style={{ color: strengthColor(passwordStrength(formData.motDePasse)) }}
                  >
                    {strengthLabel(passwordStrength(formData.motDePasse))}
                  </span>
                </div>
              )}
            </div>

            {/* Récapitulatif */}
            <div className="summary-card">
              <p className="summary-title">Récapitulatif</p>
              <div className="summary-items">
                <div className="summary-item">
                  <User size={14} />
                  <span>{formData.nomComplet || 'Non renseigné'}</span>
                </div>
                <div className="summary-item">
                  <Mail size={14} />
                  <span>{formData.email || 'Non renseigné'}</span>
                </div>
                <div className="summary-item">
                  <Phone size={14} />
                  <span>{formData.telephone || 'Non renseigné'}</span>
                </div>
                <div className="summary-item">
                  <MapPin size={14} />
                  <span>{formData.adresse || 'Non renseignée'}</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="modify-button"
              >
                Modifier
              </button>
            </div>

            {/* Mentions légales */}
            <div className="legal-notice">
              <Shield size={14} className="legal-icon" />
              <p className="legal-text">
                En vous inscrivant, vous acceptez nos{' '}
                <a href="/terms" className="legal-link">Conditions Générales</a>
                {' '}et notre{' '}
                <a href="/privacy" className="legal-link">Politique de Confidentialité</a>
              </p>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="form-actions">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="back-button"
              disabled={loading}
            >
              ← Retour
            </button>
          )}
          
          <button 
            type="submit" 
            disabled={loading} 
            className={`submit-button ${loading ? 'submit-loading' : ''}`}
          >
            <span className="submit-content">
              {loading ? (
                <>
                  <Loader2 className="submit-spinner" size={20} />
                  <span>Création du compte...</span>
                </>
              ) : step === 1 ? (
                <>
                  <span>Continuer</span>
                  <ArrowRight size={20} className="submit-arrow" />
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Créer mon compte</span>
                  <Heart size={16} className="submit-heart" />
                </>
              )}
            </span>
            <div className="submit-shine" />
          </button>
        </div>
      </form>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <div className="register-footer">
        <p className="footer-text">
          Déjà un compte ?{' '}
          <Link to="/login" className="footer-link">
            Se connecter
            <ArrowRight size={14} className="footer-link-arrow" />
          </Link>
        </p>
        
        <div className="benefits-list">
          <div className="benefit-item">
            <CheckCircle2 size={14} className="benefit-check" />
            <span>Inscription gratuite</span>
          </div>
          <div className="benefit-item">
            <CheckCircle2 size={14} className="benefit-check" />
            <span>Sans engagement</span>
          </div>
          <div className="benefit-item">
            <CheckCircle2 size={14} className="benefit-check" />
            <span>Données sécurisées</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;