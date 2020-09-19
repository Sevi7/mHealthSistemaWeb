/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-bitwise */
import axios from 'axios';
import PropTypes from 'prop-types';
import * as webBluetooth from './webBluetooth';

const GlucemiaBluetooth = (props) => {
  const enviarGlucemia = async (glucemia) => {
    const resEnviar = await axios.post('/medicionConstanteVital/glucemia', { valores: [glucemia] });
    props.refrescarGlucemiaMediciones([glucemia]);
    return resEnviar;
  };

  const handleCaracteristicaGlucemia = async (caracteristica) => {
    if (caracteristica === null) {
      const glucemia = 'Desconocida';
      return glucemia;
    }

    const glucemiaData = await caracteristica.readValue();
    console.log('data: ', glucemiaData);

    try {
      const flags = glucemiaData.getUint8(0);
      const glucemiaField = glucemiaData.getUint16(10);

      const glucemiaKgL = webBluetooth.sfloatToFloat(glucemiaField);

      let glucemiaMgDl = glucemiaKgL * 10 ** 5;
      glucemiaMgDl = glucemiaMgDl.toFixed(0);
      glucemiaMgDl = parseInt(glucemiaMgDl, 10);

      const fecha = new Date().getTime();
      const glucemiaFecha = {
        valor: glucemiaMgDl,
        fecha,
        postprandial: props.checkbox,
      };
      console.log('Glucemia', glucemiaFecha);
      enviarGlucemia(glucemiaFecha).then(null);
      return glucemiaFecha;
    } catch (error) {
      console.log(error);
      const glucemia = 'Desconocida';
      console.log('Glucemia: ', glucemia);
      return glucemia;
    }
  };

  const getGlucemia = async (servicio) => {
    const caracteristica = await servicio.getCharacteristic('glucose_measurement');
    const glucemia = await handleCaracteristicaGlucemia(caracteristica);
    return glucemia;
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  props.resetearBotonConectar();
  (async () => {
    const servicioGlucemia = await webBluetooth.conectarBluetoothGetServicio('glucose');
    while (true) {
      await getGlucemia(servicioGlucemia);
      await sleep(5000);
    }
  })();
  return (null);
};

GlucemiaBluetooth.propTypes = {
  resetearBotonConectar: PropTypes.func.isRequired,
  refrescarGlucemiaMediciones: PropTypes.func.isRequired,
};

export default GlucemiaBluetooth;
