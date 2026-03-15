import { Link } from 'react-router-dom';
import { 
    Trash2, 
    Plus, 
    Minus, 
    ChevronRight, 
    ShoppingBag, 
    ArrowRight,
    Search,
    User,
    CheckCircle2,
    Truck
} from 'lucide-react';

export default function Cart() {
    // Données de test du panier basées sur l'image
    const cartItems = [
        {
            id: 1,
            name: "Tissu Faso Danfani",
            description: "Textile tissé main premium (Bleu/Blanc)",
            price: 15000,
            originalPrice: 18000,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1544207604-0c58e8055a40?w=400&h=400&fit=crop"
        },
        {
            id: 2,
            name: "Beurre de Karité Bio",
            description: "100% Naturel - Pot de 500g",
            price: 5000, // par article
            totalPrice: 10000,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1596751303335-74f350360ec9?w=400&h=400&fit=crop"
        },
        {
            id: 3,
            name: "Mangues séchées Amélie",
            description: "Collation Bio - Sachet de 200g",
            price: 2500,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1590005354167-6da97870fa1c?w=400&h=400&fit=crop"
        }
    ];

    const subtotal = 27500;
    const shipping = 1500;
    const taxes = 0;
    const total = 29000;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* En-tête (Correspondant à l'image) */}
            <header className="bg-white border-b border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center gap-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <div className="w-8 h-8 bg-[#16c44f] rounded-lg flex items-center justify-center p-1.5">
                                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                    <path d="M2 17L12 22L22 17" />
                                    <path d="M2 12L12 17L22 12" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900">FasoMarket</span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-700">
                            <Link to="/" className="hover:text-[#16c44f] transition-colors">Accueil</Link>
                            <Link to="/categories" className="hover:text-[#16c44f] transition-colors">Catégories</Link>
                            <Link to="/deals" className="hover:text-[#16c44f] transition-colors">Offres</Link>
                            <Link to="/orders" className="hover:text-[#16c44f] transition-colors">Commandes</Link>
                        </nav>

                        {/* Barre de recherche */}
                        <div className="flex-1 max-w-lg relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher des produits..."
                                className="w-full pl-11 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#16c44f]/20 outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Icônes Panier & Utilisateur */}
                        <div className="flex items-center gap-5">
                            <Link to="/cart" className="relative p-1 text-gray-700 hover:text-[#16c44f] transition-colors">
                                <ShoppingBag size={22} strokeWidth={2.5} />
                                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-[#16c44f] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">3</span>
                            </Link>
                            <button className="text-gray-700 hover:text-[#16c44f] transition-colors">
                                <User size={22} strokeWidth={2.5} />
                            </button>
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden border border-orange-200">
                                <img src="https://ui-avatars.com/api/?name=User&background=ffedd5&color=9a3412" alt="Profil" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Fil d'Ariane */}
                <nav className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-6">
                    <Link to="/" className="hover:text-gray-600">Accueil</Link>
                    <ChevronRight size={14} strokeWidth={3} />
                    <span className="text-gray-600">Panier d'achat</span>
                </nav>

                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-1">Votre Panier</h1>
                    <p className="text-gray-500 font-medium">Gérez vos articles et passez au paiement sécurisé.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Liste des articles du panier */}
                    <div className="flex-1 space-y-4 w-full">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-5 rounded-[1.25rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 relative">
                                {/* Bouton Supprimer */}
                                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1">
                                    <Trash2 size={18} />
                                </button>

                                {/* Image du produit */}
                                <div className="w-full sm:w-40 h-40 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                
                                {/* Contenu de l'article */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 mb-1">{item.name}</h3>
                                        <p className="text-sm font-semibold text-gray-400">{item.description}</p>
                                    </div>
                                    
                                    <div className="flex justify-between items-end mt-4 sm:mt-0">
                                        {/* Sélecteur de quantité */}
                                        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100 h-10">
                                            <button className="w-8 h-8 flex items-center justify-center text-[#16c44f] hover:bg-white rounded-md transition-all">
                                                <Minus size={16} strokeWidth={3} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                                            <button className="w-8 h-8 flex items-center justify-center text-[#16c44f] hover:bg-white rounded-md transition-all">
                                                <Plus size={16} strokeWidth={3} />
                                            </button>
                                        </div>

                                        {/* Affichage du prix */}
                                        <div className="text-right">
                                            {item.originalPrice && (
                                                <p className="text-xs font-bold text-gray-300 line-through mb-0.5">{item.originalPrice.toLocaleString()} FCFA</p>
                                            )}
                                            <p className="text-2xl font-black text-[#16c44f]">
                                                {item.totalPrice ? item.totalPrice.toLocaleString() : item.price.toLocaleString()} FCFA
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="text-[10px] font-bold text-gray-400 mt-1">({item.price.toLocaleString()} FCFA l'unité)</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Barre latérale du résumé de la commande */}
                    <div className="w-full lg:w-[400px] shrink-0 space-y-6">
                        <div className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-black text-gray-900 mb-8">Résumé de la commande</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm font-semibold text-gray-500">
                                    <span>Sous-total</span>
                                    <span className="text-gray-900 font-bold">{subtotal.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold text-gray-500">
                                    <span>Livraison estimée</span>
                                    <span className="text-gray-900 font-bold">{shipping.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold text-gray-500">
                                    <span>Taxes (estimées)</span>
                                    <span className="text-gray-900 font-bold">{taxes.toLocaleString()} FCFA</span>
                                </div>
                                <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                                    <span className="text-lg font-black text-gray-900">Total</span>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-[#16c44f]">{total.toLocaleString()} FCFA</p>
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1 text-right">TVA INCLUSE</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link to="/checkout" className="w-full py-4.5 bg-[#16c44f] text-white rounded-xl font-black text-base shadow-xl shadow-[#16c44f]/20 hover:bg-[#12a643] transition-all flex items-center justify-center gap-2 group active:scale-95">
                                    Passer à la caisse <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className="w-full py-4.5 bg-gray-100 text-gray-700 rounded-xl font-black text-base hover:bg-gray-200 transition-all active:scale-95">
                                    Continuer mes achats
                                </button>
                            </div>

                            <div className="mt-8 space-y-4 border-t border-gray-50 pt-8">
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                    <CheckCircle2 size={18} className="text-[#16c44f] shrink-0" />
                                    <span>Paiement sécurisé crypté SSL</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                    <Truck size={18} className="text-[#16c44f] shrink-0" />
                                    <span>Livraison gratuite dès 50 000 FCFA d'achat</span>
                                </div>
                            </div>
                        </div>

                        {/* Boîte de code promo */}
                        <div className="bg-[#f0fdf4] rounded-[1.25rem] p-6 border border-[#dcfce7]">
                            <p className="text-sm font-bold text-[#166534] mb-4">Vous avez un code promo ?</p>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Entrez le code" 
                                    className="flex-1 px-4 py-2.5 bg-white border border-[#dcfce7] rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#16c44f]/20 outline-none"
                                />
                                <button className="px-5 py-2.5 bg-[#d1fae5] text-[#16c44f] font-black rounded-lg text-sm hover:bg-[#16c44f] hover:text-white transition-all">
                                    Appliquer
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Pied de page (Correspondant à l'image) */}
            <footer className="bg-white border-t border-gray-100 mt-20 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6 lg:col-span-1">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-[#16c44f] rounded flex items-center justify-center p-1">
                                    <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                        <path d="M2 17L12 22L22 17" />
                                        <path d="M2 12L12 17L22 12" />
                                    </svg>
                                </div>
                                <span className="text-lg font-black text-gray-900">FasoMarket</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                Connecter les artisans et producteurs locaux du Burkina Faso avec le monde. Des produits authentiques livrés à votre porte.
                            </p>
                        </div>
                        
                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Boutique</h4>
                            <nav className="flex flex-col gap-3 text-sm font-semibold text-gray-500">
                                <Link to="/" className="hover:text-[#16c44f]">Faso Danfani</Link>
                                <Link to="/" className="hover:text-[#16c44f]">Cosmétiques Bio</Link>
                                <Link to="/" className="hover:text-[#16c44f]">Épices Burkinabè</Link>
                                <Link to="/" className="hover:text-[#16c44f]">Art & Artisanat</Link>
                            </nav>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Service Client</h4>
                            <nav className="flex flex-col gap-3 text-sm font-semibold text-gray-500">
                                <Link to="/" className="hover:text-[#16c44f]">Politique de livraison</Link>
                                <Link to="/" className="hover:text-[#16c44f]">Retours & Remboursements</Link>
                                <Link to="/" className="hover:text-[#16c44f]">Suivre ma commande</Link>
                                <Link to="/" className="hover:text-[#16c44f]">FAQ</Link>
                            </nav>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Newsletter</h4>
                            <p className="text-sm font-semibold text-gray-500">Recevez les nouveautés et les offres exclusives.</p>
                            <div className="flex">
                                <input 
                                    type="email" 
                                    placeholder="Votre email" 
                                    className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-l-xl text-sm font-medium focus:ring-0 outline-none"
                                />
                                <button className="bg-[#16c44f] text-white px-5 rounded-r-xl hover:bg-[#12a643] transition-all">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-semibold text-gray-400">
                        <p>© 2024 FasoMarket. Proudly Burkinabè.</p>
                        <div className="flex gap-8">
                            <Link to="/" className="hover:text-gray-600">Conditions</Link>
                            <Link to="/" className="hover:text-gray-600">Confidentialité</Link>
                            <Link to="/" className="hover:text-gray-600">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
