import API from './api';

export const productService = {
  getAll:          (params)       => API.get('/products', { params }),
  getById:         (id)           => API.get(`/products/${id}`),
  getCategories:   ()             => API.get('/products/categories'),
  create:          (formData)     => API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:          (id, data, config = {}) => API.put(`/products/${id}`, data, config),
  delete:          (id)           => API.delete(`/products/${id}`),
  addImages:       (id, formData) => API.post(`/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage:     (id, data)     => API.delete(`/products/${id}/images`, { data }),
};
