import api from './api';

export const certificateApi = {
  verifyCertificate: async (certificateId) => {
    const response = await api.get(`/certificates/verify/${certificateId}`);
    return response.data;
  },

  getMyCertificates: async () => {
    const response = await api.get('/certificates/my-certificates');
    return response.data;
  },

  getCertificateById: async (certificateId) => {
    const response = await api.get(`/certificates/${certificateId}`);
    return response.data;
  },
};
