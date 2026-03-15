import { Link, useParams } from 'react-router-dom';
import {
    Search,
    ShoppingCart,
    User,
    ChevronRight,
    MapPin,
    CheckCircle,
    Star,
    MessageCircle,
    Heart,
    Filter,
    ArrowUpDown
} from 'lucide-react';

export default function ShopDetail() {
    const { id } = useParams();

    // Mock data for the shop
    const shop = {
        name: "L'Artisan du Faso",
        isVerified: true,
        location: "Ouagadougou, Burkina Faso",
        description: "Bienvenue à L'Artisan du Faso. Nous sommes un collectif d'artisans locaux dédiés à la préservation du riche patrimoine culturel du Burkina Faso. Chaque article de notre boutique est fabriqué à la main selon des techniques ancestrales transmises de génération en génération. Des tissus vibrants Faso Dan Fani aux sculptures en bronze complexes et à la maroquinerie durable, notre mission est d'apporter l'âme du Sahel dans votre maison tout en soutenant le commerce équitable et le développement des communautés locales.",
        tags: ["HANDMADE", "SUSTAINABLE", "FAIR TRADE"],
        rating: 4.8,
        totalReviews: 124,
        ratingWeights: [
            { stars: 5, percentage: 85 },
            { stars: 4, percentage: 10 },
            { stars: 3, percentage: 3 },
            { stars: 2, percentage: 1 },
            { stars: 1, percentage: 1 },
        ],
        banner: "https://images.unsplash.com/photo-1544207604-0c58e8055a40?w=1600&h=400&fit=crop",
        logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        productCount: 24
    };

    const products = [
        { id: 1, name: 'Handmade Bronze Leopard', cat: 'SCULPTURE', price: '45,000 CFA', img: 'https://images.unsplash.com/photo-1582531362002-3114532b260e?w=800&h=800&fit=crop' },
        { id: 2, name: 'Faso Dan Fani - Royal Blue', cat: 'TEXTILES', price: '12,500 CFA', img: 'https://images.unsplash.com/photo-1583305727198-bc1c20536d99?w=800&h=800&fit=crop' },
        { id: 3, name: 'Geometric Woven Basket', cat: 'HOME DECOR', price: '8,000 CFA', img: 'https://images.unsplash.com/photo-1590736952143-6c8a77755712?w=800&h=800&fit=crop' },
        { id: 4, name: 'Artisan Leather Messenger', cat: 'LEATHER', price: '28,000 CFA', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop', badge: 'BEST SELLER' },
        { id: 5, name: 'Painted Wooden Tribal Mask', cat: 'ART', price: '32,000 CFA', img: 'https://images.unsplash.com/photo-1596751303335-74f350360ec9?w=800&h=800&fit=crop' },
        { id: 6, name: 'Carved Ebony Salad Set', cat: 'KITCHENWARE', price: '6,500 CFA', img: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=800&h=800&fit=crop' },
        { id: 7, name: 'Earth Tones Clay Bowl', cat: 'CERAMICS', price: '15,000 CFA', img: 'https://images.unsplash.com/photo-1578749553244-9311488c9df4?w=800&h=800&fit=crop' },
        { id: 8, name: 'Authentic 12-Key Balafon', cat: 'INSTRUMENTS', price: '85,000 CFA', img: 'https://images.unsplash.com/photo-1614949507960-9378c290132b?w=800&h=800&fit=crop' },
    ];

    return (
        <div className="min-h-screen bg-[#fcfdfc]">
            {/* Navigation (Reused from Home) */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 gap-8">
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <div className="w-10 h-10 bg-[#17cf54] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#17cf54]/20">
                                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-gray-900 hidden sm:block">FasoMarket</span>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-600">
                            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                            <Link to="/categories" className="hover:text-gray-900 transition-colors">Categories</Link>
                            <Link to="/deals" className="hover:text-gray-900 transition-colors">Deals</Link>
                            <Link to="/vendor/register" className="text-[#17cf54]">Sell</Link>
                        </nav>
                        <div className="flex-1 max-w-xl relative hidden md:block text-gray-400">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
                            <input
                                type="text"
                                placeholder="Search for crafts..."
                                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#17cf54] focus:border-transparent outline-none transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                <ShoppingCart size={22} />
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#17cf54] text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
                            </Link>
                            <Link to="/account" className="p-0.5 bg-gray-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                <div className="w-8 h-8 bg-[#ccf7de] flex items-center justify-center">
                                    <User size={20} className="text-[#17cf54]" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* Shop Banner & Profile */}
                <div className="relative mb-24">
                    <div className="h-64 sm:h-80 w-full rounded-[2rem] overflow-hidden shadow-sm">
                        <img src={shop.banner} alt="Shop Banner" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-16 left-8 flex flex-col sm:flex-row items-end sm:items-center gap-6">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-8 border-white overflow-hidden shadow-xl bg-white">
                            <img src={shop.logo} alt="Shop Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-black text-gray-900">{shop.name}</h1>
                                {shop.isVerified && <CheckCircle size={20} className="text-[#17cf54] fill-[#17cf54]/10" />}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm font-bold text-[#17cf54]">
                                <MapPin size={16} />
                                <span>{shop.location}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 pb-6">
                            <button className="px-6 py-3 bg-[#17cf54] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#17cf54]/20 hover:bg-[#12a643] transition-all flex items-center gap-2">
                                <Heart size={18} fill="currentColor" />
                                Follow Shop
                            </button>
                            <button className="px-6 py-3 bg-white text-[#17cf54] border-2 border-[#17cf54] rounded-xl font-bold text-sm hover:bg-[#f2fdf6] transition-all">
                                Contact
                            </button>
                        </div>
                    </div>
                </div>

                {/* About & Ratings */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-4">About the Artisan</h2>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {shop.description}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {shop.tags.map(tag => (
                                <span key={tag} className="px-4 py-1.5 bg-[#f2fdf6] text-[#17cf54] text-[10px] font-black rounded-full border border-[#ccf7de] tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#f2fdf6] rounded-3xl p-8 border border-[#ccf7de]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Shop Rating</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="text-2xl font-black text-[#17cf54]">{shop.rating}</span>
                                <Star size={20} className="text-[#17cf54] fill-[#17cf54]" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {shop.ratingWeights.map(weight => (
                                <div key={weight.stars} className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-gray-500 w-2">{weight.stars}</span>
                                    <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-[#17cf54] rounded-full" 
                                            style={{ width: `${weight.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 w-8">{weight.percentage}%</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 text-center text-[#17cf54] text-[10px] font-black underline uppercase tracking-widest hover:text-[#12a643]">
                            See all {shop.totalReviews} reviews
                        </button>
                    </div>
                </div>

                {/* Products Section */}
                <section className="space-y-10">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-2xl font-black text-gray-900">
                            Shop Products <span className="text-[#17cf54]/60">({shop.productCount})</span>
                        </h2>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <span>Sort by:</span>
                                <button className="flex items-center gap-1 text-gray-900">
                                    Newest Arrivals <ChevronRight size={14} className="rotate-90" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product) => (
                            <div key={product.id} className="group space-y-4">
                                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-sm relative border border-gray-50 flex items-center justify-center p-4">
                                    <img 
                                        src={product.img} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl" 
                                    />
                                    {product.badge && (
                                        <div className="absolute top-6 left-6 bg-[#17cf54] text-white text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                                            {product.badge}
                                        </div>
                                    )}
                                </div>
                                <div className="px-2">
                                    <p className="text-[10px] font-bold text-[#17cf54] uppercase tracking-widest mb-1">{product.cat}</p>
                                    <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-lg font-black text-gray-900">{product.price}</p>
                                        <button className="w-10 h-10 bg-[#17cf54] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#17cf54]/20 hover:bg-[#12a643] transition-all active:scale-90">
                                            <ShoppingCart size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 pt-12">
                        <button className="p-2 text-gray-400 hover:text-[#17cf54] transition-colors">
                            <ChevronRight size={20} className="rotate-180" />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-[#17cf54] text-white font-bold shadow-lg shadow-[#17cf54]/20">1</button>
                        <button className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-600 font-bold transition-all">2</button>
                        <button className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-600 font-bold transition-all">3</button>
                        <span className="text-gray-400 text-sm font-bold">...</span>
                        <button className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-600 font-bold transition-all">12</button>
                        <button className="p-2 text-gray-400 hover:text-[#17cf54] transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </section>

            </main>

            {/* Footer (Reused from Home) */}
            <footer className="bg-[#f0f9f4] border-t border-[#ccf7de] mt-24 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#17cf54] rounded-lg"></div>
                                <span className="text-xl font-black text-gray-900">FasoMarket</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                Connecting local Burkinabè artisans with the global market. Empowering communities through fair trade and digital commerce.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-black text-gray-900 uppercase tracking-tight">Shop</h4>
                            <nav className="flex flex-col gap-3 text-sm text-gray-500 font-medium">
                                <Link to="/" className="hover:text-[#17cf54]">Categories</Link>
                                <Link to="/" className="hover:text-[#17cf54]">New Arrivals</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Deals & Offers</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Wholesale</Link>
                            </nav>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-black text-gray-900 uppercase tracking-tight">Support</h4>
                            <nav className="flex flex-col gap-3 text-sm text-gray-500 font-medium">
                                <Link to="/" className="hover:text-[#17cf54]">Help Center</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Shipping Info</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Returns & Refunds</Link>
                                <Link to="/" className="hover:text-[#17cf54]">Contact Us</Link>
                            </nav>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-black text-gray-900 uppercase tracking-tight">Newsletter</h4>
                            <p className="text-xs text-gray-500 font-medium italic">Subscribe for artisan stories and exclusive craft deals.</p>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    placeholder="Your email" 
                                    className="flex-1 px-4 py-2.5 bg-white border border-[#ccf7de] rounded-xl text-sm focus:ring-2 focus:ring-[#17cf54] outline-none"
                                />
                                <button className="px-4 py-2.5 bg-[#17cf54] text-white font-bold rounded-xl text-sm hover:bg-[#12a643] transition-all">Join</button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-[#ccf7de] flex flex-col md:row items-center justify-between gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <p>© 2024 FASOMARKET. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-6">
                            <MessageCircle size={18} className="cursor-pointer hover:text-[#17cf54]" />
                            <User size={18} className="cursor-pointer hover:text-[#17cf54]" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
