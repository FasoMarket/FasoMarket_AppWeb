import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    CheckCircle2,
    ArrowRight,
    Loader2,
    AlertCircle,
    Store,
    LayoutDashboard,
    Zap,
    ShieldCheck
} from 'lucide-react';
import { authService } from '../services/authService';

export default function VendorRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        firstName: '',
        email: '',
        phone: '',
        storeName: '',
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
                role: 'vendor',
                shopName: formData.storeName
            });
            authService.saveSession(res.data.token, res.data.user);
            navigate('/vendor');
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
                    <Link to="/login" className="bg-[#e8faee] text-[#17cf54] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#d1f5db] transition-colors">
                        Se connecter
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
                <div className="max-w-[1100px] w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 flex flex-col lg:flex-row overflow-hidden min-h-[700px] border border-gray-100">

                    {/* Left Section - Vendor Benefits */}
                    <div className="lg:w-[40%] bg-[#17cf54] p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden text-white">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl -ml-32 -mb-32"></div>

                        <div className="relative z-10 space-y-12">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/5">
                                <Store size={32} className="text-[#17cf54]" />
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                                    Propulsez votre <br />
                                    <span className="text-gray-900">Activité</span> vers <br />
                                    le sommet.
                                </h1>
                                <p className="text-white/80 font-medium">Rejoignez la plus grande marketplace burkinabè.</p>
                            </div>

                            <ul className="space-y-6">
                                {[
                                    { icon: LayoutDashboard, text: 'Tableau de bord complet' },
                                    { icon: Zap, text: 'Visibilité boostée à 100%' },
                                    { icon: ShieldCheck, text: 'Transactions sécurisées' },
                                    { icon: CheckCircle2, text: 'Support prioritaire' }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-base font-bold">
                                        <item.icon size={22} className="text-gray-900 shrink-0" />
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative z-10 pt-10">
                            <div className="inline-flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full border border-white/20">
                                <span className="text-xs font-black uppercase tracking-widest">Espace Vendeur Pro</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Form */}
                    <div className="lg:w-[60%] p-10 lg:p-16 flex flex-col justify-center bg-white">
                        <div className="max-w-md mx-auto w-full space-y-8">
                            <div className="space-y-3">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Ouvrir ma boutique</h2>
                                <p className="text-gray-400 font-medium text-sm">Remplissez ces informations pour commencer à vendre.</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nom de la Boutique</label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        required
                                        value={formData.storeName}
                                        onChange={handleChange}
                                        placeholder="Ex: Artisanat du Faso"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nom</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Ouedraogo"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Prénom</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Issa"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Professionnel</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="contact@maboutique.bf"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Téléphone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+226 -- -- -- --"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Mot de passe</label>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            minLength={6}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirmation</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54] focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-[#17cf54] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#12a643] transition-all shadow-xl shadow-[#17cf54]/20 active:scale-95 group mt-4 disabled:bg-gray-400 disabled:shadow-none"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            Lancer ma boutique
                                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-500">
                                    Déjà inscrit ? <Link to="/login" className="text-[#17cf54] hover:underline ml-1">Connexion</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="px-6 py-10 max-w-[1400px] w-full mx-auto border-t border-gray-50 text-center">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">© 2024 FasoMarket — Vendez au Burkina</p>
            </footer>
        </div>
    );
}
