import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadService } from '../services/uploadService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

export default function ProfilePhotoUpload({ currentPhoto, onPhotoChange, userName }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentPhoto);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner une image', 'error');
      return;
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Fichier trop volumineux (max 5MB)', 'error');
      return;
    }

    // Afficher l'aperçu
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    setLoading(true);
    try {
      const result = await uploadService.uploadProfilePhoto(file);
      setPreview(result.avatar);
      
      // Mettre à jour le contexte d'authentification
      const updatedUser = { ...user, avatar: result.avatar };
      authService.saveSession(authService.getToken(), updatedUser);
      
      onPhotoChange(result.avatar);
      showToast(`Photo uploadée (${result.storage})`, 'success');
    } catch (error) {
      showToast(error.message, 'error');
      setPreview(currentPhoto);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Photo */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-primary/20 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-4xl font-black text-gray-300">
                {userName?.[0]?.toUpperCase() || '?'}
              </div>
            </div>
          )}
        </div>

        {/* Bouton upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Upload size={20} />
          )}
        </button>

        {/* Bouton supprimer */}
        {preview && (
          <button
            onClick={handleRemove}
            className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Input caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Cliquez sur l'appareil photo pour changer</p>
        <p className="text-xs">Max 5MB (JPEG, PNG, GIF, WebP)</p>
      </div>
    </div>
  );
}
