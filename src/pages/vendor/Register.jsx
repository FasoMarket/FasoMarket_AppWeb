import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Store,
  Globe
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here
    navigate('/vendor/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center max-w-[1400px] w-full mx-auto bg-white/50 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#17cf54] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#17cf54]/20">
            <Store size={22} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">FasoMarket <span className="text-[#17cf54]">Vendeur</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-sm font-bold text-gray-600 hover:text-gray-900">
            Aide & Support
          </button>
          <Link to="/vendor/login" className="bg-[#e8faee] text-[#17cf54] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#d1f5db] transition-colors">
            Se connecter
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="max-w-[1200px] w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 flex flex-col lg:flex-row overflow-hidden min-h-[750px] border border-gray-100">

          {/* Left Section - Green Branding */}
          <div className="lg:w-[45%] bg-[#17cf54] p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden text-white">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/5 rounded-full blur-3xl -ml-40 -mb-40"></div>

            <div className="relative z-10 space-y-12">
              <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Boostez votre visibilité locale avec FasoMarket
              </h1>

              <ul className="space-y-6">
                {[
                  'Commission réduite sur les ventes',
                  'Paiements sécurisés via Mobile Money',
                  'Gestion simplifiée des stocks'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg font-bold">
                    <CheckCircle2 size={24} className="text-white shrink-0" />
                    <span className="opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonial */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] space-y-5">
              <p className="italic text-lg font-medium leading-relaxed text-white/95">
                "Grâce à FasoMarket, mon chiffre d'affaires a augmenté de 40% en seulement trois mois. L'interface est intuitive et le support est réactif."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-1 h-8 bg-white/30 rounded-full"></div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
                  — ALIMATOU S., ARTISAN À OUAGADOUGOU
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="lg:w-[55%] p-10 lg:p-16 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Créer votre boutique</h2>
                <p className="text-gray-400 font-medium text-sm leading-relaxed">Remplissez le formulaire ci-dessous pour commencer l'aventure.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Nom</label>
                    <input
                      type="text"
                      placeholder="Ex: Traoré"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Prénom</label>
                    <input
                      type="text"
                      placeholder="Ex: Moussa"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Nom de la boutique</label>
                    <input
                      type="text"
                      placeholder="Ex: Faso Épicerie"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Type de produits</label>
                    <div className="relative">
                      <select className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-500 appearance-none cursor-pointer">
                        <option>Sélectionnez une catégorie</option>
                        <option>Artisanat d'Art</option>
                        <option>Mode & Textile</option>
                        <option>Alimentation & Terroir</option>
                        <option>Cosmétique & Beauté</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ArrowRight size={18} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Numéro de téléphone</label>
                    <input
                      type="tel"
                      placeholder="+226 -- -- -- --"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                    <input
                      type="email"
                      placeholder="contact@maboutique"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Mot de passe</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Confirmation</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer group pt-2">
                  <div className="relative mt-1">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-[#17cf54] focus:ring-[#17cf54] cursor-pointer" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 leading-relaxed group-hover:text-gray-900 transition-colors">
                    En créant ma boutique, j'accepte les <Link to="#" className="text-[#17cf54] font-black hover:underline">Conditions Générales de Vente</Link> et la <Link to="#" className="text-[#17cf54] font-black hover:underline">Politique de Confidentialité</Link> de FasoMarket.
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full py-4.5 bg-[#17cf54] text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-[#12a643] transition-all shadow-xl shadow-[#17cf54]/20 active:scale-95 group mt-4"
                >
                  Créer ma boutique
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="pt-2 text-center">
                <p className="font-bold text-sm text-gray-500">
                  Déjà vendeur ? <Link to="/vendor/login" className="text-[#17cf54] hover:underline ml-1">Connectez-vous ici</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 max-w-[1400px] w-full mx-auto border-t border-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">© 2024 FasoMarket. Tous droits réservés.</p>
          <div className="flex gap-10">
            {['Aide', 'Conditions', 'Vie privée'].map((item) => (
              <Link key={item} to="#" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#17cf54] transition-colors">{item}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
            <Globe size={16} />
            <span>Français (Burkina Faso)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
