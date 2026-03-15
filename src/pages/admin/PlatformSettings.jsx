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

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // General Settings State
  const [settings, setSettings] = useState({
    siteName: 'FasoMarket',
    slogan: "Le meilleur de l'artisanat local",
    commission: 5,
    fixedFee: 100,
    manualValidation: true,
    maintenanceMode: false
  });

  // Appearance State
  const [appearance, setAppearance] = useState({
    theme: 'light', // light, dark, system
    primaryColor: '#F97316', // Orange-500
    density: 'comfortable', // compact, comfortable
  });

  // Security State
  const [security, setSecurity] = useState({
    require2fa: false,
    sessionTimeout: 30,
    passwordLength: 8,
  });

  // Notification State
  const [notifications, setNotifications] = useState({
    emailOnOrder: true,
    emailOnNewVendor: true,
    pushOnReport: false,
    dailySummary: true,
  });

  // Payments State
  const [payments, setPayments] = useState({
    orangeMoneyKey: 'om_live_9a8b7c6d5e4f3g2h1',
    moovKey: 'moov_live_xyz123abc456',
    corisKey: '',
    showKeys: false
  });

  // API State
  const [api, setApi] = useState({
    webhookUrl: 'https://api.fasomarket.bf/v1/webhook',
    apiKey: 'fm_live_7x8y9z0a1b2c3d4e5f6g7h8i9j',
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Paramètres enregistrés avec succès !');
    }, 1000);
  };

  const generateNewApiKey = () => {
    if (window.confirm("Êtes-vous sûr ? L'ancienne clé API ne fonctionnera plus immédiatement.")) {
      const newKey = 'fm_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setApi({...api, apiKey: newKey});
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
              
              {/* TAB: GENERAL */}
              {activeTab === 'general' && (
                <div className="space-y-10 animate-in fade-in duration-300 flex-1">
                  <section>
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Identité du Site</h3>
                     <div className="space-y-6">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Nom de la Plateforme</label>
                           <input 
                             type="text" 
                             value={settings.siteName}
                             onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                             className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm" 
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Slogan</label>
                           <input 
                             type="text" 
                             value={settings.slogan}
                             onChange={(e) => setSettings({...settings, slogan: e.target.value})}
                             className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm" 
                           />
                        </div>
                     </div>
                  </section>

                  <section>
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Configuration des Commissions</h3>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Commission Vendeur (%)</label>
                           <div className="relative">
                              <input 
                                type="number" 
                                value={settings.commission}
                                onChange={(e) => setSettings({...settings, commission: e.target.value})}
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
                                value={settings.fixedFee}
                                onChange={(e) => setSettings({...settings, fixedFee: e.target.value})}
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm" 
                              />
                              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-400">CFA</span>
                           </div>
                        </div>
                     </div>
                  </section>

                  <section>
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Contrôle d'accès</h3>
                     <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.25rem] cursor-pointer hover:bg-gray-100 transition-all border border-gray-100">
                           <span className="text-sm font-bold text-gray-700">Valider manuellement les nouveaux vendeurs</span>
                           <input 
                             type="checkbox" 
                             checked={settings.manualValidation}
                             onChange={(e) => setSettings({...settings, manualValidation: e.target.checked})}
                             className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" 
                           />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.25rem] cursor-pointer hover:bg-gray-100 transition-all border border-gray-100">
                           <span className="text-sm font-bold text-gray-700">Mode maintenance (Admin seulement)</span>
                           <input 
                             type="checkbox" 
                             checked={settings.maintenanceMode}
                             onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                             className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" 
                           />
                        </label>
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
                            onClick={() => setAppearance({...appearance, theme: th})}
                            className={cn(
                              "border-2 rounded-2xl p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all",
                              appearance.theme === th ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                            )}
                          >
                            <Layout className={cn("w-6 h-6", appearance.theme === th ? "text-primary" : "text-gray-400")} />
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
                        {['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'].map((color) => (
                           <button 
                             key={color}
                             onClick={() => setAppearance({...appearance, primaryColor: color})}
                             className={cn(
                               "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                               appearance.primaryColor === color ? "ring-4 ring-offset-2 ring-primary scale-110" : "hover:scale-105"
                             )}
                             style={{ backgroundColor: color }}
                           >
                              {appearance.primaryColor === color && <Check className="text-white w-5 h-5" />}
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
                           <span className="text-sm font-bold text-gray-700">Exiger l'A2F (Authentification à 2 facteurs) pour les vendeurs</span>
                           <input 
                             type="checkbox" 
                             checked={security.require2fa}
                             onChange={(e) => setSecurity({...security, require2fa: e.target.checked})}
                             className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" 
                           />
                        </label>
                     </div>
                  </section>
                  <section>
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Exigences Mot de Passe & Sessions</h3>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Longueur minimale du mot de passe</label>
                           <input 
                             type="number" 
                             value={security.passwordLength}
                             onChange={(e) => setSecurity({...security, passwordLength: e.target.value})}
                             className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm" 
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Expiration de session (Minutes)</label>
                           <input 
                             type="number" 
                             value={security.sessionTimeout}
                             onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                             className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm" 
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
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.25rem] cursor-pointer hover:bg-gray-100 transition-all border border-gray-100">
                           <span className="text-sm font-bold text-gray-700">Email pour chaque nouvelle commande</span>
                           <input 
                             type="checkbox" 
                             checked={notifications.emailOnOrder}
                             onChange={(e) => setNotifications({...notifications, emailOnOrder: e.target.checked})}
                             className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" 
                           />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.25rem] cursor-pointer hover:bg-gray-100 transition-all border border-gray-100">
                           <span className="text-sm font-bold text-gray-700">Email pour nouvelle inscription vendeur</span>
                           <input 
                             type="checkbox" 
                             checked={notifications.emailOnNewVendor}
                             onChange={(e) => setNotifications({...notifications, emailOnNewVendor: e.target.checked})}
                             className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" 
                           />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.25rem] cursor-pointer hover:bg-gray-100 transition-all border border-gray-100">
                           <span className="text-sm font-bold text-gray-700">Recevoir un résumé quotidien des activités</span>
                           <input 
                             type="checkbox" 
                             checked={notifications.dailySummary}
                             onChange={(e) => setNotifications({...notifications, dailySummary: e.target.checked})}
                             className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" 
                           />
                        </label>
                     </div>
                  </section>
                  <section>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Notifications Push</h3>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.25rem] cursor-pointer hover:bg-gray-100 transition-all border border-gray-100">
                           <span className="text-sm font-bold text-gray-700">Push immédiat pour nouveau signalement produit</span>
                           <input 
                             type="checkbox" 
                             checked={notifications.pushOnReport}
                             onChange={(e) => setNotifications({...notifications, pushOnReport: e.target.checked})}
                             className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" 
                           />
                        </label>
                  </section>
                </div>
              )}

              {/* TAB: PAYMENTS */}
              {activeTab === 'payments' && (
               <div className="space-y-10 animate-in fade-in duration-300 flex-1">
                  <section>
                     <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Passerelles de Paiement</h3>
                        <button 
                          onClick={() => setPayments({...payments, showKeys: !payments.showKeys})}
                          className="text-xs font-bold text-primary flex items-center gap-2 hover:underline"
                        >
                          {payments.showKeys ? <><EyeOff size={14}/>Cacher</> : <><Eye size={14}/>Afficher clés</>}
                        </button>
                     </div>
                     <div className="space-y-6">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Clé API Orange Money</label>
                           <input 
                             type={payments.showKeys ? "text" : "password"} 
                             value={payments.orangeMoneyKey}
                             onChange={(e) => setPayments({...payments, orangeMoneyKey: e.target.value})}
                             placeholder="Entrez la clé de production"
                             className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm tracking-wide" 
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Clé API Moov Money</label>
                           <input 
                             type={payments.showKeys ? "text" : "password"} 
                             value={payments.moovKey}
                             onChange={(e) => setPayments({...payments, moovKey: e.target.value})}
                             placeholder="Entrez la clé de production"
                             className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm tracking-wide" 
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Clé d'intégration Coris Bank</label>
                           <input 
                             type={payments.showKeys ? "text" : "password"} 
                             value={payments.corisKey}
                             onChange={(e) => setPayments({...payments, corisKey: e.target.value})}
                             placeholder="Non configuré"
                             className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm tracking-wide" 
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
                                  {api.apiKey}
                               </p>
                               <p className="text-xs text-orange-600 font-bold">Ne partagez jamais cette clé publiquement.</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                               <button 
                                  onClick={() => copyToClipboard(api.apiKey)}
                                  className="p-2.5 bg-white text-orange-600 rounded-xl hover:bg-orange-100 transition-colors shadow-sm"
                                  title="Copier"
                               >
                                  {copiedKey ? <Check size={18}/> : <Copy size={18}/>}
                               </button>
                               <button 
                                  onClick={generateNewApiKey}
                                  className="p-2.5 bg-white text-orange-600 rounded-xl hover:bg-orange-100 transition-colors shadow-sm"
                                  title="Régénérer"
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
                          value={api.webhookUrl}
                          onChange={(e) => setApi({...api, webhookUrl: e.target.value})}
                          placeholder="https://..."
                          className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm" 
                        />
                        <p className="mt-2 text-xs text-gray-500 font-medium">Nous enverrons des requêtes POST à cette URL lors d'événements importants (nouvelles commandes, etc).</p>
                     </div>
                  </section>
                </div>
              )}

              {/* COMMON SAVE BUTTON */}
              <div className="pt-6 border-t border-gray-100 mt-auto">
                 <button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="w-full py-4 bg-primary text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:active:scale-100"
                 >
                    {isSaving ? (
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
    </div>
  );
}
