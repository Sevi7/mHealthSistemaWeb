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
  deleteMedicionConstanteVital: async (constanteVital, fecha) => {
    const res = await axios.delete(`/medicionConstanteVital?constanteVital=${constanteVital}&fecha=${fecha}`);
    return res.data;
  },
  getAlertas: async (fecha) => {
    const res = await axios.get(`/medicionConstanteVital/alertas?fecha=${fecha}`);
    return res.data;
  },
};
