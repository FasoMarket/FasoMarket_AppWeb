import { useState, useEffect } from 'react';
import { clientAdvancedService } from '../../services/clientAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { Star, Loader2, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await clientAdvancedService.getMyReviews();
      setReviews(res.data.reviews || []);
    } catch { showToast('Erreur chargement avis', 'error'); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet avis ?')) return;
    try {
      await clientAdvancedService.deleteReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      showToast('Avis supprimé', 'success');
    } catch { showToast('Erreur suppression', 'error'); }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-amber-50 text-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Star size={32} className="fill-amber-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Mes Avis</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Vos retours d'expérience</p>
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
        {reviews.map(review => (
          <div key={review._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex gap-6">
             <div className="w-24 h-24 rounded-2xl bg-slate-50 overflow-hidden shrink-0">
               {review.product?.images?.[0] && <img src={review.product.images[0]} className="w-full h-full object-cover" />}
             </div>
             <div className="flex-1 space-y-2">
               <div className="flex justify-between items-start">
                 <h3 className="font-bold text-slate-800">{review.product?.name || 'Produit indisponible'}</h3>
                 <div className="flex gap-2">
                   <button onClick={() => handleDelete(review._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-lg"><Trash2 size={16}/></button>
                 </div>
               </div>
               <div className="flex gap-1">
                 {[1,2,3,4,5].map(star => (
                   <Star key={star} size={14} className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />
                 ))}
               </div>
               <p className="text-slate-600 text-sm bg-slate-50 p-4 rounded-xl italic">"{review.comment}"</p>
               <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
