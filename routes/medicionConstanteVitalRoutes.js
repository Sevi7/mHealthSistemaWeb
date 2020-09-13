/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-template */
const express = require('express');
const mongoose = require('mongoose');

const MedicionConstanteVital = mongoose.model('MedicionConstanteVital');
const Temperatura = mongoose.model('Temperatura');
const FrecuenciaCardiaca = mongoose.model('FrecuenciaCardiaca');
const PresionArterial = mongoose.model('PresionArterial');
const Glucemia = mongoose.model('Glucemia');
const routerMCV = express.Router();
const middleware = require('./middleware.js');

routerMCV.use(middleware.comprobarToken);

routerMCV.get('/', async (req, res) => {
  const mediciones = await MedicionConstanteVital.find({ usuario: req.usuarioId });
  return res.status(200).send(mediciones);
});

routerMCV.post('/', async (req, res) => {
  const medicion = await MedicionConstanteVital.create({
    usuario: req.usuarioId, valor: req.body.valor,
  });
  return res.status(201).send({
    error: false,
    medicion,
  });
});

routerMCV.put('/:id', async (req, res) => {
  const { id } = req.params;
  const medicion = await MedicionConstanteVital.findByIdAndUpdate(id, req.body);
  return res.status(202).send({
    error: false,
    medicion,
  });
});

routerMCV.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const medicion = await MedicionConstanteVital.findByIdAndDelete(id);
  return res.status(202).send({
    error: false,
    medicion,
  });
});

const añadirCeroCuandoMenorADiez = (tiempo) => (tiempo < 10 ? `0${tiempo}` : tiempo);

const formatearFecha = (fecha) => {
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

routerMCV.post('/frecuenciaCardiaca', async (req, res) => {
  const valores = typeof req.body.valores === 'string' ? JSON.parse(req.body.valores) : req.body.valores;
  const resultados = [];
  for (const frecuenciaCardiaca of valores) {
    resultados.push(await FrecuenciaCardiaca.create({
      usuario: req.usuarioId,
      valor: frecuenciaCardiaca.valor,
      fecha: frecuenciaCardiaca.fecha,
      enReposo: true,
    }));
  }

  await Promise.all(resultados);
  return res.status(201).send({
    error: false,
    valores,
  });
});

routerMCV.get('/frecuenciaCardiaca', async (req, res) => {
  const { minFecha, maxFecha } = getFechaYSiguienteDiaEnSeg(req.query.fecha);
  let mediciones = await FrecuenciaCardiaca.find({
    usuario: req.usuarioId, fecha: { $gt: minFecha, $lt: maxFecha },
  });
  mediciones = mediciones.map((medicion) => ({
    valor: medicion.valor, fecha: formatearFecha(medicion.fecha), enReposo: medicion.enReposo,
  }));
  return res.status(200).send(mediciones);
});

routerMCV.post('/temperatura', async (req, res) => {
  const valores = typeof req.body.valores === 'string' ? JSON.parse(req.body.valores) : req.body.valores;
  const resultados = [];
  for (const temperatura of valores) {
    resultados.push(await Temperatura.create({
      usuario: req.usuarioId,
      valor: temperatura.valor,
      fecha: temperatura.fecha,
    }));
  }

  await Promise.all(resultados);
  return res.status(201).send({
    error: false,
    valores,
  });
});

routerMCV.get('/temperatura', async (req, res) => {
  const { minFecha, maxFecha } = getFechaYSiguienteDiaEnSeg(req.query.fecha);
  let mediciones = await Temperatura.find({
    usuario: req.usuarioId, fecha: { $gt: minFecha, $lt: maxFecha },
  });
  mediciones = mediciones.map((medicion) => ({
    valor: medicion.valor, fecha: formatearFecha(medicion.fecha),
  }));
  return res.status(200).send(mediciones);
});

routerMCV.post('/presionArterial', async (req, res) => {
  const valores = typeof req.body.valores === 'string' ? JSON.parse(req.body.valores) : req.body.valores;
  const resultados = [];
  for (const presionArterial of valores) {
    resultados.push(await PresionArterial.create({
      usuario: req.usuarioId,
      valor: presionArterial.valor,
      diastolica: presionArterial.diastolica,
      fecha: presionArterial.fecha,
    }));
  }

  await Promise.all(resultados);
  return res.status(201).send({
    error: false,
    valores,
  });
});

routerMCV.get('/presionArterial', async (req, res) => {
  const { minFecha, maxFecha } = getFechaYSiguienteDiaEnSeg(req.query.fecha);
  let mediciones = await PresionArterial.find({
    usuario: req.usuarioId, fecha: { $gt: minFecha, $lt: maxFecha },
  });
  mediciones = mediciones.map((medicion) => ({
    valor: medicion.valor, diastolica: medicion.diastolica, fecha: formatearFecha(medicion.fecha),
  }));
  return res.status(200).send(mediciones);
});

routerMCV.post('/glucemia', async (req, res) => {
  const valores = typeof req.body.valores === 'string' ? JSON.parse(req.body.valores) : req.body.valores;
  const resultados = [];
  for (const glucemia of valores) {
    resultados.push(await Glucemia.create({
      usuario: req.usuarioId,
      valor: glucemia.valor,
      fecha: glucemia.fecha,
      postprandial: false,
    }));
  }

  await Promise.all(resultados);
  return res.status(201).send({
    error: false,
    valores,
  });
});

routerMCV.get('/glucemia', async (req, res) => {
  const { minFecha, maxFecha } = getFechaYSiguienteDiaEnSeg(req.query.fecha);
  let mediciones = await Glucemia.find({
    usuario: req.usuarioId, fecha: { $gt: minFecha, $lt: maxFecha },
  });
  mediciones = mediciones.map((medicion) => ({
    valor: medicion.valor,
    fecha: formatearFecha(medicion.fecha),
    postprandial: medicion.postprandial,
  }));
  return res.status(200).send(mediciones);
});

module.exports = routerMCV;
