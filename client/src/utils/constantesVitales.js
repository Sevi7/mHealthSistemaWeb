export default {
  nombre: {
    frecuenciaCardiaca: 'frecuenciaCardiaca',
    temperatura: 'temperatura',
    presionArterial: 'presionArterial',
    glucemia: 'glucemia',
    default: 'default',
  },
  titulo: {
    frecuenciaCardiaca: 'Frecuencia Cardiaca',
    temperatura: 'Temperatura',
    presionArterial: 'Presión Arterial',
    glucemia: 'Glucemia',
    default: 'mHealth',
  },
  tituloGrafico: {
    frecuenciaCardiaca: 'Frecuencia Cardiaca (PPM)',
    temperatura: 'Temperatura (°C)',
    presionArterial: 'Presión Arterial (mmHg)',
    glucemia: 'Glucemia (mg/dL)',
    default: '',
  },
  rangoVisual: {
    frecuenciaCardiaca: [0, 175],
    temperatura: [0, 40],
    presionArterial: [0, 175],
    glucemia: [0, 400],
    default: [null, null],
  },
  checkbox: {
    frecuenciaCardiaca: 'En Reposo',
    glucemia: 'Postprandial',
  },
  dataFormat: {
    frecuenciaCardiaca: [
      {
        name: 'Frecuencia Cardiaca', value: 'valor', filter: 'enReposo', filterTrue: 'Reposo', filterFalse: 'Ejercicio',
      },
    ],
    temperatura: [
      { name: 'Temperatura', value: 'valor' },
    ],
    presionArterial: [
      { name: 'Sistólica', value: 'valor' },
      { name: 'Diastólica', value: 'diastolica' },
    ],
    glucemia: [
      {
        name: 'Glucemia', value: 'valor', filter: 'postprandial', filterTrue: 'Postprandial', filterFalse: 'Ayuno',
      },
    ],
    default: [],
  },
};
