import { useState, useEffect } from 'react';
import { 
  Loader2, 
  UserPlus, 
  Search, 
  ChevronDown, 
  Filter, 
  Mail, 
  Ban, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  User, 
  X, 
  Lock,
  Phone
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { cn } from '../../utils/cn';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../contexts/ToastContext';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  
  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    fetchUsers();
    
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Simplification: status as role or active
    const matchesStatus = statusFilter === 'Tous' || user.role === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.role === 'banni' ? 'user' : 'banni';
      await adminService.updateUserStatus(user._id, newStatus);
      showToast('Statut mis à jour', 'success');
      fetchUsers();
    } catch (err) {
      console.error('Error toggling user status:', err);
      showToast('Erreur lors de la modification du statut', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await adminService.deleteUser(userToDelete);
      showToast('Utilisateur supprimé', 'success');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setUserToDelete(null);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUserId(user._id);
      setFormData({ name: user.name, email: user.email, phone: user.phone || '', password: '' });
    } else {
      setEditingUserId(null);
      setFormData({ name: '', email: '', phone: '', password: '' });
    }
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    showToast(editingUserId ? 'Mise à jour bientôt disponible' : 'Création bientôt disponible', 'info');
    setIsModalOpen(false);
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

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
          <button 
            onClick={() => showToast('Filtrage avancé bientôt disponible', 'info')}
            className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors text-gray-400"
          >
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
                <tr key={user._id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white flex items-center justify-center text-gray-400 font-black text-xs uppercase shadow-sm">
                          {user.name?.split(' ').map(n => n[0]).join('')}
                       </div>
                       <div>
                          <div className="font-black text-gray-900 group-hover:text-primary transition-colors">{user.name}</div>
                          <div className="text-gray-400 text-[10px] uppercase font-black tracking-widest mt-0.5">Membre depuis {new Date(user.createdAt).toLocaleDateString()}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={12} className="text-gray-400" />
                          {user.email}
                       </div>
                       <div className="text-xs text-gray-400">{user.phone || 'Non renseigné'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-gray-400 italic">N/A</td>
                  <td className="px-6 py-5 text-sm font-black text-gray-400 italic">N/A</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1",
                      user.role === 'admin' ? "bg-red-50 text-red-600 ring-red-100" : 
                      user.role === 'vendor' ? "bg-blue-50 text-blue-600 ring-blue-100" : 
                      "bg-green-50 text-green-600 ring-green-100"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => handleToggleStatus(user._id)}
                         className={cn(
                           "p-2 rounded-xl transition-all border border-transparent shadow-sm hover:shadow-md active:scale-95 text-gray-400 bg-gray-50 hover:border-gray-100"
                         )}
                         title="Suspendre (Bientôt)"
                       >
                         <Ban size={18} />
                       </button>
                       <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === user._id ? null : user._id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-900 rounded-xl transition-all focus:outline-none"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeDropdown === user._id && (
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
                                onClick={() => {
                                  setUserToDelete(user._id);
                                  setActiveDropdown(null);
                                }}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUserId ? "Modifier Client" : "Nouveau Client"} size="lg">
            <form onSubmit={handleSaveUser} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-500 ml-1">Nom Complet</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Amadou Traoré"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-bold text-slate-900" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 ml-1">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="amadou@email.com"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-bold text-slate-900" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 ml-1">Téléphone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+226 XX XX XX XX"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-bold text-slate-900" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-500 ml-1">Mot de passe</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      required={!editingUserId} 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder={editingUserId ? "Laissez vide pour conserver" : "Mot de passe sécurisé"}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-bold text-slate-900" 
                    />
                  </div>
                </div>

              </div>

              <div className="flex gap-4 pt-4 mt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all active:scale-95"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                   {editingUserId ? "Enregistrer les modifications" : "Vérifier et Ajouter"}
                </button>
              </div>
            </form>
      </Modal>

      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Supprimer l'utilisateur ?"
        message="Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible."
        confirmLabel="Oui, supprimer"
        variant="danger"
      />
    </div>
  );
}
