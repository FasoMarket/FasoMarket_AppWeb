import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, ArrowLeft, LogOut, ShoppingBag, Star, BadgeDollarSign, 
  MapPin, Plus, Trash2, Check, Shield, BellRing, BarChart2, LocateFixed,
  User, Mail, Phone, Save, Camera, AlertCircle, Lock, Loader2
} from 'lucide-react';
import { authService } from '../services/authService';
import { settingsService } from '../services/settingsService';
import { clientAdvancedService } from '../services/clientAdvancedService';
import ConfirmModal from '../components/ConfirmModal';
import { cn } from '../utils/cn';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'stats', 'address', 'security', 'notifs'
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: null,
    notificationPrefs: user?.notificationPrefs || { email: true, push: true, sms: false }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [stats, setStats] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
      label: 'Domicile', fullName: '', phone: '', city: 'Ouagadougou', street: '', district: '', isDefault: false
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authService.getProfile();
        const userData = res.data.user || res.data;
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          avatar: null,
          notificationPrefs: userData.notificationPrefs || { email: true, push: true, sms: false }
        });

        // Advanced client data
        const [statsRes, addrRes] = await Promise.all([
            clientAdvancedService.getClientStats().catch(()=>({data:{stats:{}}})),
            clientAdvancedService.getAddresses().catch(()=>({data:{addresses:[]}}))
        ]);
        setStats(statsRes.data.stats);
        setAddresses(addrRes.data.addresses);
      } catch (err) {
        console.error('Erreur chargement profil:', err);
      }
    };
    loadProfile();
  }, []);

  const fetchAddresses = async () => {
      try {
          const res = await clientAdvancedService.getAddresses();
          setAddresses(res.data.addresses || []);
      } catch (err) { console.error(err); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('email', formData.email);
      fd.append('phone', formData.phone);
      if (formData.avatar) fd.append('avatar', formData.avatar);

      const res = await settingsService.updateProfile(fd);
      const updatedUser = res.data.user || res.data;
      setUser(updatedUser);
      authService.saveSession(localStorage.getItem('fasomarket_token'), updatedUser);
      setSuccess('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (prefs) => {
    try {
      await settingsService.updateUserNotifications(prefs);
      setFormData(prev => ({ ...prev, notificationPrefs: prefs }));
      setSuccess('Préférences de notifications mises à jour !');
    } catch (err) {
      setError('Erreur lors de la mise à jour des notifications');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await settingsService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Mot de passe modifié avec succès !');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Mot de passe actuel incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };
  
  const confirmLogout = () => {
    authService.logout();
    navigate('/', { replace: true });
  };

  const handleSaveAddress = async (e) => {
      e.preventDefault();
      try {
          if (editingAddressId) {
              await clientAdvancedService.updateAddress(editingAddressId, addressForm);
              setSuccess('Adresse modifiée !');
          } else {
              await clientAdvancedService.createAddress(addressForm);
              setSuccess('Nouvelle adresse ajoutée !');
          }
          setShowAddressModal(false);
          fetchAddresses();
      } catch (err) {
          setError(err.response?.data?.message || 'Erreur adresse');
      }
  };

  const handleDeleteAddress = async (id) => {
      if (!window.confirm('Supprimer cette adresse ?')) return;
      try {
          await clientAdvancedService.deleteAddress(id);
          fetchAddresses();
          setSuccess('Adresse supprimée.');
      } catch (err) { setError('Erreur suppression'); }
  };

  const handleSetDefaultAddress = async (id) => {
      try {
          await clientAdvancedService.setDefaultAddress(id);
          fetchAddresses();
      } catch (err) { setError('Erreur favori'); }
  };

  const [locating, setLocating] = useState(false);
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // In a real app, we would reverse geocode here.
        // For now, we fill the description and let the user know.
        setAddressForm(prev => ({
          ...prev,
          street: `${prev.street} (Coordonnées: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`.trim()
        }));
        setLocating(false);
        setSuccess("Position détectée avec succès !");
      },
      (err) => {
        console.error(err);
        setLocating(false);
        setError("Impossible de déterminer votre position");
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-[#f8fafc]/50">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-slate-100 pb-12">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200 transition-all group-hover:border-primary duration-300">
               {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={32} />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-xl rounded-2xl flex items-center justify-center text-[#17cf54] cursor-pointer hover:bg-[#17cf54] hover:text-white transition-all">
              <Camera size={18} />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setFormData({ ...formData, avatar: e.target.files[0] })} />
            </label>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{user?.name || "Paramètres"}</h1>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-md">Client</span>
            </div>
            <p className="text-slate-400 text-xs font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
            onClick={() => navigate('/my-orders')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#17cf54]/5 border border-[#17cf54]/20 rounded-xl text-[#17cf54] font-bold text-xs hover:bg-[#17cf54]/10 transition-all active:scale-95"
          >
            <ShoppingBag size={16} />
            Mes Commandes
          </button>
           <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all active:scale-95"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-100 rounded-xl text-red-500 font-bold text-xs hover:bg-red-50 transition-all active:scale-95"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      <div className="max-w-5xl mx-auto mb-8">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-[1.5rem] flex items-center gap-4 text-sm font-bold animate-in slide-in-from-top-4 duration-300">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-6 py-4 rounded-[1.5rem] flex items-center gap-4 text-sm font-bold animate-in slide-in-from-top-4 duration-300">
            <CheckCircle size={20} />
            {success}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Navigation Tabs */}
        <aside className="lg:col-span-3 space-y-2">
            {[
                { id: 'info',  label: 'Informations', icon: User },
                { id: 'stats', label: 'Statistiques', icon: BarChart2 },
                { id: 'address', label: 'Adresses', icon: MapPin },
                { id: 'security', label: 'Sécurité', icon: Shield },
                { id: 'notifs', label: 'Notifications', icon: BellRing },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => {
                        const target = document.getElementById(`section-${tab.id}`);
                        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setActiveTab(tab.id);
                    }}
                    className={cn(
                        "w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 font-bold text-sm text-left group",
                        activeTab === tab.id 
                            ? "bg-primary/5 text-primary" 
                            : "text-slate-500 hover:bg-slate-50"
                    )}
                >
                    <tab.icon size={18} className={cn(activeTab === tab.id ? "text-primary" : "text-slate-400")} />
                    {tab.label}
                </button>
            ))}
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-12">
            
            {/* Stats Dashboard */}
            <section id="section-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <ShoppingBag size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commandes</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.totalOrders || 0}</p>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#17cf54]/10 group-hover:text-[#17cf54] transition-colors">
                      <BadgeDollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dépensé</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {(stats?.totalSpent || 0).toLocaleString()} 
                      <span className="text-xs font-medium ml-1 text-slate-400">FCFA</span>
                    </p>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
                      <Star size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avis</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.totalReviews || 0}</p>
                  </div>
              </div>
            </section>

            {/* General Info */}
            <section id="section-info" className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">Profil</h2>
                </div>
                
                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17cf54] transition-colors" size={20} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54]/20 focus:bg-white focus:border-[#17cf54] outline-none font-bold text-slate-700 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 opacity-60">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email <span className="text-[8px] italic">(Non modifiable)</span></label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full pl-14 pr-6 py-5 bg-slate-100 border border-slate-200 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 focus-within:translate-x-1 transition-transform md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Numéro de téléphone</label>
                        <div className="relative group">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17cf54] transition-colors" size={20} />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54]/20 focus:bg-white focus:border-[#17cf54] outline-none font-bold text-slate-700 transition-all"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-[#17cf54] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#12a643] transition-all shadow-xl shadow-[#17cf54]/20 disabled:bg-slate-300 active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer le profil</>}
                        </button>
                    </div>
                </form>
            </section>

            {/* Addresses */}
            <section id="section-address" className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Adresses</h2>
                    <button 
                        onClick={() => {
                            setEditingAddressId(null);
                            setAddressForm({ label: 'Domicile', fullName: user?.name, phone: user?.phone, city: 'Ouagadougou', street: '', district: '', isDefault: false });
                            setShowAddressModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all active:scale-95"
                    >
                        <Plus size={14} /> Ajouter
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.length === 0 ? (
                        <div className="md:col-span-2 py-8 text-center border border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-400 font-medium text-sm">Aucune adresse enregistrée</p>
                        </div>
                    ) : (
                        addresses.map(address => (
                            <div key={address._id} className="p-6 border border-slate-100 rounded-xl bg-slate-50/30 flex flex-col justify-between group hover:border-primary/20 transition-all">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#17cf54] transition-colors">
                                            <MapPin size={20} />
                                        </div>
                                        {address.isDefault && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">Par Défaut</span>}
                                    </div>
                                    <h4 className="font-black text-lg text-slate-900 mb-1">{address.label}</h4>
                                    <p className="text-xs font-bold text-slate-500 mb-4">{address.fullName}</p>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-400 italic leading-relaxed">{address.street}, {address.district}</p>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{address.city} — <span className="text-[#17cf54]">{address.phone}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDeleteAddress(address._id)} className="flex-1 py-3 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all">Supprimer</button>
                                    {!address.isDefault && (
                                        <button onClick={() => handleSetDefaultAddress(address._id)} className="flex-1 py-3 text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 rounded-xl transition-all">Favoris</button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Security & Password */}
            <section id="section-security" className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">Sécurité</h2>
                </div>
                
                <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                    <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ancien mot de passe</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17cf54]" size={20} />
                            <input
                                type="password"
                                required
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#17cf54] focus:ring-2 focus:ring-[#17cf54]/20 outline-none font-bold text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17cf54]" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#17cf54] focus:ring-2 focus:ring-[#17cf54]/20 outline-none font-bold text-slate-700"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmation</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17cf54]" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#17cf54] focus:ring-2 focus:ring-[#17cf54]/20 outline-none font-bold text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-black/10 disabled:bg-slate-300 active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Shield size={20} /> Mettre à jour la sécurité</>}
                    </button>
                </form>
            </section>

            {/* Notifications */}
            <section id="section-notifs" className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 animate-in fade-in duration-500 pb-20">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { id: 'email', label: 'E-mails Directs', desc: 'Commandes & Factures', color: 'bg-blue-50 text-blue-500' },
                        { id: 'push', label: 'Alertes Push', desc: 'Activités en Temps Réel', color: 'bg-[#17cf54]/10 text-[#17cf54]' },
                        { id: 'sms', label: 'Alertes SMS', desc: 'Suivi Urgent des Colis', color: 'bg-amber-50 text-amber-500' }
                    ].map(pref => (
                        <div key={pref.id} className="p-8 border border-slate-50 bg-slate-50/20 rounded-[2rem] flex flex-col justify-between hover:border-[#17cf54]/30 hover:bg-white hover:shadow-xl transition-all duration-500">
                             <div className="mb-8 text-center sm:text-left">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 mx-auto sm:mx-0", pref.color)}>
                                    <BellRing size={24} />
                                </div>
                                <p className="font-black text-slate-900 text-lg mb-1">{pref.label}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pref.desc}</p>
                             </div>
                             <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{formData.notificationPrefs[pref.id] ? 'Activé' : 'Désactivé'}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={formData.notificationPrefs[pref.id]}
                                        onChange={(e) => handleNotificationUpdate({ ...formData.notificationPrefs, [pref.id]: e.target.checked })}
                                    />
                                    <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#17cf54] shadow-inner"></div>
                                </label>
                             </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={confirmLogout}
        title="Déconnexion"
        message="Voulez-vous vraiment quitter votre session ? Vos données sont en sécurité."
        confirmLabel="Oui, se déconnecter"
        variant="danger"
      />

      {/* Modal Ajout/Edit Adresse - Redesigned */}
      {showAddressModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#17cf54]/10 text-[#17cf54] rounded-2xl flex items-center justify-center">
                          <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 italic tracking-tight">Nouvelle Destination</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ajouter une adresse de livraison</p>
                      </div>
                  </div>
                  <form onSubmit={handleSaveAddress} className="p-10 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1.5 col-span-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label</label>
                              <input type="text" required value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} placeholder="Ex: Maison, Bureau..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54]/20 font-bold outline-none text-slate-700" />
                          </div>
                          <div className="space-y-1.5 col-span-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ville</label>
                              <select value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54]/20 font-bold outline-none text-slate-700 appearance-none cursor-pointer">
                                  <option value="Ouagadougou">Ouagadougou</option>
                                  <option value="Bobo-Dioulasso">Bobo-Dioulasso</option>
                                  <option value="Koudougou">Koudougou</option>
                              </select>
                          </div>
                          <div className="space-y-1.5 col-span-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom du destinataire</label>
                              <input type="text" required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54]/20 font-bold outline-none text-slate-700" />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                              <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone Direct</label>
                                <button 
                                    type="button" 
                                    onClick={handleGetLocation}
                                    disabled={locating}
                                    className="flex items-center gap-1.5 text-[9px] font-bold text-primary hover:text-primary-dark transition-colors"
                                >
                                    {locating ? <Loader2 size={10} className="animate-spin" /> : <LocateFixed size={10} />}
                                    {locating ? 'Détection...' : 'Me géolocaliser'}
                                </button>
                              </div>
                              <input type="tel" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} placeholder="Ex: +226 00 00 00 00" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54]/20 font-bold outline-none text-slate-700" />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quartier</label>
                              <input type="text" required value={addressForm.district} onChange={e => setAddressForm({...addressForm, district: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54]/20 font-bold outline-none text-slate-700" />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                              <input type="text" required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} placeholder="Porte, repère..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#17cf54]/20 font-bold outline-none text-slate-700" />
                          </div>
                      </div>
                      <div className="pt-8 flex gap-4">
                          <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 py-5 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Annuler</button>
                          <button type="submit" className="flex-1 py-5 bg-[#17cf54] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#17cf54]/20 active:scale-95 transition-all">Sauvegarder</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Aesthetic Footer */}
      <footer className="max-w-5xl mx-auto py-12 text-center border-t border-slate-100 mt-20">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2">FasoMarket Identity System</p>
          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">© 2026 — Built for Excellence</p>
      </footer>
    </div>
  );
}
