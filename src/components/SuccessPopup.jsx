import Modal from './Modal';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SuccessPopup({
  isOpen,
  onClose,
  title,
  message,
  primaryAction,   // { label, to }
  secondaryAction, // { label, to }
}) {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center py-2">
        <div className="w-16 h-16 bg-green-50 rounded-[1.25rem] flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-9 h-9 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex flex-col gap-2.5">
          {primaryAction && (
            <button
              onClick={() => { onClose(); navigate(primaryAction.to); }}
              className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={() => { onClose(); navigate(secondaryAction.to); }}
              className="w-full py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
