import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye } from 'lucide-react';
import loginBg from '../../assets/login-bg.png';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#17cf54] rounded-lg flex items-center justify-center p-1.5">
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">FasoMarket</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Accueil</Link>
          <Link to="/boutique" className="text-sm font-medium text-gray-600 hover:text-gray-900">Boutique</Link>
          <Link to="/artisanat" className="text-sm font-medium text-gray-600 hover:text-gray-900">Artisanat</Link>
          <Link to="/register" className="px-6 py-2 bg-[#17cf54] text-white rounded-lg text-sm font-bold hover:bg-[#12a643] transition-colors">
            S'inscrire
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-[#f8fafc]">
        <div className="w-full max-w-6xl flex bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">

          {/* Left Side: Image with Text Overlay */}
          <div className="hidden lg:block w-1/2 relative">
            <img
              src={loginBg}
              alt="Artisan du Burkina"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12 text-white">
              <h2 className="text-4xl font-extrabold mb-4">L'artisanat du Burkina</h2>
              <p className="text-lg opacity-90 leading-relaxed max-w-sm font-medium">
                Connectez-vous pour découvrir les trésors du Pays des Hommes Intègres et soutenir nos artisans locaux.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto space-y-8">
              <div className="space-y-3">
                <h2 className="text-4xl font-extrabold text-[#111827]">Connexion</h2>
                <p className="text-gray-500 text-lg font-medium">Ravie de vous revoir sur FasoMarket</p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/account'); }}>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">E-mail</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full px-4 py-4 bg-[#f9fafb] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17cf54] focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-700">Mot de passe</label>
                    <Link to="/forgot-password" strokeWidth={2.5} className="text-xs font-bold text-[#17cf54] hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-4 bg-[#f9fafb] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#17cf54] focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                    <Eye className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" size={20} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#17cf54] text-white rounded-xl font-bold text-lg hover:bg-[#12a643] transition-all shadow-lg shadow-[#17cf54]/20 hover:scale-[1.01] active:scale-[0.99]"
                >
                  Se connecter
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">OU CONTINUER AVEC</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm text-gray-700 shadow-sm"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm text-gray-700 shadow-sm"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" alt="Facebook" className="w-5 h-5" />
                    Facebook
                  </button>
                </div>

                <p className="text-center text-gray-600 font-medium">
                  Nouveau sur FasoMarket ?{' '}
                  <Link to="/register" className="text-[#17cf54] font-bold hover:underline">Créer un compte</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-10 py-8 text-center text-xs text-gray-400 font-medium">
        <p>© 2024 FasoMarket - Fait avec passion pour le Burkina Faso</p>
      </footer>
    </div>
  );
}
