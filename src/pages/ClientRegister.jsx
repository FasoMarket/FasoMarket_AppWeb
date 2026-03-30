import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    CheckCircle2,
    ArrowRight,
    User,
    Globe,
    ShoppingCart,
    Loader2,
    AlertCircle,
    Store
} from 'lucide-react';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { getAdminUrl } from '../config/urls';

export default function ClientRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        firstName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);
        try {
            const res = await authService.register({
                name: `${formData.firstName} ${formData.name}`,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: 'customer',
            });
            authService.saveSession(res.data.token, res.data.user);
            try { await cartService.syncCart(); } catch(e) {}
            
            // Redirection selon le rôle
            const role = res.data.user.role;
            if (role === 'vendor') {
                navigate('/vendor/dashboard');
            } else if (role === 'admin') {
                window.location.href = getAdminUrl();
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
            {/* Header */}
            <header className="px-6 py-4 flex justify-between items-center max-w-[1400px] w-full mx-auto bg-white/50 backdrop-blur-sm z-50">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#17cf54] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#17cf54]/20">
                        <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                            <path d="M2 17L12 22L22 17" />
                            <path d="M2 12L12 17L22 12" />
                        </svg>
                    </div>
                    <span className="text-xl font-black tracking-tight text-gray-900">FasoMarket</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/vendor" className="text-sm font-bold text-gray-600 hover:text-[#17cf54]">
                        Espace Vendeur
                    </Link>
                    <Link to="/login" className="bg-[#e8faee] text-[#17cf54] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#d1f5db] transition-colors">
                        Se connecter
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
                <div className="max-w-[1100px] w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 flex flex-col lg:flex-row overflow-hidden min-h-[650px] border border-gray-100">

                    {/* Left Section - Client Benefits */}
                    <div className="lg:w-[40%] bg-gray-900 p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden text-white">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#17cf54]/10 rounded-full blur-3xl -mr-40 -mt-40"></div>

                        <div className="relative z-10 space-y-10">
                            <div className="w-16 h-16 bg-[#17cf54] rounded-2xl flex items-center justify-center shadow-lg shadow-[#17cf54]/20">
                                <ShoppingCart size={32} className="text-white" />
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                                Le meilleur du Burkina, <br />
                                <span className="text-[#17cf54]">juste pour vous.</span>
                            </h1>

                            <ul className="space-y-6">
                                {[
                                    'Accès aux meilleurs produits locaux',
                                    'Paiement 100% sécurisé',
                                    'Suivi de commande en temps réel',
                                    'Support client à votre écoute'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-base font-bold text-gray-300">
                                        <CheckCircle2 size={20} className="text-[#17cf54] shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p className="relative z-10 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Rejoignez la communauté FasoMarket
                        </p>
                    </div>

                    {/* Right Section - Form */}
                    <div className="lg:w-[60%] p-10 lg:p-16 flex flex-col justify-center bg-white">
                        <div className="max-w-md mx-auto w-full space-y-8">
                            <div className="space-y-3">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Créer votre compte</h2>
                                <p className="text-gray-400 font-medium text-sm">
                                    Prêt à découvrir des trésors locaux ? Rejoignez FasoMarket dès aujourd'hui.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nom</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Traoré"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 disabled:opacity-50"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Moussa"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 disabled:opacity-50"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="moussa@example.com"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 disabled:opacity-50"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+226 -- -- -- --"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 disabled:opacity-50"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            minLength={6}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 disabled:opacity-50"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirmation</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 disabled:opacity-50"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4.5 bg-[#17cf54] text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-[#12a643] transition-all shadow-xl shadow-[#17cf54]/20 active:scale-95 group mt-6 h-[60px] disabled:bg-gray-400 disabled:shadow-none"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            S'inscrire maintenant
                                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="pt-2 text-center text-sm font-bold text-gray-500 space-y-2">
                                <p>
                                    Déjà un compte ? <Link to="/login" className="text-[#17cf54] hover:underline ml-1">Se connecter</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="px-6 py-10 max-w-[1400px] w-full mx-auto border-t border-gray-50">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">© 2024 FasoMarket</p>
                    <div className="flex gap-10">
                        {['Privacy', 'Terms'].map((item) => (
                            <Link key={item} to="#" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#17cf54] transition-colors">{item}</Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                        <Globe size={16} />
                        <span>Burkina Faso (FR)</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
