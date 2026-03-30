import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Search, 
    MapPin, 
    Star, 
    CheckCircle, 
    ChevronRight, 
    Store,
    Loader2,
    AlertCircle,
    Mail
} from 'lucide-react';
import { authService } from '../services/authService';
import { storeService } from '../services/storeService';

export default function Stores() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            try {
                const response = await storeService.getAll();
                const data = response.data?.data || response.data?.stores || response.data;
                setStores(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Erreur chargement boutiques:', err);
                setError('Impossible de récupérer la liste des boutiques.');
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

    const filteredStores = stores.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-[#17cf54] animate-spin mx-auto" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Exploration des ateliers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfdfc] font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
                        Nos <span className="text-[#17cf54]">Boutiques</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-2xl">
                        Découvrez les meilleurs artisans et vendeurs du Burkina Faso. Chaque boutique raconte une histoire unique de savoir-faire et de tradition.
                    </p>
                </div>

                {error ? (
                    <div className="py-20 text-center bg-red-50 rounded-[3rem] border border-red-100">
                        <AlertCircle size={40} className="mx-auto text-red-400 mb-4" />
                        <h3 className="text-xl font-black text-gray-900">{error}</h3>
                        <button onClick={() => window.location.reload()} className="mt-4 px-8 py-3 bg-red-500 text-white rounded-xl font-bold text-sm">Réessayer</button>
                    </div>
                ) : filteredStores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStores.map((store) => (
                            <Link 
                                to={`/shop/${store.id || store.slug || store._id}`} 
                                key={store._id} 
                                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#17cf54]/30 transition-all duration-500 flex flex-col"
                            >
                                <div className="h-40 w-full relative overflow-hidden">
                                    <img 
                                        src={store.banner || "https://placehold.co/800x400?text=Banner"} 
                                        alt={store.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="px-8 pb-8 flex-1 relative">
                                    <div className="absolute -top-12 left-8 w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-lg bg-white">
                                        <img 
                                            src={store.logo || "https://placehold.co/200x200?text=Logo"} 
                                            alt={store.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="mt-12 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="text-xl font-black text-gray-900 group-hover:text-[#17cf54] transition-colors line-clamp-1">{store.name}</h3>
                                                {store.isVerified && <CheckCircle size={16} className="text-[#17cf54]" />}
                                            </div>
                                            <div className="flex items-center gap-1 text-[#17cf54]">
                                                <span className="text-xs font-black">{store.rating?.average || '5.0'}</span>
                                                <Star size={14} fill="currentColor" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            <MapPin size={14} className="text-[#17cf54]" />
                                            <span>{store.address || "Ouagadougou"}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
                                            {store.description || "Aucune description disponible pour cette boutique."}
                                        </p>
                                        <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Visiter la boutique</span>
                                            <ChevronRight size={18} className="text-[#17cf54] translate-x-0 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                        <Store size={40} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-black text-gray-900">Aucune boutique trouvée</h3>
                        <p className="text-sm font-medium text-gray-500 mt-2">Essayez d'ajuster votre recherche ou revenez plus tard.</p>
                    </div>
                )}
            </main>

            <footer className="bg-white border-t border-gray-100 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        © 2024 FasoMarket - Le coeur du commerce Burkinabè
                    </p>
                </div>
            </footer>
        </div>
    );
}
