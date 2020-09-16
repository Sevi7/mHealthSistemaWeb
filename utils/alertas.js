const mongoose = require('mongoose');

const Usuario = mongoose.model('Usuario');
const valoresCriticos = require('./valoresCriticos');

const calcularEdad = (fechaNacimiento) => {
  const edadDifSec = Date.now() - fechaNacimiento.getTime();
  const edadFecha = new Date(edadDifSec);
  return Math.abs(edadFecha.getUTCFullYear() - 1970);
};

const getValoresCriticosFrecuenciaCardiacaEnEjercicio = (edad, sexo) => (
  sexo === 'masculino'
    ? {
      minimoCritico: 60,
      minimo: (220 - edad) * 0.5,
      maximo: (220 - edad) * 0.85,
      maximoCritico: 220 - edad,
    }
    : {
      minimoCritico: 60,
      minimo: (226 - edad) * 0.5,
      maximo: (226 - edad) * 0.85,
      maximoCritico: 226 - edad,
    }
);

const getValoresCriticosMedicion = async (medicion, constanteVital, usuarioId) => {
  if (constanteVital === 'temperatura' || constanteVital === 'presionArterial') {
    return valoresCriticos[constanteVital];
  }

  if (constanteVital === 'frecuenciaCardiaca') {
    if (medicion.enReposo) {
      return valoresCriticos[constanteVital].enReposo;
    }
    const { fechaNacimiento, sexo } = await Usuario.findById(usuarioId);
    const edad = calcularEdad(fechaNacimiento);
    return getValoresCriticosFrecuenciaCardiacaEnEjercicio(edad, sexo);
  }

  if (constanteVital === 'glucemia') {
    const { diabetes } = await Usuario.findById(usuarioId);
    if (diabetes) {
      if (medicion.postprandial) {
        return valoresCriticos[constanteVital].diabetes.postprandial;
      }
      return valoresCriticos[constanteVital].diabetes.ayuno;
    }
    if (medicion.postprandial) {
      return valoresCriticos[constanteVital].noDiabetes.postprandial;
    }
    return valoresCriticos[constanteVital].noDiabetes.ayuno;
  }
  return null;
};

const getNivelAlerta = (valor, valoresCriticosMedicion) => {
  if (valor < valoresCriticosMedicion.minimoCritico
    || valor > valoresCriticosMedicion.maximoCritico) {
    return 2;
  }
  if (valor < valoresCriticosMedicion.minimo
    || valor > valoresCriticosMedicion.maximo) {
    return 1;
  }
  return 0;
};

module.exports = {
  getValoresCriticosMedicion,
  getNivelAlerta,
};
