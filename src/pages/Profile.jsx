import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LogOut, ShoppingBag, Star, BadgeDollarSign, 
  MapPin, Plus, Trash2, Check, Shield, BellRing, BarChart2,
  User, Mail, Phone, Save, Camera, AlertCircle, Lock, Loader2, X
} from 'lucide-react';
import { authService } from '../services/authService';
import { settingsService } from '../services/settingsService';
import { clientAdvancedService } from '../services/clientAdvancedService';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { cn } from '../utils/cn';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('info');
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
    label: 'Domicile',
    fullName: '',
    phone: '',
    city: 'Ouagadougou',
    street: '',
    district: '',
    isDefault: false
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

        const [statsRes, addrRes] = await Promise.all([
          clientAdvancedService.getClientStats().catch(() => ({ data: { stats: {} } })),
          clientAdvancedService.getAddresses().catch(() => ({ data: { addresses: [] } }))
        ]);
        setStats(statsRes.data.stats);
        setAddresses(addrRes.data.addresses);
      } catch (err) {
        setError('Erreur lors du chargement du profil');
      }
    };
    loadProfile();
  }, []);

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
      setSuccess('Profil mis à jour !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await settingsService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Mot de passe changé avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (prefs) => {
    setFormData({ ...formData, notificationPrefs: prefs });
    try {
      await settingsService.updateNotifications(prefs);
    } catch (err) {
      console.error('Erreur notifications:', err);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await clientAdvancedService.updateAddress(editingAddressId, addressForm);
        setSuccess('Adresse modifiée !');
      } else {
        await clientAdvancedService.createAddress(addressForm);
        setSuccess('Adresse ajoutée !');
      }
      setShowAddressModal(false);
      setEditingAddressId(null);
      setAddressForm({ label: 'Domicile', fullName: '', phone: '', city: 'Ouagadougou', street: '', district: '', isDefault: false });
      const res = await clientAdvancedService.getAddresses();
      setAddresses(res.data.addresses || []);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Supprimer cette adresse ?')) return;
    try {
      await clientAdvancedService.deleteAddress(id);
      setAddresses(addresses.filter(a => a._id !== id));
      setSuccess('Adresse supprimée');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await clientAdvancedService.setDefaultAddress(id);
      const res = await clientAdvancedService.getAddresses();
      setAddresses(res.data.addresses || []);
    } catch (err) {
      setError('Erreur');
    }
  };

  const confirmLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Alerts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* User Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-md",
                user?.role === 'vendor' ? "bg-blue-100 text-blue-600" :
                user?.role === 'admin' ? "bg-red-100 text-red-600" :
                "bg-gray-100 text-gray-600"
              )}>
                {user?.role === 'vendor' ? 'Vendeur' : user?.role === 'admin' ? 'Admin' : 'Client'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'info', label: 'Informations', icon: User },
            { id: 'address', label: 'Adresses', icon: MapPin },
            { id: 'security', label: 'Sécurité', icon: Lock },
            { id: 'notifs', label: 'Notifications', icon: BellRing },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <form onSubmit={handleUpdateProfile} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <Input
              label="Nom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Téléphone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, avatar: e.target.files?.[0] })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <Button type="submit" loading={loading} className="w-full">
              <Save className="w-4 h-4" /> Enregistrer
            </Button>
          </form>
        )}

        {activeTab === 'address' && (
          <div className="space-y-4">
            <Button onClick={() => { setShowAddressModal(true); setEditingAddressId(null); }} className="w-full">
              <Plus className="w-4 h-4" /> Ajouter une adresse
            </Button>
            <div className="grid gap-4">
              {addresses.map(addr => (
                <div key={addr._id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{addr.label}</h3>
                    <p className="text-sm text-gray-600">{addr.fullName}</p>
                    <p className="text-sm text-gray-600">{addr.street}, {addr.city}</p>
                    {addr.isDefault && <span className="text-xs font-bold text-primary mt-2">Par défaut</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSetDefaultAddress(addr._id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <Input
              label="Mot de passe actuel"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
            <Input
              label="Nouveau mot de passe"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />
            <Input
              label="Confirmer le mot de passe"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              <Shield className="w-4 h-4" /> Mettre à jour
            </Button>
          </form>
        )}

        {activeTab === 'notifs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'email', label: 'E-mails', icon: Mail },
              { id: 'push', label: 'Notifications Push', icon: BellRing },
              { id: 'sms', label: 'SMS', icon: Phone }
            ].map(pref => (
              <div key={pref.id} className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
                <div className="flex items-center gap-2">
                  <pref.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-gray-900">{pref.label}</h3>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notificationPrefs[pref.id] || false}
                    onChange={(e) => handleNotificationUpdate({ ...formData.notificationPrefs, [pref.id]: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">{formData.notificationPrefs[pref.id] ? 'Activé' : 'Désactivé'}</span>
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title={editingAddressId ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
      >
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <Input
            label="Label"
            value={addressForm.label}
            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
            placeholder="Ex: Maison, Bureau..."
            required
          />
          <Input
            label="Nom complet"
            value={addressForm.fullName}
            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
            required
          />
          <Input
            label="Téléphone"
            type="tel"
            value={addressForm.phone}
            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Ville</label>
            <select
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="Ouagadougou">Ouagadougou</option>
              <option value="Bobo-Dioulasso">Bobo-Dioulasso</option>
              <option value="Koudougou">Koudougou</option>
            </select>
          </div>
          <Input
            label="Rue"
            value={addressForm.street}
            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
            required
          />
          <Input
            label="Quartier"
            value={addressForm.district}
            onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">Adresse par défaut</span>
          </label>
          <Button type="submit" className="w-full">Enregistrer</Button>
        </form>
      </Modal>

      {/* Logout Confirm */}
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={confirmLogout}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmLabel="Oui, se déconnecter"
        variant="danger"
      />
    </div>
  );
}
