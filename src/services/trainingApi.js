import api from './api';

export const trainingApi = {
  submitTrainingResult: async (resultData) => {
    const response = await api.post('/training-results', resultData);
    return response.data;
  },

  getMyTrainingResults: async () => {
    const response = await api.get('/training-results/my-results');
    return response.data;
  },
};
