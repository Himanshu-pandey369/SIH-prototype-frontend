import api from './api';

export const moduleApi = {
  getAllModules: async () => {
    const response = await api.get('/modules');
    return response.data;
  },

  getModuleByCode: async (code) => {
    const response = await api.get(`/modules/${code}`);
    return response.data;
  },
};
