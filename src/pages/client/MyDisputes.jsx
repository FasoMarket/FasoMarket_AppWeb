import { useState, useEffect } from 'react';
import { clientAdvancedService } from '../../services/clientAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { AlertCircle, Loader2, MessageSquareWarning, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

export default function MyDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchDisputes(); }, []);

  const fetchDisputes = async () => {
    try {
      const res = await clientAdvancedService.getMyDisputes();
      setDisputes(res.data.disputes || []);
    } catch { showToast('Erreur chargement litiges', 'error'); } 
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-orange-50 text-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/10">
            <MessageSquareWarning size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Mes Litiges</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Suivi de vos réclamations</p>
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
        {disputes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-400 font-medium italic">Vous n'avez aucun litige en cours.</p>
          </div>
        ) : disputes.map(dispute => (
          <div key={dispute._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Commande #{dispute.order?._id.toString().slice(-6).toUpperCase() || 'XXX'}
                </p>
                <h3 className="font-bold text-slate-800">{dispute.reason}</h3>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border",
                dispute.status === 'open' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                dispute.status === 'resolved' ? 'bg-green-50 text-green-600 border-green-200' :
                'bg-slate-50 text-slate-600 border-slate-200'
              )}>
                {dispute.status}
              </span>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-sm font-medium text-slate-600">"{dispute.description}"</p>
            </div>
            
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <p>Contre : {dispute.against?.name || 'Vendeur inconnu'}</p>
              <p>{new Date(dispute.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
