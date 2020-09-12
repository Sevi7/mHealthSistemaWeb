const conectarBluetoothGetServicio = async (servicioNombre) => {
  const dispositivo = await navigator.bluetooth.requestDevice({
    filters: [{
      services: [servicioNombre],
    }],
  });
  console.log('dispositivo: ', dispositivo);
  const servidor = await dispositivo.gatt.connect();
  console.log('servidor: ', servidor);
  const servicio = await servidor.getPrimaryService(servicioNombre);
  return servicio;
};

module.exports = {
  conectarBluetoothGetServicio,
};
