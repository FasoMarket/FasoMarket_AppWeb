import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Zap,
  Globe,
  Shield,
  BarChart3
} from 'lucide-react';

export default function VendorLanding() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="py-20 space-y-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-tight mb-6">
              Vendez vos créations au <span className="text-[#17cf54]">Burkina Faso</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium mb-8">
              Rejoignez des milliers d'artisans et vendeurs qui font prospérer leur business sur FasoMarket. Zéro frais de démarrage, 100% de contrôle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register-vendor" className="px-8 py-4 bg-[#17cf54] text-white rounded-2xl font-black text-lg hover:bg-[#12a643] transition-all shadow-xl shadow-[#17cf54]/20 flex items-center justify-center gap-2 group">
                Commencer à vendre
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/products" className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                Voir les produits
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-gray-100">
          <div className="text-center">
            <div className="text-4xl font-black text-[#17cf54] mb-2">5,000+</div>
            <p className="text-gray-600 font-medium">Vendeurs actifs</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-[#17cf54] mb-2">50,000+</div>
            <p className="text-gray-600 font-medium">Produits vendus</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-[#17cf54] mb-2">100%</div>
            <p className="text-gray-600 font-medium">Artisanat local</p>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 space-y-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-black text-gray-900">Pourquoi vendre sur FasoMarket?</h2>
            <p className="text-xl text-gray-600 font-medium">Tout ce dont vous avez besoin pour réussir</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: 'Portée nationale',
                desc: 'Vendez à des clients partout au Burkina Faso et à l\'international'
              },
              {
                icon: TrendingUp,
                title: 'Croissance garantie',
                desc: 'Outils de marketing et d\'analytiques pour booster vos ventes'
              },
              {
                icon: Shield,
                title: 'Sécurité totale',
                desc: 'Paiements sécurisés et protection des vendeurs'
              },
              {
                icon: Users,
                title: 'Support 24/7',
                desc: 'Équipe dédiée pour vous aider à chaque étape'
              },
              {
                icon: Zap,
                title: 'Mise en ligne rapide',
                desc: 'Publiez vos produits en quelques minutes'
              },
              {
                icon: BarChart3,
                title: 'Analytiques détaillées',
                desc: 'Suivez vos ventes et optimisez votre stratégie'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#17cf54] hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-[#17cf54]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-[#17cf54]" size={24} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 font-medium">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Process */}
        <section className="py-20 space-y-12">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-black text-gray-900">Comment ça marche?</h2>
            <p className="text-xl text-gray-600 font-medium">4 étapes simples pour commencer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'S\'inscrire', desc: 'Créez votre compte vendeur en 2 minutes' },
              { step: 2, title: 'Attendre approbation', desc: 'Admin valide votre compte (24-48h)' },
              { step: 3, title: 'Ajouter produits', desc: 'Publiez vos créations avec photos' },
              { step: 4, title: 'Commencer à vendre', desc: 'Recevez les commandes et gagnez' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white p-6 rounded-2xl border-2 border-[#17cf54] text-center">
                  <div className="w-12 h-12 bg-[#17cf54] text-white rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 font-medium">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-[#17cf54]" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 space-y-12 border-t border-gray-100">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-black text-gray-900">Tarification simple</h2>
            <p className="text-xl text-gray-600 font-medium">Pas de frais cachés, juste une commission juste</p>
          </div>

          <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#17cf54]/10 to-[#17cf54]/5 p-12 rounded-3xl border border-[#17cf54]/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-[#17cf54]/20">
                <span className="text-lg font-bold text-gray-900">Commission par vente</span>
                <span className="text-3xl font-black text-[#17cf54]">5%</span>
              </div>
              <div className="flex items-center justify-between pb-6 border-b border-[#17cf54]/20">
                <span className="text-lg font-bold text-gray-900">Frais de publication</span>
                <span className="text-3xl font-black text-[#17cf54]">0 FCFA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Frais de retrait</span>
                <span className="text-3xl font-black text-[#17cf54]">0 FCFA</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center space-y-8">
          <h2 className="text-4xl font-black text-gray-900">Prêt à commencer?</h2>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Rejoignez la communauté FasoMarket et transformez votre passion en revenu
          </p>
          <Link to="/register-vendor" className="inline-flex px-10 py-5 bg-[#17cf54] text-white rounded-2xl font-black text-lg hover:bg-[#12a643] transition-all shadow-xl shadow-[#17cf54]/20 gap-2 group">
            S'inscrire maintenant
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 font-medium">
            © 2024 FasoMarket - Ensemble valorisons notre identité & nos talents
          </p>
        </div>
      </footer>
    </div>
  );
}
