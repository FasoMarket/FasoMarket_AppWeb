import { Link } from 'react-router-dom';
import {
    Palette,
    Utensils,
    Shirt,
    Cpu,
    Gem,
    Home as HomeIcon,
    ChevronRight,
    Search,
    ShoppingCart
} from 'lucide-react';

const categories = [
    { id: 1, name: 'Artisanat', icon: Palette, color: 'bg-green-50', iconColor: 'text-[#17cf54]', count: '1.2k+ Produits', desc: 'Poterie, vannerie et objets d\'art traditionnels.' },
    { id: 2, name: 'Aliments & Terroir', icon: Utensils, color: 'bg-orange-50', iconColor: 'text-orange-500', count: '500+ Produits', desc: 'Produits frais et transformés du Burkina.' },
    { id: 3, name: 'Mode Danfani', icon: Shirt, color: 'bg-blue-50', iconColor: 'text-blue-500', count: '800+ Articles', desc: 'Le meilleur du textile Faso Danfani.' },
    { id: 4, name: 'Électronique', icon: Cpu, color: 'bg-purple-50', iconColor: 'text-purple-500', count: '200+ Produits', desc: 'Accessoires et gadgets high-tech.' },
    { id: 5, name: 'Bijoux & Or', icon: Gem, color: 'bg-yellow-50', iconColor: 'text-yellow-600', count: '150+ Pièces', desc: 'Créations uniques en bronze et métaux précieux.' },
    { id: 6, name: 'Décoration', icon: HomeIcon, color: 'bg-pink-50', iconColor: 'text-pink-500', count: '300+ Articles', desc: 'Embellissez votre intérieur avec du local.' },
];

export default function Categories() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header (Simplified from Home) */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 gap-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#17cf54] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#17cf54]/20">
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
                                placeholder="Rechercher une catégorie..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:border-transparent outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/login" className="px-6 py-3 bg-[#17cf54] text-white rounded-2xl text-sm font-bold hover:bg-[#12a643] transition-all shadow-lg shadow-[#17cf54]/20">
                                Connexion
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                <div className="space-y-4">
                    <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Link to="/" className="hover:text-[#17cf54]">Accueil</Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-900">Toutes les catégories</span>
                    </nav>
                    <h1 className="text-4xl font-black text-gray-900">Explorer par Univers</h1>
                    <p className="text-lg text-gray-500 font-medium max-w-2xl">
                        Découvrez la richesse du savoir-faire burkinabè à travers nos différentes catégories de produits artisanaux et locaux.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/products?category=${cat.name.toLowerCase()}`}
                            className={`${cat.color} p-10 rounded-[3rem] border-2 border-transparent hover:border-[#17cf54] hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-16 h-16 ${cat.iconColor} bg-white rounded-[1.25rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    {(() => {
                                        const Icon = cat.icon;
                                        return <Icon size={32} />;
                                    })()}
                                </div>
                                <div className="px-4 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-white text-[10px] font-black tracking-widest uppercase text-gray-500 group-hover:bg-[#17cf54] group-hover:text-white group-hover:border-[#17cf54] transition-colors">
                                    {cat.count}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-gray-900">{cat.name}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {cat.desc}
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-2 text-[#17cf54] font-black group-hover:translate-x-2 transition-transform">
                                <span>Découvrir</span>
                                <ChevronRight size={20} />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <footer className="bg-gray-50 border-t border-gray-100 mt-20 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs text-gray-400 font-medium tracking-tight">
                        © 2024 FasoMarket - Ensemble valorisons notre identité & nos talents.
                    </p>
                </div>
            </footer>
        </div>
    );
}
