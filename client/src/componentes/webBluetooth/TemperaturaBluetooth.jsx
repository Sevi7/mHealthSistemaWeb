/* eslint-disable no-await-in-loop */
/* eslint-disable no-bitwise */
import axios from 'axios';
import PropTypes from 'prop-types';

const TemperaturaBluetooth = (props) => {
  const temperaturaMediciones = [];

  const guardarTemperaturaYEnviar = async (temperatura) => {
    temperaturaMediciones.push(temperatura);
    if (temperaturaMediciones.length === 5) {
      const resEnviar = await axios.post('/medicionConstanteVital/temperatura', { valores: temperaturaMediciones });
      const temperaturaMedicionesRefrescar = temperaturaMediciones.slice();
      props.refrescarTemperaturaMediciones(temperaturaMedicionesRefrescar);
      temperaturaMediciones.splice(0, temperaturaMediciones.length);
      return resEnviar;
    }
    return temperaturaMediciones;
  };

  const handleCaracteristicaTemperatura = async (caracteristica) => {
    if (caracteristica === null) {
      const temperatura = 'Desconocida';
      console.log('Temperatura: ', temperatura);
      return temperatura;
    }

    const temperaturaData = await caracteristica.readValue();
    console.log('data: ', temperaturaData);

    try {
      const flags = temperaturaData.getUint8(0);
      const temperatura = (temperaturaData.getUint8(1) + temperaturaData.getUint8(2) * 256) / 10;
      const fecha = new Date().getTime();
      const temperaturaFecha = {
        valor: temperatura,
        fecha,
      };
      console.log('Temperatura', temperaturaFecha);
      guardarTemperaturaYEnviar(temperaturaFecha).then(null);
      return temperaturaFecha;
    } catch (error) {
      console.log(error);
      const temperatura = 'Desconocida';
      console.log('Temperatura: ', temperatura);
      return temperatura;
    }
  };

  const getTemperatura = async (servicio) => {
    const caracteristica = await servicio.getCharacteristic('temperature_measurement');
    const temperatura = await handleCaracteristicaTemperatura(caracteristica);
    return temperatura;
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  (async () => {
    props.resetearBotonConectar();
    const dispositivo = await navigator.bluetooth.requestDevice({
      filters: [{
        services: ['health_thermometer'],
      }],
    });
    console.log('dispositivo: ', dispositivo);
    const servidor = await dispositivo.gatt.connect();
    console.log('servidor: ', servidor);
    const servicio = await servidor.getPrimaryService('health_thermometer');
    console.log('servicio: ', servicio);
    while (true) {
      await getTemperatura(servicio);
      await sleep(1000);
    }
  })();
  return (null);
};

TemperaturaBluetooth.propTypes = {
  resetearBotonConectar: PropTypes.func.isRequired,
  refrescarTemperaturaMediciones: PropTypes.func.isRequired,
};

export default TemperaturaBluetooth;
