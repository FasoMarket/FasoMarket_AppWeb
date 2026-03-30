import { Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';

export default function OrderProgressBar({ status }) {
  const steps = [
    { key: 'pending', label: 'En attente', icon: Clock },
    { key: 'processing', label: 'Préparation', icon: Package },
    { key: 'shipped', label: 'Expédié', icon: Truck },
    { key: 'delivered', label: 'Livré', icon: CheckCircle2 }
  ];

  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900">Commande annulée</p>
            <p className="text-sm text-red-700">Cette commande a été annulée et ne sera pas livrée.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-widest">Suivi de votre commande</h3>
      
      <div className="space-y-6">
        {/* Timeline visuelle */}
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                {/* Icône */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                    isCompleted
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-slate-100 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}
                >
                  <Icon size={24} />
                </div>

                {/* Label */}
                <p
                  className={`text-xs font-bold text-center ${
                    isCompleted ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>

                {/* Ligne de connexion */}
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-6 w-[calc(100%-3rem)] h-1 -z-10 transition-all ${
                      isCompleted ? 'bg-primary-500' : 'bg-slate-200'
                    }`}
                    style={{
                      width: 'calc(100% - 3rem)',
                      marginLeft: '1.5rem'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Barre de progression linéaire */}
        <div className="mt-8">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
              style={{
                width: `${((currentIndex + 1) / steps.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Message d'état */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
          <p className="text-sm text-primary-900 font-semibold">
            {status === 'pending' && '⏳ Votre commande est en attente de traitement. Le vendeur la confirmera bientôt.'}
            {status === 'processing' && '📦 Le vendeur prépare vos articles. Vous recevrez un numéro de suivi très bientôt.'}
            {status === 'shipped' && '🚚 Votre commande est en route ! Vous devriez la recevoir dans les prochains jours.'}
            {status === 'delivered' && '✅ Votre commande a été livrée avec succès. Merci de votre achat !'}
          </p>
        </div>
      </div>
    </div>
  );
}
