/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-bitwise */
import axios from 'axios';
import PropTypes from 'prop-types';
import * as webBluetooth from './webBluetooth';

const PresionArterialBluetooth = (props) => {
  const presionArterialMediciones = [];

  const guardarPresionArterialYEnviar = async (presionArterial) => {
    presionArterialMediciones.push(presionArterial);
    if (presionArterialMediciones.length === 5) {
      const resEnviar = await axios.post('/medicionConstanteVital/presionArterial', { valores: presionArterialMediciones });
      const presionArterialMedicionesRefrescar = presionArterialMediciones.slice();
      props.refrescarPresionArterialMediciones(presionArterialMedicionesRefrescar);
      presionArterialMediciones.splice(0, presionArterialMediciones.length);
      return resEnviar;
    }
    return presionArterialMediciones;
  };

  const handleCaracteristicaPresionArterial = async (caracteristica) => {
    if (caracteristica === null) {
      const presionArterial = 'Desconocida';
      console.log('PresionArterial: ', presionArterial);
      return presionArterial;
    }

    const presionArterialData = await caracteristica.readValue();
    console.log('data: ', presionArterialData);

    try {
      const flags = presionArterialData.getUint8(0);
      const presionArterialSistolica = presionArterialData.getUint8(1);
      const presionArterialDiastolica = presionArterialData.getUint8(2);
      const fecha = new Date().getTime();
      const presionArterialFecha = {
        valor: presionArterialSistolica,
        diastolica: presionArterialDiastolica,
        fecha,
      };
      console.log('PresionArterial', presionArterialFecha);
      guardarPresionArterialYEnviar(presionArterialFecha).then(null);
      return presionArterialFecha;
    } catch (error) {
      console.log(error);
      const presionArterial = 'Desconocida';
      console.log('PresionArterial: ', presionArterial);
      return presionArterial;
    }
  };

  const getPresionArterial = async (servicio) => {
    const caracteristica = await servicio.getCharacteristic('blood_pressure_measurement');
    const presionArterial = await handleCaracteristicaPresionArterial(caracteristica);
    return presionArterial;
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  props.resetearBotonConectar();
  (async () => {
    const servicioPresionArterial = await webBluetooth.conectarBluetoothGetServicio('blood_pressure');
    while (true) {
      await getPresionArterial(servicioPresionArterial);
      await sleep(1000);
    }
  })();
  return (null);
};

PresionArterialBluetooth.propTypes = {
  resetearBotonConectar: PropTypes.func.isRequired,
  refrescarPresionArterialMediciones: PropTypes.func.isRequired,
};

export default PresionArterialBluetooth;
