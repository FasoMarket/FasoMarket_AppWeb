import { Link } from 'react-router-dom';
import {
    Search,
    ShoppingCart,
    User,
    ChevronRight,
    Truck,
    ShieldCheck,
    CreditCard,
    Palette,
    Utensils,
    Shirt,
    Cpu
} from 'lucide-react';

// Assets
import heroHome from '../assets/hero-home.png';
import pagneFasso from '../assets/pagne-fasso.png';
import beurreKarite from '../assets/beurre-karite.png';
import bronzeArt from '../assets/bronze-art.png';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="w-10 h-10 bg-[#17cf54] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#17cf54]/20">
                                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-gray-900 hidden sm:block">FasoMarket</span>
                        </div>

                        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-600">
                            <Link to="/" className="text-gray-900">Boutiques</Link>
                            <Link to="/vendor/register" className="hover:text-gray-900 transition-colors">Devenir Vendeur</Link>
                        </nav>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher des produits, artisans, boutiques..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:border-transparent outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative p-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <ShoppingCart size={22} />
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#17cf54] text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
                            </Link>
                            <Link
                                to="/login"
                                className="px-6 py-3 bg-[#17cf54] text-white rounded-2xl text-sm font-bold hover:bg-[#12a643] transition-all shadow-lg shadow-[#17cf54]/20 active:scale-95"
                            >
                                Connexion
                            </Link>
                            <Link to="/login" className="p-1 bg-gray-100 rounded-full border-2 border-white shadow-sm overflow-hidden hidden sm:block">
                                <div className="w-8 h-8 bg-gray-300 flex items-center justify-center">
                                    <User size={20} className="text-gray-500" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20">

                {/* Hero Section */}
                <section className="bg-[#e8faee] rounded-[3rem] overflow-hidden flex flex-col lg:flex-row relative">
                    <div className="flex-1 p-12 lg:p-20 space-y-8 self-center relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
                            <span className="flex w-2 h-2 rounded-full bg-[#17cf54] animate-pulse"></span>
                            <span className="text-xs font-bold text-[#12a643] uppercase tracking-wider">100% Artisanal & Local</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1]">
                            L'excellence <br />
                            <span className="text-[#17cf54]">Burkinabè</span> à <br />
                            votre porte.
                        </h1>
                        <p className="text-lg text-gray-600 font-medium max-w-sm leading-relaxed">
                            Soutenez l'économie locale. Découvrez une sélection unique d'artisanat, de mode Faso Danfani et de produits du terroir soigneusement sélectionnés.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/products" className="px-8 py-4 bg-[#17cf54] text-white rounded-2xl font-bold hover:bg-[#12a643] transition-all shadow-xl shadow-[#17cf54]/20 hover:-translate-y-1 inline-block">
                                Explorer le Marché
                            </Link>
                            <button className="px-8 py-4 bg-white text-gray-900 border border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-lg shadow-gray-200/50">
                                En savoir plus
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 h-[400px] lg:h-auto overflow-hidden">
                        <img
                            src={heroHome}
                            alt="Artisane Burkinabè"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </section>

                {/* Categories Section */}
                <section className="space-y-8">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-gray-900">Explorer par Catégories</h2>
                            <p className="text-gray-500 font-medium tracking-tight">Trouvez exactement ce que vous cherchez parmi nos univers</p>
                        </div>
                        <Link to="/categories" className="flex items-center gap-2 text-[#17cf54] font-black hover:translate-x-1 transition-transform">
                            Voir tout <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Artisanat', icon: Palette, color: 'bg-green-50', iconColor: 'text-[#17cf54]', count: '1.2k+ Produits' },
                            { name: 'Aliments', icon: Utensils, color: 'bg-orange-50', iconColor: 'text-orange-500', count: '500 Produits' },
                            { name: 'Mode', icon: Shirt, color: 'bg-blue-50', iconColor: 'text-blue-500', count: 'Faso Danfani' },
                            { name: 'Électronique', icon: Cpu, color: 'bg-purple-50', iconColor: 'text-purple-500', count: 'High-Tech' }
                        ].map((cat) => (
                            <div key={cat.name} className={`${cat.color} p-8 rounded-[2.5rem] border border-white space-y-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer group text-center`}>
                                <div className={`w-14 h-14 mx-auto ${cat.iconColor} bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                    {(() => {
                                        const Icon = cat.icon;
                                        return <Icon size={28} />;
                                    })()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold mt-1 tracking-wider uppercase">{cat.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="space-y-8">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-gray-900">Produits Vedettes</h2>
                            <p className="text-gray-500 font-medium tracking-tight">Les pépites du moment sélectionnées pour vous</p>
                        </div>
                        <Link to="/products" className="flex items-center gap-2 text-[#17cf54] font-black hover:translate-x-1 transition-transform">
                            Voir tout <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { id: 1, name: 'Pagne Faso Danfani', cat: 'Mode & Textile', price: '15 000 FCFA', img: pagneFasso, rating: '4.9 (124)' },
                            { id: 2, name: 'Beurre de Karité Pur', cat: 'Cosmétique', price: '3 500 FCFA', img: beurreKarite, rating: '4.8 (87)', badge: 'BIO' },
                            { id: 3, name: 'Cavalier en Bronze', cat: 'Artisanat d\'Art', price: '25 000 FCFA', img: bronzeArt, rating: '5.0 (42)' },
                            { id: 4, name: 'Sac en Cuir Artisanal', cat: 'Maroquinerie', price: '9 500 FCFA', img: pagneFasso, rating: '4.7 (56)', badge: 'PROMO' } // Using placeholder img for sac
                        ].map((item) => (
                            <Link to={`/product/${item.id}`} key={item.id} className="group cursor-pointer space-y-4 block">
                                <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 relative">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    {item.badge && (
                                        <div className="absolute top-4 left-4 bg-[#17cf54] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            {item.badge}
                                        </div>
                                    )}
                                    <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl text-[#17cf54] shadow-lg hover:bg-[#17cf54] hover:text-white transition-all">
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#17cf54] uppercase tracking-widest">{item.cat}</p>
                                    <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                                    <div className="flex items-center gap-1 mt-1 text-xs text-yellow-500 font-bold">
                                        <span>★</span>
                                        <span className="text-gray-400">{item.rating}</span>
                                    </div>
                                    <p className="text-lg font-black text-gray-900 mt-2">{item.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Popular Stores */}
                <section className="bg-[#e8faee]/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20 rounded-[4rem]">
                    <div className="space-y-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-gray-900">Boutiques Populaires</h2>
                            <p className="text-gray-500 font-medium tracking-tight">Faites confiance à nos meilleurs vendeurs certifiés</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {[
                                { name: 'Faso Tissus & Fils', rating: '4.9 (350+ ventes)', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop' },
                                { name: 'L\'Atelier du Bronze', rating: '5.0 (112 avis)', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
                                { name: 'Saveurs du Terroir', rating: '4.8 (210 ventes)', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' }
                            ].map((store) => (
                                <div key={store.name} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <img src={store.img} alt={store.name} className="w-14 h-14 rounded-2xl object-cover" />
                                        <div>
                                            <h3 className="font-bold text-gray-900">{store.name}</h3>
                                            <div className="flex items-center gap-1 text-[#17cf54]">
                                                <div className="flex text-yellow-500">★★★★★</div>
                                                <span className="text-[10px] font-bold text-gray-400 ml-1">{store.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="aspect-square rounded-xl bg-gray-100"></div>
                                        <div className="aspect-square rounded-xl bg-gray-100"></div>
                                        <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">+12</div>
                                    </div>
                                    <Link to="/shop/1" className="w-full py-3 bg-[#e8faee] text-[#17cf54] font-bold rounded-2xl hover:bg-[#17cf54] hover:text-white transition-all text-center block">
                                        Visiter la boutique
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Trust Banner */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-10">
                    {[
                        { icon: Truck, title: 'Livraison Rapide', desc: 'Livraison partout au Burkina Faso et à l\'international en un temps record.' },
                        { icon: ShieldCheck, title: 'Qualité Garantie', desc: 'Chaque produit est vérifié pour garantir son authenticité et sa qualité artisanale.' },
                        { icon: CreditCard, title: 'Paiement Sécurisé', desc: 'Payez en toute sécurité via Mobile Money (Orange, Moov) et carte bancaire.' }
                    ].map((feature) => (
                        <div key={feature.title} className="text-center space-y-4 px-6">
                            <div className="w-16 h-16 mx-auto bg-[#e8faee] text-[#17cf54] rounded-full flex items-center justify-center shadow-inner">
                                {(() => {
                                    const Icon = feature.icon;
                                    return <Icon size={28} />;
                                })()}
                            </div>
                            <h3 className="text-xl font-black text-gray-900">{feature.title}</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </section>

                {/* Creator CTA */}
                <section className="bg-gradient-to-br from-[#111827] to-[#1e293b] rounded-[3rem] p-12 lg:p-24 text-center space-y-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#17cf54]/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>

                    <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                        <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">Vous êtes un créateur ?</h2>
                        <p className="text-lg text-gray-400 font-medium">Rejoignez des milliers d'artisans burkinabè et commencez à vendre vos produits à travers le monde dès aujourd'hui.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 relative z-10">
                        <Link to="/vendor/register" className="px-10 py-5 bg-[#17cf54] text-white rounded-2xl font-black hover:bg-[#12a643] transition-all shadow-2xl shadow-[#17cf54]/30 active:scale-95">
                            Ouvrir ma boutique
                        </Link>
                        <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black hover:bg-white/20 transition-all">
                            En savoir plus
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-gray-50">
                        <div className="col-span-2 space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#17cf54] rounded-lg"></div>
                                <span className="text-xl font-black text-gray-900">FasoMarket</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs">
                                La première marketplace dédiée à la promotion du savoir-faire Burkinabè. Connectons les talents locaux aux acheteurs du monde entier.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#17cf54] cursor-pointer">f</div>
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#17cf54] cursor-pointer">it</div>
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#17cf54] cursor-pointer">in</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-gray-900">Acheter</h4>
                            <nav className="flex flex-col gap-4 text-sm text-gray-500 font-medium">
                                <Link to="/" className="hover:text-[#17cf54]">Toutes les catégories</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Boutiques certifiées</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Produits vedettes</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Livraison & Tarifs</Link>
                            </nav>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-gray-900">Vendre</h4>
                            <nav className="flex flex-col gap-4 text-sm text-gray-500 font-medium">
                                <Link to="/vendor/register" className="hover:text-[#17cf54]">Ouvrir une boutique</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Guide du vendeur</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Conditions de vente</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Commissions & Frais</Link>
                            </nav>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-gray-900">Aide</h4>
                            <nav className="flex flex-col gap-4 text-sm text-gray-500 font-medium">
                                <Link to="/" className="hover:text-[#17cf54]">Support Client</Link>
                                <Link to="/" className="hover:text-[#17cf54]">FAQ</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Contactez-nous</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Confidentialité</Link>
                            </nav>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
                        <p>© 2024 FasoMarket - Ensemble valorisons notre identité & nos talents.</p>
                        <div className="flex gap-4">
                            <span>Français (BF)</span>
                            <span>FCFA (CFA)</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
