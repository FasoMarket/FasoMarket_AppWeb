import { useState, useEffect } from 'react';
import { settingsService } from '../services/settingsService';

export const useSettings = (type = 'vendor') => {
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);

  const fetchFn = type === 'admin'
    ? settingsService.getAdminSettings
    : settingsService.getVendorSettings;

  useEffect(() => {
    fetchFn()
      .then(res => setSettings(res.data.settings))
      .catch(err => setError(err.response?.data?.message || 'Erreur lors du chargement des paramètres'))
      .finally(() => setLoading(false));
  }, [type]);

  // Sauvegarder une section spécifique
  const save = async (updateFn, data, successMsg = 'Paramètres sauvegardés') => {
    setSaving(true);
    try {
      const res = await updateFn(data);
      // Mettre à jour localement
      const updatedData = res.data.settings || res.data.theme || res.data.security || res.data.notifications || res.data.billing || res.data.api || data;
      setSettings(prev => ({ ...prev, ...updatedData }));
      return { success: true, message: successMsg };
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la sauvegarde';
      return { success: false, message: msg };
    } finally {
      setSaving(false);
    }
  };

  return { settings, loading, saving, error, save, setSettings };
};
