import API from './api';

export const adminService = {
  getVendors:      ()             => API.get('/admin/vendors'),
  approveVendor:   (id)           => API.put(`/admin/vendors/${id}/approve`),
  rejectVendor:    (id)           => API.put(`/admin/vendors/${id}/reject`),
  getUsers:        ()             => API.get('/admin/users'),
  updateUserStatus:(id, status)   => API.put(`/admin/users/${id}/status`, { status }),
  deleteUser:      (id)           => API.delete(`/admin/users/${id}`),
  getStats:        ()             => API.get('/admin/stats'),

  // Categories
  getCategories:    ()            => API.get('/admin/categories'),
  createCategory:   (data)        => API.post('/admin/categories', data),
  updateCategory:   (id, data)    => API.put(`/admin/categories/${id}`, data),
  deleteCategory:   (id)          => API.delete(`/admin/categories/${id}`),
};

