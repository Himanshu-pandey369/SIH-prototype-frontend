import api from './api';

export const progressApi = {
  getModuleProgress: async (moduleId) => {
    const response = await api.get(`/progress/${moduleId}`);
    return response.data;
  },

  updateStepProgress: async (progressData) => {
    const response = await api.post('/progress/step', progressData);
    return response.data;
  },
};
