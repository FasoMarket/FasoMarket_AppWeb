import { Store, Sparkles, ArrowRight, Package, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

export default function NoShopState({ variant = 'full', onCreateClick }) {
  const features = [
    { icon: Package, title: 'Catalogue illimité', desc: 'Ajoutez autant de produits que vous voulez' },
    { icon: Users, title: 'Visibilité maximale', desc: 'Des milliers de clients potentiels' },
    { icon: TrendingUp, title: 'Analytiques avancées', desc: 'Suivez vos performances en temps réel' },
  ];

  // Version compacte pour la page produits
  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-br from-primary/5 via-white to-amber-50/50 rounded-[2.5rem] border border-primary/10 p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center mx-auto mb-6 relative">
            <Store className="w-10 h-10 text-primary" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
            Créez d'abord votre boutique
          </h2>
          <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
            Pour ajouter des produits, vous devez d'abord configurer votre boutique. 
            C'est rapide et gratuit !
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/vendor/store"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25"
            >
              <Store size={20} />
              Créer ma boutique
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle size={14} className="text-emerald-500" /> Gratuit
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle size={14} className="text-emerald-500" /> 2 minutes
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle size={14} className="text-emerald-500" /> Sans engagement
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Version complète pour la page boutique
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            Bienvenue sur FasoMarket
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
            Lancez votre boutique<br />
            <span className="text-primary">en quelques minutes</span>
          </h1>
          
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Rejoignez des centaines de vendeurs qui font confiance à FasoMarket 
            pour développer leur activité en ligne.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                idx === 0 ? "bg-primary/10 text-primary" : 
                idx === 1 ? "bg-amber-100 text-amber-600" : 
                "bg-emerald-100 text-emerald-600"
              )}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-[1.5rem] bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Store className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              Prêt à commencer ?
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Configurez votre boutique maintenant et commencez à vendre vos produits 
              à des milliers de clients au Burkina Faso.
            </p>

            {onCreateClick ? (
              <button
                onClick={onCreateClick}
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40"
              >
                <Store size={24} />
                Créer ma boutique
                <ArrowRight size={20} />
              </button>
            ) : (
              <div 
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg cursor-default shadow-2xl shadow-primary/40"
              >
                <Store size={24} />
                Remplissez le formulaire ci-dessous
                <ArrowRight size={20} />
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> 
                100% Gratuit
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> 
                Commission 5% seulement
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> 
                Support 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
