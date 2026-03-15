import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus,
  Mail,
  Ban,
  History,
  ShieldCheck,
  MoreHorizontal,
  X,
  User,
  Phone,
  ChevronDown,
  Lock,
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '../../utils/cn';


const initialUsers = [
  { id: 1, name: 'Amadou Traoré', email: 'amadou@email.com', phone: '+226 71 22 33 44', joined: 'Jan 2024', orders: 12, spent: '125.000 FCFA', status: 'Actif', password: 'password123' },
  { id: 2, name: 'Kadidia Diallo', email: 'kadidia@email.com', phone: '+226 76 11 22 33', joined: 'Fév 2024', orders: 4, spent: '18.500 FCFA', status: 'Actif', password: 'password123' },
  { id: 3, name: 'Ibrahim Sanou', email: 'ibrahim@email.com', phone: '+226 70 88 77 66', joined: 'Mar 2024', orders: 0, spent: '0 FCFA', status: 'Banni', password: 'password123' },
  { id: 4, name: 'Sali Zongo', email: 'sali@email.com', phone: '+226 75 44 55 66', joined: 'Mai 2024', orders: 2, spent: '4.200 FCFA', status: 'Actif', password: 'password123' },
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  
  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Filtering logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Tous' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Actif' ? 'Banni' : 'Actif' };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(users.filter(u => u.id !== id));
    }
    setActiveDropdown(null);
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUserId(user.id);
      setFormData({ name: user.name, email: user.email, phone: user.phone, password: user.password || '' });
    } else {
      setEditingUserId(null);
      setFormData({ name: '', email: '', phone: '', password: '' });
    }
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (editingUserId) {
      setUsers(users.map(u => u.id === editingUserId ? { ...u, ...formData } : u));
    } else {
      const date = new Date();
      const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
      const joinedStr = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      const userToAdd = {
        ...formData,
        id: Date.now(),
        joined: joinedStr,
        orders: 0,
        spent: '0 FCFA',
        status: 'Actif'
      };
      setUsers([userToAdd, ...users]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-500">Visualisez et gérez les comptes clients de la plateforme.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg active:scale-95"
        >
          <UserPlus size={18} />
          Ajouter Client
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium" 
            placeholder="Rechercher par nom, email ou téléphone..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
             <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold text-gray-600 cursor-pointer"
             >
                <option value="Tous">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="Banni">Banni</option>
             </select>
             <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-visible">
        <div className="overflow-x-visible">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
              <tr>
                <th className="px-8 py-5">Client</th>
                <th className="px-6 py-5">Contact</th>
                <th className="px-6 py-5">Commandes</th>
                <th className="px-6 py-5">Dépenses</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium pb-24">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white flex items-center justify-center text-gray-400 font-black text-xs uppercase shadow-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                       </div>
                       <div>
                          <div className="font-black text-gray-900 group-hover:text-primary transition-colors">{user.name}</div>
                          <div className="text-gray-400 text-[10px] uppercase font-black tracking-widest mt-0.5">Membre depuis {user.joined}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={12} className="text-gray-400" />
                          {user.email}
                       </div>
                       <div className="text-xs text-gray-400">{user.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-black">{user.orders}</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-gray-900">{user.spent}</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1",
                      user.status === 'Actif' ? "bg-green-50 text-green-600 ring-green-100" : "bg-red-50 text-red-600 ring-red-100"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" 
                         title="Historique"
                         onClick={() => alert(`Historique de ${user.name}`)}
                       >
                         <History size={18} />
                       </button>
                       <button 
                         onClick={() => handleToggleStatus(user.id)}
                         className={cn(
                           "p-2 rounded-xl transition-all border border-transparent shadow-sm hover:shadow-md active:scale-95",
                           user.status === 'Actif' 
                             ? "text-red-500 bg-red-50 hover:border-red-100" 
                             : "text-green-600 bg-green-50 hover:border-green-100"
                         )}
                         title={user.status === 'Actif' ? "Bannir" : "Réactiver"}
                       >
                         {user.status === 'Actif' ? <Ban size={18} /> : <ShieldCheck size={18} />}
                       </button>
                       <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === user.id ? null : user.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-900 rounded-xl transition-all focus:outline-none"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeDropdown === user.id && (
                            <div 
                              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button 
                                onClick={() => openModal(user)}
                                className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                              >
                                 <Edit2 size={16} /> Modifier
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                              >
                                 <Trash2 size={16} /> Supprimer
                              </button>
                            </div>
                          )}
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <User size={24} className="text-slate-300" />
              </div>
              <h3 className="text-gray-900 font-black">Aucun client trouvé</h3>
              <p className="text-gray-500 text-sm font-medium mt-1">Essayez d'ajuster vos filtres ou votre recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* Ajouter/Modifier Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-800 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                 <UserPlus size={100} className="text-primary rotate-12" />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-white/10 text-white rounded-2xl shadow-lg backdrop-blur-sm">
                  {editingUserId ? <Edit2 size={24} /> : <UserPlus size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white leading-tight">
                    {editingUserId ? "Modifier Client" : "Nouveau Client"}
                  </h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                    {editingUserId ? "Mise à jour du profil" : "Création de profil"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="relative z-10 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 ml-1">Nom Complet</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Amadou Traoré"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-bold text-gray-900" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 ml-1">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="amadou@email.com"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-bold text-gray-900" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 ml-1">Téléphone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+226 XX XX XX XX"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-bold text-gray-900" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 ml-1">Mot de passe</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      required={!editingUserId} 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder={editingUserId ? "Laissez vide pour conserver" : "Mot de passe sécurisé"}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-bold text-gray-900" 
                    />
                  </div>
                </div>

              </div>

              <div className="flex gap-4 pt-4 mt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all active:scale-95"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                   {editingUserId ? "Enregistrer les modifications" : "Vérifier et Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
