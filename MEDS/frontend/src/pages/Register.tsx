import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Store, Truck } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-dark mb-2">Rejoignez MEDS</h2>
        <p className="text-gray-500">Créez votre compte en quelques secondes.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        {/* Role Selector Grid */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Quel est votre profil ?</label>
          <div className="grid grid-cols-3 gap-3">
            <label className={`cursor-pointer flex flex-col items-center p-3 rounded-xl border-2 transition-all ${role === 'PATIENT' ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}>
              <input type="radio" name="role" value="PATIENT" checked={role === 'PATIENT'} onChange={(e) => setRole(e.target.value)} className="hidden" />
              <User size={24} className="mb-1" />
              <span className="text-xs font-bold">Patient</span>
            </label>
            <label className={`cursor-pointer flex flex-col items-center p-3 rounded-xl border-2 transition-all ${role === 'PHARMACIE' ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}>
              <input type="radio" name="role" value="PHARMACIE" checked={role === 'PHARMACIE'} onChange={(e) => setRole(e.target.value)} className="hidden" />
              <Store size={24} className="mb-1" />
              <span className="text-xs font-bold">Pharmacie</span>
            </label>
            <label className={`cursor-pointer flex flex-col items-center p-3 rounded-xl border-2 transition-all ${role === 'LIVREUR' ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}>
              <input type="radio" name="role" value="LIVREUR" checked={role === 'LIVREUR'} onChange={(e) => setRole(e.target.value)} className="hidden" />
              <Truck size={24} className="mb-1" />
              <span className="text-xs font-bold">Livreur</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-dark text-base transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-dark text-base transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-400 mt-2">Doit contenir au moins 8 caractères.</p>
        </div>

        <button type="submit" className="w-full btn btn-primary mt-6" disabled={loading}>
          {loading ? 'Création du compte...' : 'Créer mon compte'}
        </button>
      </form>
      
      <div className="mt-8 text-center text-gray-500">
        Vous avez déjà un compte ?{' '}
        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
          Connectez-vous
        </Link>
      </div>
    </div>
  );
};

export default Register;
