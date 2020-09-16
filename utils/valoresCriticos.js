module.exports = {
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
};
