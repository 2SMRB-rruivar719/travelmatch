import React, { useState } from 'react';
import { Button } from './Button';
import { loginUser } from '../services/api';
import { LanguageCode, UserProfile } from '../types';
import { ChevronLeft } from 'lucide-react';
import { useToast } from './ToastProvider';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToLanding: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[FLOW] Click en Iniciar sesión', { email });
    setError(null);

    if (!email || !password) {
      const msg = 'Debes introducir email y contraseña.';
      console.warn('[VALIDATION] Login -', msg);
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    if (!email.includes('@')) {
      const msg = 'El email debe contener "@".';
      console.warn('[VALIDATION] Login -', msg);
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    try {
      setLoading(true);
      showToast('Iniciando sesión...', 'info');
      console.log('[API] Enviando petición de login a backend');
      const user = await loginUser(email, password);
      console.log('[API] Login correcto, usuario recibido', user);
      showToast('Sesión iniciada correctamente.', 'success');
      onLoginSuccess(user);
    } catch (err: any) {
      let msg = err?.message || 'Credenciales incorrectas o error al iniciar sesión.';
      if (typeof msg === 'string' && msg.toLowerCase().includes('failed to fetch')) {
        msg = 'Error de conexión al iniciar sesión. Revisa tu conexión o inténtalo de nuevo.';
      }
      console.error('[ERROR] Error en login', err);
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 max-w-md mx-auto animate-fade-in bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl mt-10 mb-20 border border-white">
      <button
        onClick={onBackToLanding}
        className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-travel-primary text-left"
      >
        <ChevronLeft size={18} />
        <span>Volver</span>
      </button>
      <h2 className="text-2xl font-bold text-travel-dark text-center mb-6">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Contraseña</label>
          <input
            type="password"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl p-2">
            {error}
          </p>
        )}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </Button>
      </form>
    </div>
  );
};

