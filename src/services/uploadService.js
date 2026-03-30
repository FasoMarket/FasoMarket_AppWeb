import API from './api';

export const uploadService = {
  /**
   * Upload la photo de profil
   * @param {File} file - Fichier image
   * @returns {Promise<{avatar: string, storage: string}>}
   */
  uploadProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await API.post('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur upload profil');
    }
  },

  /**
   * Upload une image de produit
   * @param {File} file - Fichier image
   * @returns {Promise<{url: string, publicId: string, storage: string}>}
   */
  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await API.post('/upload/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur upload image');
    }
  },

  /**
   * Upload plusieurs images de produit
   * @param {File[]} files - Tableau de fichiers
   * @returns {Promise<{images: Array}>}
   */
  uploadProductImages: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    try {
      const response = await API.post('/upload/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur upload images');
    }
  },

  /**
   * Supprimer une image
   * @param {string} publicId - ID public de l'image
   * @param {string} storage - Type de stockage (cloudinary ou local)
   * @param {string} folder - Dossier (profiles ou products)
   */
  deleteImage: async (publicId, storage = 'local', folder = 'products') => {
    try {
      await API.delete('/upload/image', {
        data: { publicId, storage, folder }
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur suppression image');
    }
  },
};
