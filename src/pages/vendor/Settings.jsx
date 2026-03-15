import { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function VendorSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', icon: User, label: 'Mon Profil' },
    { id: 'store', icon: Store, label: 'Boutique' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'billing', icon: CreditCard, label: 'Paiements' },
    { id: 'security', icon: Shield, label: 'Sécurité' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
           <Store size={120} className="text-primary" />
        </div>
        
        <div className="relative flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-primary/10 p-1">
              <div className="w-full h-full rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjfHPJt9SUquylb4731VXtqTd1aCy_osO0BLg0ONBhC-qXuM-vB7EbTx5OdU7htXGS1ykUTzuhQa0nd4z0-Rd0ZgUFCVtu-foH_rUEDaT3hGwwp2h6eE3Y7df5gNESXKPMMdqT2rwuIogZhG3ep9O_fU6GrgTSyPQTi0qQdLR1xHHko-PkOOrukw_TR0s8GP8XiI7wTijXX8qIegHWcjNO70Mrpx-pxx8LEonMYWTZ9MHSzI_oC1Y0qdoVmCu9VyPKpGo3-mGwYyl-')" }}></div>
            </div>
            <button className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full border-4 border-white hover:scale-110 transition-transform shadow-lg shadow-primary/20">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Ibrahim Traoré</h2>
            <p className="text-slate-500 font-medium">Propriétaire de <span className="text-primary font-bold">Boutique Faso</span></p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
                  <Shield size={12} /> Vendeur Vérifié
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                  <Store size={12} /> Boutique Active
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Nav tabs */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab) => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id)}
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
        </div>

        {/* Content area */}
        <div className="md:col-span-3">
          <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-sm transition-all duration-300">
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 border-b border-primary/5 pb-4 mb-6">Mon Profil Personnel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" defaultValue="Ibrahim Traoré" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="email" defaultValue="ibrahim@fasomarket.bf" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" defaultValue="+226 25 30 00 00" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ville</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" defaultValue="Ouagadougou" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'store' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 border-b border-primary/5 pb-4 mb-6">Paramètres de la Boutique</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nom de la Boutique</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" defaultValue="Boutique Faso" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Numéro IFU</label>
                      <div className="relative">
                        <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" placeholder="0012345678X" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">URL de la Boutique</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" defaultValue="fasomarket.bf/boutique-faso" disabled className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 text-sm font-bold cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 text-slate-300" size={18} />
                        <textarea rows={4} defaultValue="Le meilleur de l'artisanat Burkinabé, fait main avec amour et tradition." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold resize-none" />
                      </div>
                    </div>
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
                      { id: 'orders', title: 'Nouvelles commandes', desc: 'Recevez une notification à chaque nouvelle commande.' },
                      { id: 'messages', title: 'Messages clients', desc: 'Alertes pour les nouveaux messages dans le chat.' },
                      { id: 'stock', title: 'Alerte de stock', desc: "Stock faible pour l'un de vos produits." },
                      { id: 'marketing', title: 'Marketing & Conseils', desc: 'Astuces pour booster vos ventes FasoMarket.' },
                    ].map((notif) => (
                      <div key={notif.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                        <div className="space-y-0.5">
                          <p className="text-sm font-black text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-500 font-medium">{notif.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={notif.id !== 'marketing'} />
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
                  <h3 className="text-xl font-black text-slate-900 border-b border-primary/5 pb-4 mb-6">Paiements & Billing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Numéro Orange Money</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
                        <input type="text" defaultValue="+226 70 00 00 00" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Numéro Moov Money</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                        <input type="text" placeholder="+226 01 00 00 00" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                      </div>
                    </div>
                    <div className="md:col-span-2 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <CheckCircle2 className="text-blue-600" size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-blue-900">Vérification de paiement active</p>
                        <p className="text-xs text-blue-700 font-medium leading-relaxed">Vos fonds sont versés automatiquement sur votre compte Orange Money chaque lundi.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 border-b border-primary/5 pb-4 mb-6">Sécurité du Compte</h3>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="password" placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="password" placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="password" placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-primary/5 space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                            <p className="text-sm font-black text-slate-900">Double authentification (2FA)</p>
                            <p className="text-xs text-slate-500 font-medium">Sécurisez votre compte avec un code par SMS.</p>
                         </div>
                         <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Activer</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-end">
               <button className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                  <Save size={18} />
                  Enregistrer {activeTab === 'security' ? 'le mot de passe' : 'les modifications'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

