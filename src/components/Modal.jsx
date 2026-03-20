import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',   // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose = true,
}) {
  const sizes = {
    sm:   'max-w-sm',
    md:   'max-w-md',
    lg:   'max-w-lg',
    xl:   'max-w-2xl',
    full: 'max-w-4xl',
  };

  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Overlay avec backdrop-blur (glassmorphism — philosophie design FasoMarket)
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Conteneur modal */}
      <div
        className={`relative w-full ${sizes[size]} bg-white rounded-[2rem] shadow-2xl shadow-slate-300/50 animate-zoom-in max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            {title && <h2 className="text-lg font-semibold text-slate-800">{title}</h2>}
            {showClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors ml-auto"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>
        )}

        {/* Contenu */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
