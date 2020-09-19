/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-bitwise */
import axios from 'axios';
import PropTypes from 'prop-types';
import * as webBluetooth from './webBluetooth';

const FrecuenciaCardiacaBluetooth = (props) => {
  const frecuenciaCardiacaMediciones = [];

  const getZonaCuerpoString = (zonaCuerpo) => {
    if (zonaCuerpo === 0) {
      return 'Otra';
    }
    if (zonaCuerpo === 1) {
      return 'Pecho';
    }
    if (zonaCuerpo === 2) {
      return 'Muñeca';
    }
    if (zonaCuerpo === 3) {
      return 'Dedo';
    }
    if (zonaCuerpo === 4) {
      return 'Mano';
    }
    if (zonaCuerpo === 5) {
      return 'Lobulo Oreja';
    }
    if (zonaCuerpo === 6) {
      return 'Pie';
    }
    return 'Desconocida';
  };

  const handleCaracteristicaZonaCuerpoMedida = async (caracteristica) => {
    let zonaCuerpoString;
    if (caracteristica === null) {
      zonaCuerpoString = 'Desconocida';
    } else {
      const zonaCuerpoData = await caracteristica.readValue();
      try {
        const zonaCuerpoInt = await zonaCuerpoData.getUint8(0);
        zonaCuerpoString = getZonaCuerpoString(zonaCuerpoInt);
      } catch (error) {
        zonaCuerpoString = 'Desconocida';
      }
    }
    return zonaCuerpoString;
  };

  const getZonaCuerpoMedida = async (servicio) => {
    const caracteristica = await servicio.getCharacteristic('body_sensor_location');
    const zonaCuerpoMedida = await handleCaracteristicaZonaCuerpoMedida(caracteristica);
    return zonaCuerpoMedida;
  };

  const parseFrecuenciaCardiaca = (data) => {
    const flags = data.getUint8(0);
    const rate16Bits = flags & 0x1;
    const result = {};
    let index = 1;
    if (rate16Bits) {
      result.frecuenciaCardiaca = data.getUint16(index, /* littleEndian= */true);
      index += 2;
    } else {
      result.frecuenciaCardiaca = data.getUint8(index);
      index += 1;
    }
    const contactDetected = flags & 0x2;
    const contactSensorPresent = flags & 0x4;
    if (contactSensorPresent) {
      result.contactDetected = !!contactDetected;
    }
    const energyPresent = flags & 0x8;
    if (energyPresent) {
      result.energyExpended = data.getUint16(index, /* littleEndian= */true);
      index += 2;
    }
    const rrIntervalPresent = flags & 0x10;
    if (rrIntervalPresent) {
      const rrIntervals = [];
      for (; index + 1 < data.byteLength; index += 2) {
        rrIntervals.push(data.getUint16(index, /* littleEndian= */true));
      }
      result.rrIntervals = rrIntervals;
    }
    return result;
  };

  const guardarFrecuenciaCardiacaYEnviar = async (frecuenciaCardiaca) => {
    frecuenciaCardiacaMediciones.push(frecuenciaCardiaca);
    if (frecuenciaCardiacaMediciones.length === 5) {
      const resEnviar = await axios.post('/medicionConstanteVital/frecuenciaCardiaca', { valores: frecuenciaCardiacaMediciones });
      const frecuenciaCardiacaMedicionesRefrescar = frecuenciaCardiacaMediciones.slice();
      props.refrescarFrecuenciaCardiacaMediciones(frecuenciaCardiacaMedicionesRefrescar);
      frecuenciaCardiacaMediciones.splice(0, frecuenciaCardiacaMediciones.length);
      return resEnviar;
    }
    return frecuenciaCardiacaMediciones;
  };

  const onFrecuenciaCardiacaCambia = (event) => {
    const caracteristica = event.target;
    const frecuenciaCardiaca = parseFrecuenciaCardiaca(caracteristica.value);
    const fecha = new Date().getTime();
    const frecuenciaCardiacaFecha = {
      valor: frecuenciaCardiaca.frecuenciaCardiaca,
      fecha,
      enReposo: props.checkbox,
    };
    console.log('Frecuencia Cardiaca', frecuenciaCardiacaFecha);
    guardarFrecuenciaCardiacaYEnviar(frecuenciaCardiacaFecha).then(null);
  };

  const handleCaracteristicaFrecuenciaCardiaca = async (caracteristica) => {
    const char = await caracteristica.startNotifications();
    caracteristica.addEventListener('characteristicvaluechanged', onFrecuenciaCardiacaCambia);
    return char;
  };

  const getFrecuenciaCardiaca = async (servicio) => {
    const caracteristica = await servicio.getCharacteristic('heart_rate_measurement');
    const frecuenciaCardiaca = await handleCaracteristicaFrecuenciaCardiaca(caracteristica);
    return frecuenciaCardiaca;
  };

  props.resetearBotonConectar();
  (async () => {
    const servicioFrecuenciaCardiaca = await webBluetooth.conectarBluetoothGetServicio('heart_rate');
    await Promise.all([
      getZonaCuerpoMedida(servicioFrecuenciaCardiaca),
      getFrecuenciaCardiaca(servicioFrecuenciaCardiaca),
    ]);
  })();
  return (null);
};

FrecuenciaCardiacaBluetooth.propTypes = {
  resetearBotonConectar: PropTypes.func.isRequired,
  refrescarFrecuenciaCardiacaMediciones: PropTypes.func.isRequired,
};

export default FrecuenciaCardiacaBluetooth;
