import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { vendorAdvancedService } from '../../services/vendorAdvancedService';
import { useToast } from '../../contexts/ToastContext';
import { getImageUrl } from '../../utils/imageUrl';

export default function VendorReviews() {
  const [reviews,  setReviews]  = useState([]);
  const [stats,    setStats]    = useState(null);
  const [replyId,  setReplyId]  = useState(null);
  const [replyText,setReplyText]= useState('');
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      vendorAdvancedService.getReviews(),
      vendorAdvancedService.getReviewStats(),
    ]).then(([revRes, statsRes]) => {
      console.log('📝 Reviews response:', revRes);
      console.log('📝 Stats response:', statsRes);
      setReviews(revRes.data.reviews || []);
      setStats(statsRes.data.stats);
    }).catch(err => {
      console.error('Erreur chargement avis:', err);
      showToast('Erreur lors du chargement des avis', 'error');
    });
  }, []);

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;
    try {
      await vendorAdvancedService.replyToReview(reviewId, replyText);
      setReviews(prev => prev.map(r =>
        r._id === reviewId ? { ...r, reply: replyText, repliedAt: new Date() } : r
      ));
      setReplyId(null);
      setReplyText('');
      showToast('Réponse publiée', 'success');
    } catch {
      showToast('Erreur lors de la publication', 'error');
    }
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Avis clients</h1>

      {/* Stats globales */}
      {stats && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-slate-800">{stats.average?.toFixed(1) || '0.0'}</p>
              {renderStars(Math.round(stats.average || 0))}
              <p className="text-sm text-slate-400 mt-1">{stats.total || 0} avis</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5,4,3,2,1].map(star => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-4">{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: stats.total ? `${(stats[`stars${star}`] / stats.total) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-6">{stats[`stars${star}`] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200">
            <Star className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500">Aucun avis pour le moment</p>
          </div>
        ) : reviews.map(review => (
          <div key={review._id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                {review.customer?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-slate-800 truncate">{review.customer?.name || 'Client anonyme'}</p>
                  <p className="text-xs text-slate-400 whitespace-nowrap">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                {renderStars(review.rating)}
                
                <div className="flex items-center gap-2 mt-2 p-2 bg-slate-50 rounded-lg">
                  {review.product?.images?.[0] && (
                    <img src={getImageUrl(review.product.images[0])} alt="" className="w-10 h-10 rounded object-cover" />
                  )}
                  <p className="text-xs font-medium text-slate-600 truncate">
                    {review.product?.name || 'Produit supprimé'}
                  </p>
                </div>

                {review.comment && (
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{review.comment}</p>
                )}

                {/* Réponse existante */}
                {review.reply && (
                  <div className="mt-4 pl-4 border-l-2 border-primary/20 bg-primary/5 rounded-r-xl p-3">
                    <p className="text-xs font-bold text-primary mb-1">Votre réponse</p>
                    <p className="text-sm text-slate-600">{review.reply}</p>
                  </div>
                )}

                {/* Zone de réponse */}
                {!review.reply && replyId === review._id ? (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Écrire une réponse polie et professionnelle..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(review._id)}
                        className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
                      >
                        Publier la réponse
                      </button>
                      <button
                        onClick={() => { setReplyId(null); setReplyText(''); }}
                        className="px-6 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : !review.reply ? (
                  <button
                    onClick={() => { setReplyId(review._id); setReplyText(''); }}
                    className="mt-4 flex items-center gap-2 text-xs text-primary hover:text-primary/80 font-bold transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Répondre à cet avis
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
