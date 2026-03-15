import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
    Search, 
    ShoppingBag, 
    User, 
    ChevronRight, 
    Star, 
    Plus, 
    Minus, 
    Store, 
    Heart,
    ArrowRight,
    Camera
} from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const product = {
        name: "Vase Koudougou Artisanal",
        category: "ARTISANAT LOCAL",
        price: "12.500",
        currency: "FCFA",
        rating: 4.8,
        reviewsCount: 24,
        description: "Façonné à la main par les maîtres potiers de la région de Koudougou, ce vase en terre cuite incarne l'élégance du savoir-faire traditionnel burkinabè. Chaque pièce est unique, arborant des motifs géométriques gravés qui racontent l'histoire et les valeurs de notre culture. Idéal pour sublimer votre intérieur avec une touche authentique et chaleureuse.",
        images: [
            "https://images.unsplash.com/photo-1578749553244-9311488c9df4?w=800&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1590736952143-6c8a77755712?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1582531362002-3114532b260e?w=400&h=400&fit=crop"
        ],
        vendor: {
            name: "L'Artisan du Faso",
            id: 1
        }
    };

    const similarProducts = [
        { id: 101, name: "Statue Senufo sculptée", price: "25.000 FCFA", rating: 4.8, img: "https://images.unsplash.com/photo-1596751303335-74f350360ec9?w=400&h=500&fit=crop" },
        { id: 102, name: "Bol en paille tressée", price: "5.500 FCFA", rating: 4.2, img: "https://images.unsplash.com/photo-1621360341396-85617ce3daab?w=400&h=500&fit=crop" },
        { id: 103, name: "Coupelle en terre cuite", price: "3.200 FCFA", rating: 4.5, img: "https://images.unsplash.com/photo-1512418490979-92798ccc13b0?w=400&h=500&fit=crop" },
        { id: 104, name: "Masque artisanal Bwa", price: "45.000 FCFA", rating: 4.9, img: "https://images.unsplash.com/photo-1590005354167-6da97870fa1c?w=400&h=500&fit=crop" }
    ];

    return (
        <div className="min-h-screen bg-[#fcfdfc]">
            {/* Header (Matching Reference Image) */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 gap-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <div className="w-8 h-8 bg-[#17cf54] rounded-lg flex items-center justify-center p-1.5 shadow-lg shadow-[#17cf54]/20">
                                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900">FasoMarket</span>
                        </Link>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-sm relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher un produit artisanal..."
                                className="w-full pl-10 pr-4 py-2 bg-[#f2fdf6] border-none rounded-lg focus:ring-2 focus:ring-[#17cf54]/20 outline-none transition-all text-xs font-medium placeholder:text-gray-400"
                            />
                        </div>

                        {/* Navigation */}
                        <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold text-gray-700">
                            <Link to="/" className="hover:text-[#17cf54]">Accueil</Link>
                            <Link to="/" className="hover:text-[#17cf54]">Boutique</Link>
                            <Link to="/" className="text-[#17cf54]">Artisanat</Link>
                            <Link to="/" className="hover:text-[#17cf54]">Mode</Link>
                            <Link to="/" className="hover:text-[#17cf54]">Contact</Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-5">
                            <Link to="/cart" className="relative p-1 text-gray-700 hover:text-[#17cf54] transition-colors">
                                <ShoppingBag size={20} strokeWidth={2.5} />
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#17cf54] text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">2</span>
                            </Link>
                            <Link to="/account" className="text-gray-700 hover:text-[#17cf54]">
                                <User size={20} strokeWidth={2.5} />
                            </Link>
                            <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-orange-100">
                                <img src="https://ui-avatars.com/api/?name=User&background=ffedd5&color=9a3412" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-8">
                    <Link to="/" className="hover:text-[#17cf54]">Accueil</Link>
                    <ChevronRight size={12} strokeWidth={3} />
                    <Link to="/" className="hover:text-[#17cf54]">Artisanat</Link>
                    <ChevronRight size={12} strokeWidth={3} />
                    <span className="text-gray-600 truncate">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:row lg:flex-row gap-12 lg:gap-20 mb-24">
                    
                    {/* Gallery Section */}
                    <div className="lg:flex-1 space-y-4">
                        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setActiveImage(idx)}
                                    className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${idx === activeImage ? 'border-[#17cf54]' : 'border-white bg-gray-50'}`}
                                >
                                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                            <div className="aspect-square rounded-2xl bg-[#f2fdf6] border-4 border-white flex items-center justify-center text-[#17cf54] hover:bg-[#e8faee] transition-colors cursor-pointer">
                                <Camera size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="lg:flex-1 py-4">
                        <span className="px-3 py-1 bg-[#f2fdf6] text-[#17cf54] text-[10px] font-black rounded-lg border border-[#e8faee] tracking-widest mb-4 inline-block">
                            {product.category}
                        </span>
                        
                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">{product.name}</h1>
                        
                        <div className="flex items-center gap-2 mb-8">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} strokeWidth={i < 4 ? 0 : 3} />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-gray-400">({product.reviewsCount} avis vérifiés)</span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-4xl font-black text-[#17cf54]">{product.price}</span>
                            <span className="text-xl font-black text-[#17cf54]">{product.currency}</span>
                        </div>

                        <p className="text-gray-500 leading-relaxed font-medium mb-10 max-w-xl">
                            {product.description}
                        </p>

                        <div className="bg-[#fcfdfc] border border-gray-100 rounded-[2rem] p-6 mb-8 flex flex-col sm:flex-row items-center gap-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Quantité</span>
                                <div className="flex items-center bg-white rounded-xl p-1 border border-gray-100 shadow-sm h-12 w-32 justify-between">
                                    <button 
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        <Minus size={18} strokeWidth={3} />
                                    </button>
                                    <span className="font-black text-gray-900">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                            <button className="flex-1 w-full sm:w-auto h-14 bg-[#17cf54] text-white rounded-2xl font-black text-base shadow-xl shadow-[#17cf54]/20 hover:bg-[#12a643] transition-all flex items-center justify-center gap-3 active:scale-95">
                                <ShoppingBag size={20} />
                                Ajouter au panier
                            </button>
                        </div>

                        {/* Vendor Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:border-[#17cf54]/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#f2fdf6] rounded-xl flex items-center justify-center text-[#17cf54]">
                                    <Store size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Vendu par :</p>
                                    <h4 className="font-black text-gray-900">{product.vendor.name}</h4>
                                </div>
                            </div>
                            <Link to={`/shop/${product.vendor.id}`} className="text-[#17cf54] text-xs font-black flex items-center gap-1.5 hover:translate-x-1 transition-transform">
                                Voir la boutique <ArrowRight size={14} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                <section className="space-y-10">
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-black text-gray-900 italic">Produits similaires</h2>
                        <Link to="/products" className="text-[#17cf54] text-sm font-black flex items-center gap-2 hover:translate-x-1 transition-transform">
                            Tout voir <ArrowRight size={18} strokeWidth={3} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {similarProducts.map((p) => (
                            <div key={p.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all">
                                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm">
                                        <Heart size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                                <div className="p-6 space-y-3">
                                    <h3 className="font-bold text-gray-900 truncate">{p.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[#17cf54] font-black">{p.price}</p>
                                        <div className="flex items-center gap-1 text-[10px] font-black text-yellow-500">
                                            <span>★</span>
                                            <span className="text-gray-400">{p.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-[#111827] text-white pt-20 pb-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#17cf54] rounded-lg"></div>
                                <span className="text-xl font-black">FasoMarket</span>
                            </div>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                Votre passerelle vers l'excellence de l'artisanat et des produits du Burkina Faso. Soutenez les créateurs locaux.
                            </p>
                            <div className="flex gap-4 grayscale opacity-60">
                                <div className="w-8 h-8 bg-gray-800 rounded-lg"></div>
                                <div className="w-8 h-8 bg-gray-800 rounded-lg"></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-sm uppercase tracking-widest">Navigation</h4>
                            <nav className="flex flex-col gap-3 text-sm font-medium text-gray-400">
                                <Link to="/" className="hover:text-white transition-colors">Boutique</Link>
                                <Link to="/" className="hover:text-white transition-colors">Artisanat</Link>
                                <Link to="/" className="hover:text-white transition-colors">Mode & Textile</Link>
                                <Link to="/" className="hover:text-white transition-colors">Nos Artisans</Link>
                            </nav>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-sm uppercase tracking-widest">Assistance</h4>
                            <nav className="flex flex-col gap-3 text-sm font-medium text-gray-400">
                                <Link to="/" className="hover:text-white transition-colors">Centre d'aide</Link>
                                <Link to="/" className="hover:text-white transition-colors">Livraison & Retours</Link>
                                <Link to="/" className="hover:text-white transition-colors">Paiement Sécurisé</Link>
                                <Link to="/" className="hover:text-white transition-colors">Nous contacter</Link>
                            </nav>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black text-sm uppercase tracking-widest">Newsletter</h4>
                            <p className="text-sm text-gray-400 font-medium">Recevez nos dernières pépites artisanales directement dans votre boîte mail.</p>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    placeholder="Votre email" 
                                    className="flex-1 px-4 py-3 bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-1 focus:ring-[#17cf54] outline-none"
                                />
                                <button className="p-3 bg-[#17cf54] text-white rounded-xl hover:bg-[#12a643] transition-all">
                                    <ArrowRight size={20} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                        <p>© 2024 FASOMARKET. FAIT AVEC PASSION POUR LE BURKINA FASO.</p>
                        <div className="flex gap-8">
                            <Link to="/" className="hover:text-white">Terms</Link>
                            <Link to="/" className="hover:text-white">Privacy</Link>
                            <Link to="/" className="hover:text-white">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
