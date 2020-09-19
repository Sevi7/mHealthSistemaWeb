/* eslint-disable no-bitwise */
const conectarBluetoothGetServicio = async (servicioNombre) => {
  const dispositivo = await navigator.bluetooth.requestDevice({
    filters: [{
      services: [servicioNombre],
    }],
  });
  const servidor = await dispositivo.gatt.connect();
  const servicio = await servidor.getPrimaryService(servicioNombre);
  return servicio;
};

const sfloatToFloat = (data) => {
  let exponente = data >> 12;
  if (exponente >= 0x0008) {
    exponente = -((0x000F + 1) - exponente);
  }
  let mantissa = data & 0x0FFF;
  if (mantissa >= 0x0800) {
    mantissa = -((0x0FFF + 1) - mantissa);
  }
  const magnitude = (10 ** exponente).toFixed(8);
  return mantissa * magnitude;
};

module.exports = {
  conectarBluetoothGetServicio,
  sfloatToFloat,
};
