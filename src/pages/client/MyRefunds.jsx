import { useState, useEffect } from 'react';
import { clientAdvancedService } from '../../services/clientAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { BadgeDollarSign, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

export default function MyRefunds() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchRefunds(); }, []);

  const fetchRefunds = async () => {
    try {
      const res = await clientAdvancedService.getMyRefunds();
      setRefunds(res.data.refunds || []);
    } catch { showToast('Erreur chargement remboursements', 'error'); } 
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-teal-50 text-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/10">
            <BadgeDollarSign size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Mes Remboursements</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Suivi de vos demandes</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
      </div>

      <div className="space-y-4">
        {refunds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-400 font-medium italic">Vous n'avez pas de demande de remboursement.</p>
          </div>
        ) : refunds.map(refund => (
          <div key={refund._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-50 pb-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Commande #{refund.order?._id.toString().slice(-6).toUpperCase() || 'XXX'}
                </p>
                <p className="font-black text-slate-800 text-xl">{refund.amount.toLocaleString()} FCFA</p>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border",
                refund.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                refund.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' :
                'bg-red-50 text-red-600 border-red-200'
              )}>
                {refund.status === 'pending' ? 'En cours' : refund.status === 'approved' ? 'Approuvé' : 'Rejeté'}
              </span>
            </div>
            
            <div>
              <p className="text-sm font-medium text-slate-600">Raison invoquée : "{refund.reason}"</p>
            </div>
            
            <div className="text-right text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
              <p>{new Date(refund.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
