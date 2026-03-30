import { useState, useEffect } from 'react';
import { Star, Trash2, Edit2, Send, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clientAdvancedService } from '../services/clientAdvancedService';
import { orderService } from '../services/orderService';
import { useToast } from '../contexts/ToastContext';
import { getImageUrl } from '../utils/imageUrl';

export default function MyReviews() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    productId: '',
    orderId: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, ordersRes] = await Promise.all([
        clientAdvancedService.getMyReviews(),
        orderService.getMyOrders()
      ]);

      setReviews(reviewsRes.data?.reviews || reviewsRes.data?.data || []);
      
      // Extraire les produits achetés des commandes livrées
      const orders = ordersRes.data || [];
      const items = [];
      orders.forEach(order => {
        if (order.orderStatus === 'delivered' && order.items) {
          order.items.forEach(item => {
            const alreadyReviewed = (reviewsRes.data?.reviews || reviewsRes.data?.data || [])
              .some(r => r.product?._id === item.product?._id);
            if (!alreadyReviewed) {
              items.push({
                ...item,
                orderId: order._id,
                orderDate: order.createdAt
              });
            }
          });
        }
      });
      setPurchasedItems(items);
    } catch (err) {
      console.error('Erreur chargement avis:', err);
      showToast('Erreur lors du chargement des avis', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!formData.productId || !formData.orderId) {
      showToast('Veuillez sélectionner un produit', 'error');
      return;
    }
    if (formData.rating < 1 || formData.rating > 5) {
      showToast('La note doit être entre 1 et 5', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await clientAdvancedService.createReview({
        productId: formData.productId,
        orderId: formData.orderId,
        rating: formData.rating,
        comment: formData.comment
      });

      showToast('Avis publié avec succès !', 'success');
      setFormData({ productId: '', orderId: '', rating: 5, comment: '' });
      setShowForm(false);
      loadData();
    } catch (err) {
      console.error('Erreur création avis:', err);
      showToast('Erreur lors de la publication de l\'avis', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

    try {
      await clientAdvancedService.deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      showToast('Avis supprimé', 'success');
      loadData();
    } catch (err) {
      console.error('Erreur suppression avis:', err);
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => interactive && onChange && onChange(star)}
          className={`transition-all ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
          disabled={!interactive}
        >
          <Star
            size={interactive ? 24 : 16}
            className={`${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-black text-slate-900">Mes avis</h1>
        </div>

        {/* Avis existants */}
        {reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Avis publiés ({reviews.length})</h2>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-slate-800">{review.product?.name}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {renderStars(review.rating)}

                  {review.comment && (
                    <p className="text-sm text-slate-600 mt-3">{review.comment}</p>
                  )}

                  {review.reply && (
                    <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
                      <p className="text-xs font-bold text-primary-600 mb-1">Réponse du vendeur</p>
                      <p className="text-sm text-slate-600">{review.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Produits à évaluer */}
        {purchasedItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Produits à évaluer ({purchasedItems.length})</h2>
            <div className="space-y-3">
              {purchasedItems.map(item => (
                <button
                  key={`${item.orderId}-${item.product?._id}`}
                  onClick={() => {
                    setFormData({
                      productId: item.product?._id,
                      orderId: item.orderId,
                      rating: 5,
                      comment: ''
                    });
                    setShowForm(true);
                  }}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:border-primary-300 hover:shadow-md transition-all text-left flex items-center gap-4"
                >
                  {item.product?.images?.[0] && (
                    <img
                      src={getImageUrl(item.product.images[0])}
                      alt={item.product?.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{item.product?.name}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Commandé le {new Date(item.orderDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Star size={20} className="text-slate-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire d'avis */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Évaluer ce produit</h3>

              {/* Produit sélectionné */}
              {formData.productId && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm font-semibold text-slate-800">
                    {purchasedItems.find(i => i.product?._id === formData.productId)?.product?.name}
                  </p>
                </div>
              )}

              {/* Note */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Votre note
                </label>
                {renderStars(formData.rating, true, (rating) =>
                  setFormData(prev => ({ ...prev, rating }))
                )}
              </div>

              {/* Commentaire */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Partagez votre expérience avec ce produit..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Publication...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Publier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* État vide */}
        {reviews.length === 0 && purchasedItems.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
            <Star className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Aucun avis pour le moment</p>
            <p className="text-slate-400 text-sm mt-2">
              Achetez des produits et évaluez-les pour partager votre expérience
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
