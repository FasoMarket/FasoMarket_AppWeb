import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    ShoppingCart,
    ChevronRight,
    Grid2X2,
    List,
    Star
} from 'lucide-react';

// Assets (reusing existing)
import pagneFasso from '../assets/pagne-fasso.png';
import beurreKarite from '../assets/beurre-karite.png';
import bronzeArt from '../assets/bronze-art.png';

const products = [
    { id: 1, name: 'Pagne Faso Danfani Premium', cat: 'Mode & Textile', price: '15 000 FCFA', img: pagneFasso, rating: '4.9', reviews: 124, badge: 'Vogue' },
    { id: 2, name: 'Beurre de Karité Pur 500g', cat: 'Cosmétique', price: '3 500 FCFA', img: beurreKarite, rating: '4.8', reviews: 87, badge: 'Naturel' },
    { id: 3, name: 'Cavalier Guerrier Bronze', cat: 'Artisanat d\'Art', price: '25 000 FCFA', img: bronzeArt, rating: '5.0', reviews: 42 },
    { id: 4, name: 'Sac à Main Cuir & Danfani', cat: 'Maroquinerie', price: '9 500 FCFA', img: pagneFasso, rating: '4.7', reviews: 56, badge: 'Nouveau' },
    { id: 5, name: 'Tunique Homme Moderne', cat: 'Mode & Textile', price: '12 000 FCFA', img: pagneFasso, rating: '4.6', reviews: 33 },
    { id: 6, name: 'Savon Artisanal Karité', cat: 'Cosmétique', price: '1 200 FCFA', img: beurreKarite, rating: '4.9', reviews: 95 },
    { id: 7, name: 'Statuette Bronze Maternité', cat: 'Artisanat d\'Art', price: '18 000 FCFA', img: bronzeArt, rating: '4.8', reviews: 19 },
    { id: 8, name: 'Sandales en Cuir Sahéliennes', cat: 'Maroquinerie', price: '5 500 FCFA', img: pagneFasso, rating: '4.5', reviews: 67 },
];

export default function Products() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 gap-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#17cf54] rounded-xl flex items-center justify-center p-2">
                                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-gray-900 hidden sm:block">FasoMarket</span>
                        </Link>

                        <div className="flex-1 max-w-xl relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher un produit local..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:border-transparent outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative p-2.5 text-gray-600 hover:bg-gray-50 rounded-xl">
                                <ShoppingCart size={22} />
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#17cf54] text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-64 space-y-10">
                        <div className="space-y-6">
                            <h4 className="font-black text-xs uppercase tracking-widest text-[#17cf54]">Catégories</h4>
                            <div className="space-y-3">
                                {['Artisanat', 'Mode & Textile', 'Cosmétique', 'Bijoux', 'Décoration'].map((cat) => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-200 text-[#17cf54] focus:ring-[#17cf54]" />
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors uppercase tracking-tight">{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-xs uppercase tracking-widest text-[#17cf54]">Prix Range</h4>
                            <div className="space-y-4">
                                <input type="range" className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#17cf54]" />
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                    <span>0 FCFA</span>
                                    <span>50 000+ FCFA</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-xs uppercase tracking-widest text-[#17cf54]">Avis Clients</h4>
                            <div className="space-y-3">
                                {[5, 4, 3].map((star) => (
                                    <div key={star} className="flex items-center gap-2 text-yellow-400 group cursor-pointer">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < star ? "currentColor" : "none"} className={i < star ? "" : "text-gray-200"} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900">& Up</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="flex-1 space-y-8">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-gray-50 rounded-3xl border border-gray-100 gap-4">
                            <div className="flex items-center gap-4">
                                <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Link to="/" className="hover:text-[#17cf54]">Home</Link>
                                    <ChevronRight size={12} />
                                    <span className="text-gray-900">Produits</span>
                                </nav>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <p className="text-xs font-bold text-gray-500">850 Produits trouvés</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                                    <button className="p-2 bg-gray-50 text-[#17cf54] rounded-lg shadow-sm"><Grid2X2 size={18} /></button>
                                    <button className="p-2 text-gray-400"><List size={18} /></button>
                                </div>
                                <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#17cf54]">
                                    <option>Trier par : Popularité</option>
                                    <option>Prix : Croissant</option>
                                    <option>Prix : Décroissant</option>
                                    <option>Les plus récents</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((item) => (
                                <Link to={`/product/${item.id}`} key={item.id} className="group cursor-pointer space-y-4 block">
                                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 relative shadow-inner">
                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        {item.badge && (
                                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-[#17cf54] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-sm border border-white/50">
                                                {item.badge}
                                            </div>
                                        )}
                                        <button className="absolute bottom-6 right-6 bg-white text-[#17cf54] p-4 rounded-[1.25rem] shadow-xl hover:bg-[#17cf54] hover:text-white transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300">
                                            <ShoppingCart size={22} />
                                        </button>
                                    </div>
                                    <div className="px-2">
                                        <p className="text-[10px] font-black text-[#17cf54] uppercase tracking-[0.2em] mb-1">{item.cat}</p>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">{item.name}</h3>
                                        <div className="flex items-center justify-between mt-3">
                                            <p className="text-xl font-black text-gray-900">{item.price}</p>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-100">
                                                <Star size={12} fill="#eab308" className="text-[#eab308]" />
                                                <span className="text-[10px] font-black text-[#854d0e]">{item.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination Placeholder */}
                        <div className="flex justify-center pt-12">
                            <button className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-gray-900/40 active:translate-y-0 transition-all">
                                Charger plus de trésors
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs text-gray-400 font-medium tracking-tight uppercase">
                        © 2024 FasoMarket - Fait avec passion pour le Burkina Faso
                    </p>
                </div>
            </footer>
        </div>
    );
}
