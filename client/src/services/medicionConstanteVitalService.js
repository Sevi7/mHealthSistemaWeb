import axios from 'axios';

export default {
  getAll: async () => {
    let res = await axios.get(`/medicionConstanteVital`);
    return res.data || [];
  }
}