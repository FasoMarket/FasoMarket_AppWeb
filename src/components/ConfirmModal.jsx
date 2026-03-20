import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer l\'action',
  message,
  confirmLabel = 'Confirmer',
  cancelLabel  = 'Annuler',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  loading = false,
}) {
  const colors = {
    danger:  { icon: 'text-red-500',   btn: 'bg-red-500 hover:bg-red-600',   bg: 'bg-red-50'   },
    warning: { icon: 'text-amber-500', btn: 'bg-amber-500 hover:bg-amber-600', bg: 'bg-amber-50' },
    info:    { icon: 'text-blue-500',  btn: 'bg-blue-500 hover:bg-blue-600',  bg: 'bg-blue-50'  },
  };
  const c = colors[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center">
        <div className={`w-14 h-14 ${c.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <AlertTriangle className={`w-7 h-7 ${c.icon}`} />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-2">{title}</h3>
        {message && <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all ${c.btn} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Chargement...
              </span>
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
