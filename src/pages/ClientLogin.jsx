import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { getAdminUrl } from '../config/urls';
import loginBg from '../assets/login-bg.png';

export default function ClientLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userData = await login(email, password);

      try { await cartService.syncCart(); } catch (e) {}

      // Redirection selon le rôle
      const role = userData.role;
      if (role === 'admin') {
        window.location.href = getAdminUrl();
      }
      else if (role === 'vendor') {
        // Si le vendor n'est pas approuvé, il sera redirigé par RoleBasedLayout
        navigate('/vendor');
      }
      else navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center max-w-[1400px] w-full mx-auto bg-white/50 backdrop-blur-sm z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#17cf54] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#17cf54]/20">
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">FasoMarket</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/vendor" className="text-sm font-bold text-gray-600 hover:text-[#17cf54]">
            Espace Vendeur
          </Link>
          <Link to="/register" className="bg-[#e8faee] text-[#17cf54] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#d1f5db] transition-colors">
            S'inscrire
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#f8fafc]">
        <div className="max-w-[1100px] w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 flex flex-col lg:row overflow-hidden min-h-[600px] border border-gray-100 flex-row">
          
          {/* Left Side: Image with Text Overlay */}
          <div className="hidden lg:block w-1/2 relative">
            <img
              src={loginBg}
              alt="Artisanat Burkinabè"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex flex-col justify-end p-12 text-white">
              <div className="w-16 h-16 bg-[#17cf54] rounded-2xl flex items-center justify-center shadow-lg shadow-[#17cf54]/20 mb-8">
                <ShoppingBag size={32} className="text-white" />
              </div>
              <h2 className="text-4xl font-black mb-4 leading-tight">Retrouvez vos <br /><span className="text-[#17cf54]">trésors locaux</span></h2>
              <p className="text-lg opacity-90 leading-relaxed max-w-sm font-medium text-gray-200">
                Connectez-vous pour suivre vos commandes et soutenir les artisans du Burkina Faso.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Connexion</h2>
                <p className="text-gray-400 font-medium">Bon retour parmi nous !</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 text-sm font-bold text-gray-700">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-gray-300 font-bold text-gray-700 disabled:opacity-50"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center mr-1">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 text-sm font-bold text-gray-700">Mot de passe</label>
                    <Link to="#" className="text-xs font-bold text-[#17cf54] hover:underline">
                      Oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-gray-300 font-bold text-gray-700 disabled:opacity-50"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 bg-[#17cf54] text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-[#12a643] transition-all shadow-xl shadow-[#17cf54]/20 active:scale-95 group mt-4 h-[60px] disabled:bg-gray-400 disabled:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    'Se connecter'
                  )}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                    <span className="bg-white px-4 text-gray-400">Ou continuer avec</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 py-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700 shadow-sm"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 py-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700 shadow-sm"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" alt="Facebook" className="w-5 h-5" />
                    Facebook
                  </button>
                </div>

                <p className="text-center text-sm font-bold text-gray-500">
                  Nouveau sur FasoMarket ?{' '}
                  <Link to="/register" className="text-[#17cf54] hover:underline ml-1">Créer un compte</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs font-black text-gray-400 uppercase tracking-widest border-t border-gray-50 bg-white">
        <p>© 2024 FasoMarket - Ensemble valorisons notre identité</p>
      </footer>
    </div>
  );
}
