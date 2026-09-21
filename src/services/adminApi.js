import api from './api';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllWorkers: async () => {
    const response = await api.get('/admin/workers');
    return response.data;
  },

  getAllCertificates: async (params = {}) => {
    const response = await api.get('/admin/certificates', { params });
    return response.data;
  },

  updateCertificateStatus: async (certificateId, status) => {
    const response = await api.patch(`/admin/certificates/${certificateId}/status`, {
      status,
    });
    return response.data;
  },
};
