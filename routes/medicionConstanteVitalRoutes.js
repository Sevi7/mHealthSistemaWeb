/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-template */
const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

const MedicionConstanteVital = mongoose.model('MedicionConstanteVital');
const Temperatura = mongoose.model('Temperatura');
const FrecuenciaCardiaca = mongoose.model('FrecuenciaCardiaca');
const PresionArterial = mongoose.model('PresionArterial');
const Glucemia = mongoose.model('Glucemia');
const routerMCV = express.Router();
const middleware = require('./middleware.js');
const { getValoresCriticosMedicion, getNivelAlerta } = require('../utils/alertas');

routerMCV.use(middleware.comprobarToken);

const añadirCeroCuandoMenorADiez = (tiempo) => (tiempo < 10 ? `0${tiempo}` : tiempo);

const getHoraMinSeg = (fecha) => {
  const fechaObjeto = new Date(fecha);
  return añadirCeroCuandoMenorADiez(fechaObjeto.getHours())
    + ':' + añadirCeroCuandoMenorADiez(fechaObjeto.getMinutes())
    + ':' + añadirCeroCuandoMenorADiez(fechaObjeto.getSeconds());
};

const getFechaYSiguienteDiaEnSeg = (fechaString) => {
  const fechaStringPartes = fechaString.split('/');
  let fecha = new Date(fechaStringPartes[2], fechaStringPartes[1] - 1, fechaStringPartes[0]);
  fecha = new Date(fecha.getTime() + Math.abs(fecha.getTimezoneOffset() * 60000));
  const minFecha = fecha.getTime();
  fecha.setDate(fecha.getDate() + 1);
  const maxFecha = fecha.getTime();

  return { minFecha, maxFecha };
};

const fechaEsValida = (fecha) => {
  const fechaTest = moment(fecha, 'DD/MM/YYYY');
  return fechaTest.isValid();
};

routerMCV.get('/frecuenciaCardiaca', async (req, res) => {
  const { fecha } = req.query;

  if (!fechaEsValida(fecha)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'La fecha introducida no es válida. El formato debe ser DD/MM/YYYY',
      },
    });
  }

  const { minFecha, maxFecha } = getFechaYSiguienteDiaEnSeg(fecha);
  let mediciones = await FrecuenciaCardiaca.find({
    usuario: req.usuarioId, fecha: { $gt: minFecha, $lt: maxFecha },
  });
  mediciones = mediciones.map((medicion) => ({
    valor: medicion.valor,
    fecha: getHoraMinSeg(medicion.fecha),
    enReposo: medicion.enReposo,
    alerta: medicion.alerta,
  }));
  return res.status(200).send(mediciones);
});

routerMCV.post('/frecuenciaCardiaca', async (req, res) => {
  let mediciones;
  const resultados = [];
  try {
    mediciones = typeof req.body.valores === 'string' ? JSON.parse(req.body.valores) : req.body.valores;
  } catch (error) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `El formato introducido no es correcto. Detalles: ${error.message}`,
      },
    });
  }
  if (!mediciones.every((medicion) => typeof medicion.valor === 'number' && typeof medicion.fecha === 'number' && typeof medicion.enReposo === 'boolean')) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'El formato introducido de las mediciones no es correcto. Todas las mediciones deben tener \'valor\' (Number), \'fecha\' en milisegundos (Number), \'enReposo\' (Boolean)',
      },
    });
  }

  if (mediciones) {
    const valoresCriticosMedicion = await getValoresCriticosMedicion(mediciones[0], 'frecuenciaCardiaca', req.usuarioId);
    for (const frecuenciaCardiaca of mediciones) {
      resultados.push(await FrecuenciaCardiaca.create({
        usuario: req.usuarioId,
        valor: frecuenciaCardiaca.valor,
        fecha: frecuenciaCardiaca.fecha,
        enReposo: frecuenciaCardiaca.enReposo,
        alerta: getNivelAlerta(frecuenciaCardiaca.valor, valoresCriticosMedicion),
      }));
    }
  }

  await Promise.all(resultados);
  return res.status(201).send({
    ok: true,
    mediciones,
  });
});

routerMCV.get('/temperatura', async (req, res) => {
  const { fecha } = req.query;

  if (!fechaEsValida(fecha)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'La fecha introducida no es válida. El formato debe ser DD/MM/YYYY',
      },
    });
  }

  const { minFecha, maxFecha } = getFechaYSiguienteDiaEnSeg(fecha);
  let mediciones = await Temperatura.find({
    usuario: req.usuarioId, fecha: { $gt: minFecha, $lt: maxFecha },
  });
  mediciones = mediciones.map((medicion) => ({
    valor: medicion.valor, fecha: getHoraMinSeg(medicion.fecha),
  }));
  return res.status(200).send(mediciones);
});

routerMCV.post('/temperatura', async (req, res) => {
  let mediciones;
  const resultados = [];
  try {
    mediciones = typeof req.body.valores === 'string' ? JSON.parse(req.body.valores) : req.body.valores;
  } catch (error) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `El formato introducido no es correcto. Detalles: ${error.message}`,
      },
    });
  }
  if (!mediciones.every((medicion) => typeof medicion.valor === 'number' && typeof medicion.fecha === 'number')) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'El formato introducido de las mediciones no es correcto. Todas las mediciones deben tener \'valor\' (Number), \'fecha\' en milisegundos (Number)',
      },
    });
  }
  if (mediciones) {
    const valoresCriticosMedicion = await getValoresCriticosMedicion(mediciones[0], 'temperatura', req.usuarioId);
    for (const temperatura of mediciones) {
      resultados.push(await Temperatura.create({
        usuario: req.usuarioId,
        valor: temperatura.valor,
        fecha: temperatura.fecha,
        alerta: getNivelAlerta(temperatura.valor, valoresCriticosMedicion),
      }));
    }
  }

  await Promise.all(resultados);
  return res.status(201).send({
    ok: true,
    mediciones,
  });
});

routerMCV.get('/presionArterial', async (req, res) => {
  const { fecha } = req.query;
  if (!fechaEsValida(fecha)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'La fecha introducida no es válida. El formato debe ser DD/MM/YYYY',
      },
    });
  }
  const { minFecha, maxFecha } = getFechaYSiguienteDiaEnSeg(fecha);
  let mediciones = await PresionArterial.find({
    usuario: req.usuarioId, fecha: { $gt: minFecha, $lt: maxFecha },
  });
  mediciones = mediciones.map((medicion) => ({
    valor: medicion.valor, diastolica: medicion.diastolica, fecha: getHoraMinSeg(medicion.fecha),
  }));
  return res.status(200).send(mediciones);
});

routerMCV.post('/presionArterial', async (req, res) => {
  let mediciones;
  const resultados = [];
  try {
    mediciones = typeof req.body.valores === 'string' ? JSON.parse(req.body.valores) : req.body.valores;
  } catch (error) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `El formato introducido no es correcto. Detalles: ${error.message}`,
      },
    });
  }
  if (!mediciones.every((medicion) => typeof medicion.valor === 'number' && typeof medicion.fecha === 'number' && typeof medicion.diastolica === 'number')) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'El formato introducido de las mediciones no es correcto. Todas las mediciones deben tener \'valor\' (Number), \'fecha\' en milisegundos (Number), \'diastolica\' (Number)',
      },
    });
  }
  if (mediciones) {
    const valoresCriticosMedicion = await getValoresCriticosMedicion(mediciones[0], 'presionArterial', req.usuarioId);
    for (const presionArterial of mediciones) {
      resultados.push(await PresionArterial.create({
        usuario: req.usuarioId,
        valor: presionArterial.valor,
        diastolica: presionArterial.diastolica,
        fecha: presionArterial.fecha,
        alerta: Math.max(
          getNivelAlerta(presionArterial.valor, valoresCriticosMedicion.sistolica),
          getNivelAlerta(presionArterial.diastolica, valoresCriticosMedicion.diastolica),
        ),
      }));
    }
  }

  await Promise.all(resultados);
  return res.status(201).send({
    ok: true,
    mediciones,
  });
});

routerMCV.get('/glucemia', async (req, res) => {
  const { fecha } = req.query;
  if (!fechaEsValida(fecha)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'La fecha introducida no es válida. El formato debe ser DD/MM/YYYY',
      },
    });
  }
  const { minFecha, maxFecha } = getFechaYSiguienteDiaEnSeg(fecha);
  let mediciones = await Glucemia.find({
    usuario: req.usuarioId, fecha: { $gt: minFecha, $lt: maxFecha },
  });
  mediciones = mediciones.map((medicion) => ({
    valor: medicion.valor,
    fecha: getHoraMinSeg(medicion.fecha),
    postprandial: medicion.postprandial,
  }));
  return res.status(200).send(mediciones);
});

routerMCV.post('/glucemia', async (req, res) => {
  let mediciones;
  const resultados = [];
  try {
    mediciones = typeof req.body.valores === 'string' ? JSON.parse(req.body.valores) : req.body.valores;
  } catch (error) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `El formato introducido no es correcto. Detalles: ${error.message}`,
      },
    });
  }
  if (!mediciones.every((medicion) => typeof medicion.valor === 'number' && typeof medicion.fecha === 'number' && typeof medicion.postprandial === 'boolean')) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'El formato introducido de las mediciones no es correcto. Todas las mediciones deben tener \'valor\' (Number), \'fecha\' en milisegundos (Number), \'postprandial\' (Boolean)',
      },
    });
  }
  if (mediciones) {
    const valoresCriticosMedicion = await getValoresCriticosMedicion(mediciones[0], 'glucemia', req.usuarioId);
    for (const glucemia of mediciones) {
      resultados.push(await Glucemia.create({
        usuario: req.usuarioId,
        valor: glucemia.valor,
        fecha: glucemia.fecha,
        postprandial: glucemia.postprandial,
        alerta: getNivelAlerta(glucemia.valor, valoresCriticosMedicion),
      }));
    }
  }

  await Promise.all(resultados);
  return res.status(201).send({
    ok: true,
    mediciones,
  });
});

const getConstanteVitalMongoDB = (constanteVital) => {
  if (constanteVital === 'frecuenciaCardiaca') {
    return FrecuenciaCardiaca;
  }
  if (constanteVital === 'temperatura') {
    return Temperatura;
  }
  if (constanteVital === 'presionArterial') {
    return PresionArterial;
  }
  if (constanteVital === 'glucemia') {
    return Glucemia;
  }
  return null;
};

routerMCV.delete('/', async (req, res) => {
  const { fecha, constanteVital } = req.query;

  if (!fechaEsValida(fecha)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'La fecha introducida no es válida. El formato debe ser DD/MM/YYYY',
      },
    });
  }

  const constanteVitalMongoDB = getConstanteVitalMongoDB(constanteVital);

  if (!constanteVitalMongoDB) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'La constante vital introducida es incorrecta.',
      },
    });
  }

  const { minFecha, maxFecha } = getFechaYSiguienteDiaEnSeg(fecha);

  await constanteVitalMongoDB.deleteMany({
    usuario: req.usuarioId,
    fecha: { $gt: minFecha, $lt: maxFecha },
  });

  return res.status(200).send({
    ok: true,
  });
});

routerMCV.get('/alertas', async (req, res) => {
  const { fecha } = req.query;

  if (!fechaEsValida(fecha)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'La fecha introducida no es válida. El formato debe ser DD/MM/YYYY',
      },
    });
  }

  const { minFecha, maxFecha } = getFechaYSiguienteDiaEnSeg(fecha);

  const medicionesConAlerta = await MedicionConstanteVital.find({
    usuario: req.usuarioId,
    fecha: { $gt: minFecha, $lt: maxFecha },
    alerta: { $gt: 0 },
  });

  const alertas = medicionesConAlerta.map((medicionConAlerta) => ({
    tipoConstanteVital: medicionConAlerta.tipoConstanteVital,
    valor: medicionConAlerta.valor,
    fecha: getHoraMinSeg(medicionConAlerta.fecha),
    enReposo: medicionConAlerta.enReposo,
    postprandial: medicionConAlerta.postprandial,
    diastolica: medicionConAlerta.diastolica,
    alerta: medicionConAlerta.alerta,
  }));

  return res.status(200).send(alertas);
});

module.exports = routerMCV;
