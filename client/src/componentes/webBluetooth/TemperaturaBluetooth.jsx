/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-bitwise */
import axios from 'axios';
import PropTypes from 'prop-types';
import * as webBluetooth from './webBluetooth';

const TemperaturaBluetooth = (props) => {
  const enviarTemperatura = async (temperatura) => {
    const resEnviar = await axios.post('/medicionConstanteVital/temperatura', { valores: [temperatura] });
    props.refrescarTemperaturaMediciones([temperatura]);
    return resEnviar;
  };

  const handleCaracteristicaTemperatura = async (caracteristica) => {
    if (caracteristica === null) {
      const temperatura = 'Desconocida';
      return temperatura;
    }

    const temperaturaData = await caracteristica.readValue();

    try {
      const flags = temperaturaData.getUint8(0);
      const temperatura = (temperaturaData.getUint8(1) + temperaturaData.getUint8(2) * 256) / 10;
      const fecha = new Date().getTime();
      const temperaturaFecha = {
        valor: temperatura,
        fecha,
      };
      enviarTemperatura(temperaturaFecha).then(null);
      return temperaturaFecha;
    } catch (error) {
      console.log(error);
      const temperatura = 'Desconocida';
      return temperatura;
    }
  };

  const getTemperatura = async (servicio) => {
    const caracteristica = await servicio.getCharacteristic('temperature_measurement');
    const temperatura = await handleCaracteristicaTemperatura(caracteristica);
    return temperatura;
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  props.resetearBotonConectar();
  (async () => {
    const servicioTemperatura = await webBluetooth.conectarBluetoothGetServicio('health_thermometer');
    while (true) {
      await getTemperatura(servicioTemperatura);
      await sleep(5000);
    }
  })();
  return (null);
};

TemperaturaBluetooth.propTypes = {
  resetearBotonConectar: PropTypes.func.isRequired,
  refrescarTemperaturaMediciones: PropTypes.func.isRequired,
};

export default TemperaturaBluetooth;
