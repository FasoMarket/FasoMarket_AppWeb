import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink, 
  Trash2, 
  Store, 
  X, 
  User, 
  Phone, 
  Receipt, 
  Mail, 
  MapPin, 
  Loader2 
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { cn } from '../../utils/cn';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../contexts/ToastContext';

export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [newVendor, setNewVendor] = useState({ name: '', shop: '', email: '', phone: '', city: '', ifu: '' });
  const { showToast } = useToast();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await adminService.getVendors();
      setVendors(res.data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Impossible de charger les vendeurs.');
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = (vendor.name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter: Tous, Actif (approved), En attente (not approved)
    const isApproved = vendor.isVendorApproved;
    const matchesStatus = statusFilter === 'Tous' || 
                         (statusFilter === 'Actif' && isApproved) || 
                         (statusFilter === 'En attente' && !isApproved);
    
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      if (currentStatus) {
        await adminService.rejectVendor(id);
      } else {
        await adminService.approveVendor(id);
        showToast('Vendeur approuvé', 'success');
      }
      fetchVendors();
    } catch (err) {
      console.error('Error toggling vendor status:', err);
      showToast('Erreur lors de la modification du statut', 'error');
    }
  };

  const handleDeleteVendor = async () => {
    if (!vendorToDelete) return;
    try {
      await adminService.deleteUser(vendorToDelete);
      showToast('Vendeur supprimé', 'success');
      fetchVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err);
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setVendorToDelete(null);
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    showToast('Création de vendeur via admin bientôt disponible', 'info');
    setIsModalOpen(false);
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gestion des Vendeurs</h1>
          <p className="text-gray-500 font-medium">Gérez les comptes vendeurs et leurs permissions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
        >
          <Plus size={18} />
          Nouveau Vendeur
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium" 
            placeholder="Rechercher par nom, boutique ou email..." 
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
              <option value="Suspendu">Suspendu</option>
              <option value="En attente">En attente</option>
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

      {/* Vendor Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Vendeur / Boutique</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ventes</th>
                <th className="px-6 py-4">Produits</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-slate-700">
              {filteredVendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                        {vendor.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">{vendor.name}</div>
                        <div className="text-primary text-xs font-bold leading-tight">{vendor.store?.name || 'Pas de boutique'}</div>
                        <div className="text-gray-400 text-[10px] uppercase font-black tracking-wider mt-0.5">{vendor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      vendor.isVendorApproved ? "bg-primary/10 text-primary border-primary/20" : 
                      "bg-orange-50 text-orange-500 border-orange-100 font-bold"
                    )}>
                      {vendor.isVendorApproved ? 'Actif' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900">N/A</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">N/A</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1 text-yellow-500 font-black">
                      ★ {vendor.store?.rating || 'Nouveau'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => handleToggleStatus(vendor._id, vendor.isVendorApproved)}
                         className={cn(
                           "p-2 rounded-xl transition-all border border-transparent shadow-sm hover:shadow-md active:scale-95",
                           vendor.isVendorApproved 
                             ? "text-orange-500 bg-orange-50 hover:border-orange-100" 
                             : "text-primary bg-primary/10 hover:border-primary/20"
                         )}
                         title={vendor.isVendorApproved ? "Suspendre" : "Approuver"}
                       >
                         {vendor.isVendorApproved ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                       </button>
                       <Link 
                         to={`/shop/${vendor.store?.slug || vendor.store?._id || '#'}`}
                         className="p-2 text-blue-500 bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95" 
                         title="Voir la boutique"
                       >
                         <ExternalLink size={18} />
                       </Link>
                       <button 
                         onClick={() => setVendorToDelete(vendor._id)}
                         className="p-2 text-red-500 bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                         title="Supprimer"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVendors.length === 0 && (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Store size={24} className="text-slate-300" />
              </div>
              <h3 className="text-gray-900 font-black">Aucun vendeur trouvé</h3>
              <p className="text-gray-500 text-sm font-medium mt-1">Essayez d'ajuster vos filtres ou votre recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* Nouveau Vendeur Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Partenaire" size="lg">
            <form onSubmit={handleAddVendor} className="space-y-8">
              {/* Section 1: Identité */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identité du Responsable</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 ml-1">Nom Complet</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        type="text" 
                        value={newVendor.name}
                        onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                        placeholder="Ex: Ibrahim Traoré"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold text-slate-900" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 ml-1">Téléphone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        type="tel" 
                        value={newVendor.phone}
                        onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                        placeholder="+226 XX XX XX XX"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold text-slate-900" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Boutique */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Informations Boutique</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 ml-1">Nom de la Boutique</label>
                    <div className="relative group">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        type="text" 
                        value={newVendor.shop}
                        onChange={(e) => setNewVendor({...newVendor, shop: e.target.value})}
                        placeholder="Ex: Faso Artisanat"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold text-slate-900" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 ml-1">Numéro IFU</label>
                    <div className="relative group">
                      <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        type="text" 
                        value={newVendor.ifu}
                        onChange={(e) => setNewVendor({...newVendor, ifu: e.target.value})}
                        placeholder="0012345678X"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold text-slate-900" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Contact */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Localisation & Contact</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 ml-1">Email Professionnel</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        type="email" 
                        value={newVendor.email}
                        onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                        placeholder="vendeur@faso.bf"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold text-slate-900" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 ml-1">Ville</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        required
                        type="text" 
                        value={newVendor.city}
                        onChange={(e) => setNewVendor({...newVendor, city: e.target.value})}
                        placeholder="Ouagadougou"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-bold text-slate-900" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all active:scale-95"
                >
                  Fermer
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] transition-all active:scale-95"
                >
                  Activer le Partenariat
                </button>
              </div>
            </form>
      </Modal>

      <ConfirmModal
        isOpen={!!vendorToDelete}
        onClose={() => setVendorToDelete(null)}
        onConfirm={handleDeleteVendor}
        title="Supprimer le vendeur ?"
        message="Voulez-vous vraiment supprimer ce vendeur ? Cette action est irréversible."
        confirmLabel="Oui, supprimer"
        variant="danger"
      />
    </div>
  );
}

