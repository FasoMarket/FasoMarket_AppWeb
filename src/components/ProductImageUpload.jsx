import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadService } from '../services/uploadService';
import { useToast } from '../contexts/ToastContext';

export default function ProductImageUpload({ onImagesChange, maxImages = 5 }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Vérifier le nombre total
    if (images.length + files.length > maxImages) {
      showToast(`Maximum ${maxImages} images autorisées`, 'error');
      return;
    }

    // Vérifier chaque fichier
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        showToast('Tous les fichiers doivent être des images', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('Fichier trop volumineux (max 5MB)', 'error');
        return;
      }
    }

    setLoading(true);
    try {
      const result = await uploadService.uploadProductImages(files);
      const newImages = result.images.map(img => ({
        url: img.url,
        publicId: img.publicId,
        storage: img.storage,
      }));
      
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
      showToast(`${newImages.length} image(s) uploadée(s)`, 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (index) => {
    const image = images[index];
    try {
      await uploadService.deleteImage(image.publicId, image.storage, 'products');
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      onImagesChange(updatedImages);
      showToast('Image supprimée', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={loading || images.length >= maxImages}
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={32} className="text-primary animate-spin" />
            <p className="text-sm text-gray-600">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={32} className="text-primary" />
            <p className="font-bold text-gray-900">Cliquez pour ajouter des images</p>
            <p className="text-xs text-gray-500">
              {images.length}/{maxImages} images • Max 5MB par image
            </p>
          </div>
        )}
      </div>

      {/* Galerie */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={image.url}
                  alt={`Produit ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badge principal */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-bold">
                  Principal
                </div>
              )}

              {/* Badge stockage */}
              <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {image.storage === 'cloudinary' ? '☁️' : '💾'}
              </div>

              {/* Bouton supprimer */}
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message vide */}
      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune image uploadée</p>
        </div>
      )}
    </div>
  );
}
