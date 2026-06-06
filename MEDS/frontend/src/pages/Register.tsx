import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, UserPlus } from 'lucide-react';
import { AuthService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import styles from './Register.module.css';
import { UserRole } from '../types';

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
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Force le rôle PATIENT pour l'inscription publique
      const dataToSubmit = { ...formData, role: UserRole.PATIENT as UserRole };
      const response = await AuthService.register(dataToSubmit);
      login(response);
      navigate('/patient');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className={styles.registerContainer}>
      <div className="mb-8">
        <h2 className={styles.title}>Rejoignez MEDS 🏥</h2>
        <p className={styles.subtitle}>Créez votre compte patient en quelques secondes</p>
      </div>

      {error && (
        <div className={styles.errorBadge}>
          {error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="nomComplet">Nom complet</label>
          <input type="text" id="nomComplet" required className={styles.input} value={formData.nomComplet} onChange={handleChange} placeholder="Jean Dupont" />
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input type="email" id="email" required className={styles.input} value={formData.email} onChange={handleChange} placeholder="jean@email.com" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="telephone">Téléphone</label>
            <input type="tel" id="telephone" required className={styles.input} value={formData.telephone} onChange={handleChange} placeholder="+221 ..." />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="adresse">Adresse</label>
          <input type="text" id="adresse" required className={styles.input} value={formData.adresse} onChange={handleChange} placeholder="Dakar, Plateau..." />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="motDePasse">Mot de passe</label>
          <input type="password" id="motDePasse" required className={styles.input} value={formData.motDePasse} onChange={handleChange} placeholder="••••••••" />
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Inscription...
            </>
          ) : (
            <>
              <UserPlus size={20} />
              S'inscrire comme Patient
            </>
          )}
        </button>
      </form>

      <p className={styles.footerText}>
        Déjà un compte ?{' '}
        <Link to="/login" className={styles.link}>
          Se connecter
        </Link>
      </p>
    </div>
  );
};

export default Register;
