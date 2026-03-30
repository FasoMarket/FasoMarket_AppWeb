import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function PendingApproval() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="text-yellow-600" size={32} />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">En Attente d'Approbation</h1>
          <p className="text-gray-600 mt-2">Votre demande de vendeur est en cours de vérification</p>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-left">
              <p className="font-bold text-blue-900">Qu'est-ce qui se passe?</p>
              <p className="text-sm text-blue-700 mt-1">
                Notre équipe vérifie vos informations. Cela prend généralement 24-48 heures.
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3">
          <div>
            <p className="text-sm text-gray-600">Nom de la boutique</p>
            <p className="font-bold text-gray-900">{user?.shopName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Catégorie</p>
            <p className="font-bold text-gray-900">{user?.businessCategory}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-bold text-gray-900">{user?.email}</p>
          </div>
        </div>

        {/* What's Next */}
        <div className="space-y-3">
          <p className="font-bold text-gray-900">Prochaines étapes:</p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              <span>Vérification des informations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              <span>Validation de la boutique</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-yellow-600" />
              <span>Approbation finale</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Link
            to="/profile"
            className="block w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Voir Mon Profil
          </Link>
          <Link
            to="/"
            className="block w-full py-3 bg-gray-100 text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition-colors"
          >
            Retour à l'Accueil
          </Link>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-500 pt-4 border-t border-gray-200">
          Des questions? Contactez notre support à{' '}
          <a href="mailto:support@fasomarket.com" className="text-primary font-bold hover:underline">
            support@fasomarket.com
          </a>
        </p>
      </div>
    </div>
  );
}
