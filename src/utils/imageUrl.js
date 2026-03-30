/**
 * Construit une URL d'image valide
 * Gère les cas:
 * - URLs absolues (https://...)
 * - Chemins relatifs (/uploads/...)
 * - URLs vides ou null
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Si c'est déjà une URL absolue, la retourner
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Si c'est un chemin relatif, construire l'URL complète
  if (imagePath.startsWith('/uploads/')) {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${imagePath}`;
  }

  // Sinon, ajouter /uploads/ au début
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}/uploads/${imagePath}`;
};

/**
 * Placeholder pour les images manquantes
 */
export const getPlaceholderImage = (name = 'Image') => {
  return `https://placehold.co/400x400?text=${encodeURIComponent(name)}`;
};
