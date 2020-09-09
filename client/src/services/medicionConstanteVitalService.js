import axios from 'axios';

export default {
  getAll: async () => {
    const res = await axios.get('/medicionConstanteVital');
    return res.data || [];
  },
  getFrecuenciaCardiaca: async (fecha) => {
    const res = await axios.get(`/medicionConstanteVital/frecuenciaCardiaca?fecha=${fecha}`);
    return res.data;
  },
};
