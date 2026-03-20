import { useState } from 'react';
import { 
  Globe, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Save, 
  Layout,
  Smartphone,
  Server,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '../../utils/cn';


const tabs = [
  { id: 'general', icon: Globe, label: 'Général & SEO' },
  { id: 'appearance', icon: Layout, label: 'Apparence & Thème' },
  { id: 'security', icon: Lock, label: 'Sécurité & Accès' },
  { id: 'notifications', icon: Bell, label: 'Push & Emails' },
  { id: 'payments', icon: CreditCard, label: 'Frais & Commissions' },
  { id: 'api', icon: Server, label: 'Clés API & Webhooks' },
];

import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../contexts/ThemeContext';
import { settingsService } from '../../services/settingsService';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../contexts/ToastContext';

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const { settings, loading, saving, save, setSettings } = useSettings('admin');
  const { theme, updateTheme } = useTheme();
  const [copiedKey, setCopiedKey] = useState(false);
  const [isApiKeyConfirmOpen, setIsApiKeyConfirmOpen] = useState(false);
  const { showToast } = useToast();

  if (loading) return <div className="p-20 text-center font-black animate-pulse">Chargement des paramètres...</div>;

  const handleAdminSave = async (updateFn, data, msg) => {
    const res = await save(updateFn, data, msg);
    if (!res.success) showToast(res.message || 'Erreur lors de la sauvegarde', 'error');
    else showToast(msg, 'success');
  };

  const generateNewApiKey = async () => {
    try {
      const res = await settingsService.regenerateApiKey();
      setSettings({ ...settings, api: { ...settings.api, apiKey: res.data.apiKey } });
      showToast('Clé API régénérée avec succès', 'success');
    } catch (err) {
      showToast("Erreur lors de la régénération", 'error');
    } finally {
      setIsApiKeyConfirmOpen(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Paramètres de la Plateforme</h1>
        <p className="text-gray-500 mt-1">Configurez les réglages globaux du système FasoMarket.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Nav tabs */}
        <div className="md:col-span-1 space-y-2">
          {tabs.map((item) => (
             <button 
               key={item.id} 
               onClick={() => setActiveTab(item.id)}
               className={cn(
                 "flex items-center gap-3 w-full px-5 py-4 rounded-[1.25rem] text-sm font-black transition-all border outline-none",
                 activeTab === item.id 
                  ? "bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-200" 
                  : "bg-white text-gray-500 hover:text-gray-900 border-gray-100 hover:border-gray-200"
               )}
             >
                <item.icon size={20} className={activeTab === item.id ? "text-primary" : ""} />
                {item.label}
             </button>
          ))}
        </div>

        {/* Form area */}
        <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 min-h-[500px] flex flex-col">
               {activeTab === 'general' && (
                 <div className="space-y-10 animate-in fade-in duration-300 flex-1">
                   <section>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Configuration des Commissions</h3>
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Commission Vendeur (%)</label>
                            <div className="relative">
                               <input 
                                 type="number" 
                                 value={settings?.billing?.commission}
                                 onChange={(e) => setSettings({...settings, billing: { ...settings.billing, commission: e.target.value }})}
                                 className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm" 
                               />
                               <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-400">%</span>
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Frais Fixes (FCFA)</label>
                            <div className="relative">
                               <input 
                                 type="number" 
                                 value={settings?.billing?.fixedFee}
                                 onChange={(e) => setSettings({...settings, billing: { ...settings.billing, fixedFee: e.target.value }})}
                                 className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm" 
                               />
                               <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-400">CFA</span>
                            </div>
                         </div>
                      </div>
                   </section>
                 </div>
               )}
 
               {/* TAB: APPEARANCE */}
               {activeTab === 'appearance' && (
                 <div className="space-y-10 animate-in fade-in duration-300 flex-1">
                   <section>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Thème Global</h3>
                      <div className="grid grid-cols-3 gap-4">
                         {['light', 'dark', 'system'].map((th) => (
                           <div 
                             key={th}
                             onClick={() => updateTheme({...theme, mode: th})}
                             className={cn(
                               "border-2 rounded-2xl p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all",
                               theme.mode === th ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                             )}
                           >
                             <Layout className={cn("w-6 h-6", theme.mode === th ? "text-primary" : "text-gray-400")} />
                             <span className="text-xs font-black uppercase tracking-widest text-gray-600">
                               {th === 'light' ? 'Clair' : th === 'dark' ? 'Sombre' : 'Système'}
                             </span>
                           </div>
                         ))}
                      </div>
                   </section>
                   <section>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Couleur Principale</h3>
                      <div className="flex gap-4">
                         {['#16a34a', '#3B82F6', '#f97316', '#8B5CF6', '#EC4899'].map((color) => (
                            <button 
                              key={color}
                              onClick={() => updateTheme({...theme, primaryColor: color})}
                              className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                                theme.primaryColor === color ? "ring-4 ring-offset-2 ring-primary scale-110" : "hover:scale-105"
                              )}
                              style={{ backgroundColor: color }}
                            >
                               {theme.primaryColor === color && <Check className="text-white w-5 h-5" />}
                            </button>
                         ))}
                      </div>
                   </section>
                 </div>
               )}
 
               {/* TAB: SECURITY */}
               {activeTab === 'security' && (
                 <div className="space-y-10 animate-in fade-in duration-300 flex-1">
                   <section>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Politique d'Accès</h3>
                      <div className="space-y-4">
                         <label className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.25rem] cursor-pointer hover:bg-gray-100 transition-all border border-gray-100">
                            <span className="text-sm font-bold text-gray-700">Exiger l'A2F pour les vendeurs</span>
                            <input 
                              type="checkbox" 
                              checked={settings?.security?.require2fa}
                              onChange={(e) => handleAdminSave(settingsService.updateSecurity, { ...settings.security, require2fa: e.target.checked })}
                              className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" 
                            />
                         </label>
                      </div>
                   </section>
                   <section>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Exigences</h3>
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Longueur Min Mot de Passe</label>
                            <input 
                              type="number" 
                              value={settings?.security?.passwordLength}
                              onChange={(e) => setSettings({...settings, security: { ...settings.security, passwordLength: e.target.value }})}
                              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" 
                            />
                         </div>
                      </div>
                   </section>
                 </div>
               )}
 
               {/* TAB: NOTIFICATIONS */}
               {activeTab === 'notifications' && (
                <div className="space-y-10 animate-in fade-in duration-300 flex-1">
                   <section>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Préférences Email (Admin)</h3>
                      <div className="space-y-4">
                         {[
                           { id: 'emailOnOrder', label: 'Email pour chaque commande' },
                           { id: 'emailOnNewVendor', label: 'Email pour nouvelle inscription vendeur' },
                           { id: 'dailySummary', label: 'Résumé quotidien des activités' },
                         ].map(n => (
                           <label key={n.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.25rem] cursor-pointer hover:bg-gray-100 transition-all border border-gray-100">
                              <span className="text-sm font-bold text-gray-700">{n.label}</span>
                              <input 
                                type="checkbox" 
                                checked={settings?.notifications?.[n.id]}
                                onChange={(e) => handleAdminSave(settingsService.updateAdminNotifications, { ...settings.notifications, [n.id]: e.target.checked })}
                                className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" 
                              />
                           </label>
                         ))}
                      </div>
                   </section>
                 </div>
               )}
 
               {/* TAB: PAYMENTS */}
               {activeTab === 'payments' && (
                <div className="space-y-10 animate-in fade-in duration-300 flex-1">
                   <section>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Passerelles de Paiement</h3>
                      <div className="space-y-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Clé API Orange Money</label>
                            <input 
                              type="password"
                              value={settings?.billing?.orangeMoneyKey}
                              onChange={(e) => setSettings({...settings, billing: { ...settings.billing, orangeMoneyKey: e.target.value }})}
                              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm tracking-wide" 
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Clé API Moov Money</label>
                            <input 
                              type="password"
                              value={settings?.billing?.moovKey}
                              onChange={(e) => setSettings({...settings, billing: { ...settings.billing, moovKey: e.target.value }})}
                              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm tracking-wide" 
                            />
                         </div>
                      </div>
                   </section>
                 </div>
               )}
 
               {/* TAB: API */}
               {activeTab === 'api' && (
                <div className="space-y-10 animate-in fade-in duration-300 flex-1">
                   <section>
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Clé API Globale (Admin)</h3>
                       <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 p-5 bg-orange-50 rounded-[1.25rem] border border-orange-100 flex items-center justify-between">
                             <div className="space-y-1 w-full mr-4">
                                <p className="text-sm font-black text-orange-900 font-mono tracking-widest break-all">
                                   {settings?.api?.apiKey}
                                </p>
                             </div>
                             <div className="flex gap-2 shrink-0">
                                <button 
                                   onClick={() => copyToClipboard(settings?.api?.apiKey)}
                                   className="p-2.5 bg-white text-orange-600 rounded-xl hover:bg-orange-100 transition-colors shadow-sm"
                                >
                                   {copiedKey ? <Check size={18}/> : <Copy size={18}/>}
                                </button>
                                <button 
                                   onClick={() => setIsApiKeyConfirmOpen(true)}
                                   className="p-2.5 bg-white text-orange-600 rounded-xl hover:bg-orange-100 transition-colors shadow-sm"
                                >
                                   <RefreshCw size={18}/>
                                </button>
                             </div>
                          </div>
                       </div>
                   </section>
                   <section>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Configuration Webhook</h3>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">URL du Endpoint Webhook</label>
                         <input 
                           type="url" 
                           value={settings?.api?.webhookUrl}
                           onChange={(e) => setSettings({...settings, api: { ...settings.api, webhookUrl: e.target.value }})}
                           className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" 
                         />
                      </div>
                   </section>
                 </div>
               )}
 
               <div className="pt-6 border-t border-gray-100 mt-auto">
                  <button 
                    onClick={() => {
                      if (activeTab === 'general') handleAdminSave(settingsService.updateBilling, settings.billing, 'Frais mis à jour');
                      if (activeTab === 'security') handleAdminSave(settingsService.updateSecurity, settings.security, 'Sécurité mise à jour');
                      if (activeTab === 'notifications') handleAdminSave(settingsService.updateAdminNotifications, settings.notifications, 'Notifications mises à jour');
                      if (activeTab === 'payments') handleAdminSave(settingsService.updateBilling, settings.billing, 'Clés de paiement mises à jour');
                      if (activeTab === 'api') handleAdminSave(settingsService.updateApi, settings.api, 'API configurée');
                      if (activeTab === 'appearance') handleAdminSave(settingsService.updateTheme, theme, 'Thème sauvegardé');
                    }}
                    disabled={saving}
                    className="w-full py-4 bg-primary text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:active:scale-100"
                  >
                     {saving ? (
                       <span className="flex items-center gap-2">
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         Sauvegarde...
                       </span>
                     ) : (
                       <>
                         <Save size={20} /> Enregistrer les réglages
                       </>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>

      <ConfirmModal
        isOpen={isApiKeyConfirmOpen}
        onClose={() => setIsApiKeyConfirmOpen(false)}
        onConfirm={generateNewApiKey}
        title="Régénérer la clé API"
        message="Êtes-vous sûr ? L'ancienne clé API ne fonctionnera plus immédiatement."
        confirmLabel="Oui, régénérer"
        variant="warning"
      />
    </div>
  );
}
