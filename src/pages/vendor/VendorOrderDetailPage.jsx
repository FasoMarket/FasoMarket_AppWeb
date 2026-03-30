import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  MessageCircle, 
  CheckCircle2, 
  MapPin, 
  Truck,
  CreditCard,
  Loader2,
  AlertCircle,
  Clock,
  Package
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useState, useEffect } from 'react';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';
import { useToast } from '../../contexts/ToastContext';

export default function VendorOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await vendorAdvancedService.getOrderDetail(id);
      const orderData = res.data?.data || res.data?.order || res.data;
      setOrder(orderData);
    } catch (err) {
      console.error('Erreur chargement commande:', err);
      setError('Impossible de récupérer les détails de la commande.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await vendorAdvancedService.updateOrderStatus(id, newStatus);
      setOrder({ ...order, orderStatus: newStatus });
      showToast('Statut de la commande mis à jour', 'success');
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
      showToast('Erreur lors de la mise à jour du statut.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2 uppercase italic tracking-tighter">{error || 'Commande introuvable'}</h2>
        <button onClick={() => navigate(-1)} className="text-xs font-black text-primary uppercase tracking-[0.2em] border-b border-primary mt-4">Retour aux commandes</button>
      </div>
    );
  }

  const items = order.items || [];
  const status = order.orderStatus;

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary transition-all mb-4 uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Retour commandes
          </button>
          <h1 className="text-3xl font-black italic tracking-tighter">Commande #{order._id.slice(-6).toUpperCase()}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-3 border border-slate-100 bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <Printer size={16} />
            Imprimer
          </button>
          <button className="px-5 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center gap-2">
            <MessageCircle size={16} />
            Chat Client
          </button>
        </div>
      </div>

      {/* Action Bar & Status */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className={cn(
            "p-4 rounded-3xl",
            status === 'delivered' ? "bg-emerald-50 text-emerald-500" : "bg-primary/10 text-primary"
          )}>
            {status === 'delivered' ? <CheckCircle2 size={32} /> : <Clock size={32} />}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Statut Actuel</p>
            <p className="font-black text-xl italic uppercase text-slate-900">{status}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-2 bg-slate-50 rounded-[1.5rem] border border-slate-100">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Modifier :</label>
          <div className="relative">
            <select 
                disabled={updating}
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-white border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent block py-3 px-6 pr-10 outline-none appearance-none cursor-pointer"
            >
                <option value="pending">En attente</option>
                <option value="processing">En préparation</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
            </select>
            {updating && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary" size={16} />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Order Items */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-10 py-6 border-b border-gray-50 bg-slate-50/30 flex items-center gap-3">
              <Package size={20} className="text-primary" />
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-900">Articles commandés ({items.length})</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map((item, idx) => (
                <div key={idx} className="p-10 flex flex-col sm:flex-row items-center gap-8 group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                    <img src={item.product?.images?.[0] || item.product?.image || '/placeholder.png'} alt={item.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-black text-xl text-slate-900 italic tracking-tighter mb-1">{item.product?.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{item.product?.category}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                        <span className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest">Qté: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <p className="font-black text-2xl text-slate-900">{(item.price * item.quantity).toLocaleString()} <span className="text-[10px] opacity-30">FCFA</span></p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.price.toLocaleString()} / pièce</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-3">
              <CreditCard size={20} className="text-primary" />
              Transaction financière
            </h3>
            <div className="flex items-center gap-6 p-8 border border-primary/5 bg-primary/5 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="w-16 h-16 bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-white font-black italic text-sm shadow-xl relative z-10">
                {order.paymentMethod?.toUpperCase()}
              </div>
              <div className="relative z-10">
                <p className="font-black text-lg text-slate-900 uppercase tracking-tight">{order.paymentMethod} Money</p>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Status: <span className={order.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}>{order.paymentStatus}</span></p>
              </div>
              <div className="ml-auto relative z-10">
                <div className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
                  order.paymentStatus === 'paid' ? "bg-white text-emerald-500 border-emerald-100" : "bg-white text-amber-500 border-amber-100"
                )}>
                  {order.paymentStatus === 'paid' ? 'Transaction Confirmée' : 'Paiement en attente'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Info Column */}
        <div className="space-y-10 lg:sticky lg:top-24">
          {/* Customer Card */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                 <MapPin size={18} />
              </div>
              Livraison & Contact
            </h3>
            <div className="space-y-10">
              <div className="group">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3">Destinataire</p>
                <p className="font-black text-2xl text-slate-900 italic tracking-tighter group-hover:text-primary transition-colors">{order.shippingAddress?.fullName || order.user?.name}</p>
                <p className="text-sm font-black text-primary mt-2 tracking-widest">{order.shippingAddress?.phone || order.user?.phone}</p>
              </div>
              
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Adresse de Dépôt</p>
                <div className="p-6 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                  <p className="font-black text-slate-800 uppercase tracking-tighter text-sm mb-1">{order.shippingAddress?.city}</p>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed italic opacity-80">{order.shippingAddress?.details}</p>
                </div>
              </div>
              
              <button className="w-full py-4 flex items-center justify-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                <MapPin size={16} />
                Localiser sur la carte
              </button>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-400/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-10 relative z-10">Règlement Commerçant</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Ventes Brutes</span>
                <span className="text-white">{order.totalPrice.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Frais Logistiques</span>
                <span className="text-white">Inclus</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-red-400 uppercase tracking-widest">
                <span>Comms. FasoMarket</span>
                <span>-{(order.totalPrice * 0.05).toLocaleString()} FCFA</span>
              </div>
              <div className="pt-8 border-t border-white/10 flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Votre gain net estimé</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-primary tracking-tighter">{(order.totalPrice * 0.95).toLocaleString()}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase">FCFA</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-5 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3 relative z-10">
                <AlertCircle size={16} className="text-primary shrink-0" />
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">Note: Votre compte sera crédité après confirmation de livraison par le client.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
