import { useState, useEffect } from 'react';
import { 
  User, 
  Store, 
  Bell, 
  Shield, 
  CreditCard, 
  Save, 
  Camera,
  Mail,
  Phone,
  Lock,
  Smartphone,
  CheckCircle2,
  Globe,
  MapPin,
  Building2,
  Receipt,
  FileText,
  Loader2,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { authService } from '../../services/authService';
import { storeService } from '../../services/storeService';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';
import { useSettings } from '../../hooks/useSettings';
import { settingsService } from '../../services/settingsService';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

export default function VendorSettings() {
  const location = useLocation();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['profile', 'store', 'notifications', 'billing', 'security'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const { settings, loading, saving, save, setSettings } = useSettings('vendor');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);

  // Form states
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  const [storeData, setStoreData] = useState({ name: '', description: '', address: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userRes = await authService.getProfile();
      const userData = userRes.data.user || userRes.data;
      setUser(userData);
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });

      const storeRes = await vendorAdvancedService.getMyStore();
      const s = storeRes.data;
      setStore(s);
      setStoreData({
        name: s?.name || '',
        description: s?.description || '',
        address: s?.address || ''
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      const fd = new FormData();
      fd.append('name', profileData.name);
      fd.append('email', profileData.email);
      fd.append('phone', profileData.phone);
      
      const res = await settingsService.updateProfile(fd);
      setUser(res.data.user);
      authService.saveSession(localStorage.getItem('fasomarket_token'), res.data.user);
      setMessage({ type: 'success', text: 'Profil mis à jour !' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    }
  };

  const handleVendorSettingSave = async (updateFn, data) => {
    const result = await save(updateFn, data);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('logo', file);
      await storeService.update(store._id, formData);
      setMessage({ type: 'success', text: 'Logo mis à jour !' });
      fetchUserData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur logo.' });
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords mismatch.' });
      return;
    }
    try {
      await settingsService.changePassword(passwordData);
      setMessage({ type: 'success', text: 'Password changed !' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error.' });
    }
  };

  const handleStoreSave = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await storeService.update(store._id, storeData);
      setMessage({ type: 'success', text: 'Informations de la boutique mises à jour !' });
      fetchUserData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour de la boutique.' });
    }
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Mon Profil' },
    { id: 'store', icon: Store, label: 'Boutique' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'billing', icon: CreditCard, label: 'Paiements' },
    { id: 'security', icon: Shield, label: 'Sécurité' },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
           <Store size={120} className="text-primary" />
        </div>
        
        <div className="relative flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-primary/10 p-1 bg-slate-100 flex items-center justify-center overflow-hidden">
              {store?.logo ? (
                <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Store size={48} className="text-slate-300" />
              )}
            </div>
            <label className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full border-4 border-white hover:scale-110 transition-transform shadow-lg shadow-primary/20 cursor-pointer">
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              <Camera size={16} />
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{user?.fullName}</h2>
            <p className="text-slate-500 font-medium">Propriétaire de <span className="text-primary font-bold">{store?.name || 'Votre boutique'}</span></p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
                  <Shield size={12} /> {user?.vendorStatus === 'approved' ? 'Vendeur Vérifié' : 'En attente'}
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                  <Store size={12} /> Boutique Active
               </div>
            </div>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-3 font-bold animate-in fade-in zoom-in-95",
          message.type === 'success' ? "bg-green-50 border border-green-100 text-green-600" : "bg-red-50 border border-red-100 text-red-600"
        )}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Nav tabs */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab) => (
             <button 
               key={tab.id} 
               onClick={() => { setActiveTab(tab.id); setMessage({ type: '', text: '' }); }}
               className={cn(
                 "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all border border-transparent",
                 activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-600 hover:bg-white hover:text-primary hover:border-primary/10"
               )}
             >
                <tab.icon size={18} />
                {tab.label}
             </button>
          ))}
          <button 
            onClick={() => { authService.logout(); window.location.href = '/login'; }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>

        {/* Content area */}
        <div className="md:col-span-3">
          <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-sm transition-all duration-300">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSave} className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 border-b border-primary/5 pb-4 mb-6">Mon Profil Personnel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="text" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" 
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="email" 
                          value={profileData.email}
                          disabled
                          className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl outline-none transition-all text-sm font-bold text-slate-400 cursor-not-allowed" 
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="text" 
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                    <Save size={18} />
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'store' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <form onSubmit={handleStoreSave} className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 border-b border-primary/5 pb-4 mb-6">Identité de la Boutique</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-400 uppercase">Nom de la Boutique</label>
                      <input 
                        type="text"
                        value={storeData.name}
                        onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-400 uppercase">Description</label>
                      <textarea 
                        rows={3}
                        value={storeData.description}
                        onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                      Sauvegarder les détails
                    </button>
                  </div>
                </form>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-xl font-black text-slate-900 border-b border-primary/5 pb-4 mb-6">Comportement & Paramètres</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <label className="text-xs font-black text-slate-400 uppercase">Montant Minimum Commande (FCFA)</label>
                          <input 
                            type="number"
                            value={settings?.store?.minOrderAmount || 0}
                            onChange={(e) => setSettings({ ...settings, store: { ...settings.store, minOrderAmount: e.target.value } })}
                            className="w-full px-4 py-3 bg-slate-50 border rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none"
                          />
                       </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border cursor-pointer hover:border-primary/20 transition-all">
                        <div>
                          <p className="text-sm font-black">Mode Vacances</p>
                          <p className="text-[10px] text-slate-500 font-bold">Désactive temporairement l'achat de vos produits.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-primary"
                          checked={!!settings?.store?.vacationMode}
                          onChange={(e) => handleVendorSettingSave(settingsService.updateStoreSettings, { ...settings.store, vacationMode: e.target.checked })}
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border cursor-pointer hover:border-primary/20 transition-all">
                        <div>
                          <p className="text-sm font-black">Réponse Automatique</p>
                          <p className="text-[10px] text-slate-500 font-bold">Répondre automatiquement aux nouveaux messages.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-primary"
                          checked={!!settings?.store?.autoReply}
                          onChange={(e) => handleVendorSettingSave(settingsService.updateStoreSettings, { ...settings.store, autoReply: e.target.checked })}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end pt-6">
                     <button 
                      onClick={() => handleVendorSettingSave(settingsService.updateStoreSettings, settings.store)}
                      className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                     >
                       Appliquer les changements
                     </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 border-b border-primary/5 pb-4 mb-6">Préférences de Notifications</h3>
                  <div className="space-y-6">
                    {[
                      { id: 'newOrder', title: 'Nouvelles commandes', desc: 'Recevez une notification à chaque nouvelle commande.' },
                      { id: 'chatMessages', title: 'Messages clients', desc: 'Alertes pour les nouveaux messages dans le chat.' },
                      { id: 'lowStock', title: 'Alerte de stock', desc: "Stock faible pour l'un de vos produits." },
                      { id: 'storeNews', title: 'News FasoMarket', desc: 'Astuces pour booster vos ventes FasoMarket.' },
                    ].map((notif) => (
                      <div key={notif.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                        <div className="space-y-0.5">
                          <p className="text-sm font-black text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-500 font-medium">{notif.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={!!settings?.notifications?.[notif.id]} 
                            onChange={(e) => handleVendorSettingSave(settingsService.updateVendorNotifications, { ...settings.notifications, [notif.id]: e.target.checked })}
                          />
                          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 border-b border-primary/5 pb-4 mb-6">Paiements & Retraits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Numéro Orange Money</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
                        <input 
                          type="text" 
                          value={settings?.payment?.phoneOrange || ''}
                          onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, phoneOrange: e.target.value } })}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" 
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Numéro Moov Money</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                        <input 
                          type="text" 
                          value={settings?.payment?.phoneMoov || ''}
                          onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, phoneMoov: e.target.value } })}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold" 
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                       <label className="block text-xs font-black text-slate-400 uppercase ml-1">Méthode Préférée</label>
                       <select 
                        value={settings?.payment?.preferredMethod || 'orange'}
                        onChange={(e) => handleVendorSettingSave(settingsService.updatePaymentSettings, { ...settings.payment, preferredMethod: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border rounded-2xl font-bold"
                       >
                         <option value="orange">Orange Money</option>
                         <option value="moov">Moov Money</option>
                       </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                   <button 
                    onClick={() => handleVendorSettingSave(settingsService.updatePaymentSettings, settings.payment)}
                    className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20"
                   >
                     Sauvegarder les infos de paiement
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSave} className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 border-b border-primary/5 pb-4 mb-6">Sécurité du Compte</h3>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                            type="password" 
                            required
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            placeholder="••••••••" 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                            type="password" 
                            required
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="••••••••" 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                            type="password" 
                            required
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="••••••••" 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-primary/5 space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                            <p className="text-sm font-black text-slate-900">Double authentification (2FA)</p>
                            <p className="text-xs text-slate-500 font-medium">Sécurisez votre compte avec un code par SMS.</p>
                         </div>
                         <button type="button" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Activer</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={saving} className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50">
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Enregistrer le mot de passe
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

