import api from './api';

export const assessmentApi = {
  getAssessmentByModule: async (moduleId, lang = 'en') => {
    const response = await api.get(`/assessments/module/${moduleId}`, {
      params: { lang },
    });
    return response.data;
  },

  submitAssessment: async (moduleId, answers) => {
    const response = await api.post('/assessments/submit', {
      moduleId,
      answers,
    });
    return response.data;
  },
};
