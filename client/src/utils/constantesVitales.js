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
  valoresCriticos: {
    frecuenciaCardiaca: {
      enReposo: {
        minimoCritico: 40,
        minimo: 60,
        maximo: 110,
        maximoCritico: 120,
      },
    },
    temperatura: {
      minimoCritico: 35,
      minimo: 36.1,
      maximo: 37.2,
      maximoCritico: 40,
    },
    presionArterial: {
      sistolica: {
        minimo: 90,
        maximo: 120,
        maximoCritico: 130,
      },
      diastolica: {
        minimo: 60,
        maximo: 80,
        maximoCritico: 81,
      },
    },
    glucemia: {
      noDiabetes: {
        ayuno: {
          minimoCritico: 54,
          minimo: 70,
          maximo: 100,
          maximoCritico: 125,
        },
        postprandial: {
          minimoCritico: 54,
          minimo: 70,
          maximo: 140,
          maximoCritico: 200,
        },
      },
      diabetes: {
        ayuno: {
          minimoCritico: 54,
          minimo: 80,
          maximo: 130,
          maximoCritico: 180,
        },
        postprandial: {
          minimoCritico: 54,
          minimo: 80,
          maximo: 180,
          maximoCritico: 250,
        },
      },
    },
    default: {},
  },
};
