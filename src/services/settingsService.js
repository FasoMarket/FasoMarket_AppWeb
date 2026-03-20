import API from './api';

export const settingsService = {
  // Admin
  getAdminSettings:           ()     => API.get('/settings/admin'),
  updateTheme:                (data) => API.put('/settings/admin/theme', data),
  updateSecurity:             (data) => API.put('/settings/admin/security', data),
  updateAdminNotifications:   (data) => API.put('/settings/admin/notifications', data),
  updateBilling:              (data) => API.put('/settings/admin/billing', data),
  updateApi:                  (data) => API.put('/settings/admin/api', data),
  regenerateApiKey:           ()     => API.post('/settings/admin/api/regenerate'),

  // Vendor
  getVendorSettings:          ()     => API.get('/settings/vendor'),
  updateVendorNotifications:  (data) => API.put('/settings/vendor/notifications', data),
  updateStoreSettings:        (data) => API.put('/settings/vendor/store', data),
  updatePaymentSettings:      (data) => API.put('/settings/vendor/payment', data),

  // User
  updateProfile:              (fd)   => API.put('/settings/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword:             (data) => API.put('/settings/change-password', data),
  updateUserNotifications:    (data) => API.put('/settings/notifications', data),
};
