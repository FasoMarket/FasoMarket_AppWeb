import API from './api';

export const storeService = {
  create:          (formData)     => API.post('/stores', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll:          (params)       => API.get('/stores', { params }),
  getBySlug:       (slug)         => API.get(`/stores/${slug}`),
  getProducts:     (slug, params) => API.get(`/stores/${slug}/products`, { params }),
  update:          (id, formData) => API.put(`/stores/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:          (id)           => API.delete(`/stores/${id}`),
  checkSlug:       (slug)         => API.get(`/stores/check-slug/${slug}`),
};
