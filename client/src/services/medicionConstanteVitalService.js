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
  getTemperatura: async (fecha) => {
    const res = await axios.get(`/medicionConstanteVital/temperatura?fecha=${fecha}`);
    return res.data;
  },
  getPresionArterial: async (fecha) => {
    const res = await axios.get(`/medicionConstanteVital/presionArterial?fecha=${fecha}`);
    return res.data;
  },
  getGlucemia: async (fecha) => {
    const res = await axios.get(`/medicionConstanteVital/glucemia?fecha=${fecha}`);
    return res.data;
  },
};
