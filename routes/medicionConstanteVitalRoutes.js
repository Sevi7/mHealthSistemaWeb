/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-template */
const express = require('express');
const mongoose = require('mongoose');

const MedicionConstanteVital = mongoose.model('MedicionConstanteVital');
const Temperatura = mongoose.model('Temperatura');
const Peso = mongoose.model('Peso');
const FrecuenciaCardiaca = mongoose.model('FrecuenciaCardiaca');
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

routerMCV.post('/temperatura', async (req, res) => {
  const temperatura = await Temperatura.create({ usuario: req.usuarioId, valor: req.body.valor });
  return res.status(201).send({
    error: false,
    temperatura,
  });
});

routerMCV.post('/peso', async (req, res) => {
  const peso = await Peso.create({ usuario: req.usuarioId, valor: req.body.valor });
  return res.status(201).send({
    error: false,
    peso,
  });
});

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

const añadirCeroCuandoMenorADiez = (tiempo) => (tiempo < 10 ? `0${tiempo}` : tiempo);

const formatearFecha = (fecha) => {
  const fechaObjeto = new Date(fecha);
  return añadirCeroCuandoMenorADiez(fechaObjeto.getHours())
    + ':' + añadirCeroCuandoMenorADiez(fechaObjeto.getMinutes())
    + ':' + añadirCeroCuandoMenorADiez(fechaObjeto.getSeconds());
};

routerMCV.get('/frecuenciaCardiaca', async (req, res) => {
  const fechaString = req.query.fecha;
  const fechaStringPartes = fechaString.split('/');
  let fecha = new Date(fechaStringPartes[2], fechaStringPartes[1] - 1, fechaStringPartes[0]);
  fecha = new Date(fecha.getTime() + Math.abs(fecha.getTimezoneOffset() * 60000));
  const minFecha = fecha.getTime();
  fecha.setDate(fecha.getDate() + 1);
  const maxFecha = fecha.getTime();
  let mediciones = await FrecuenciaCardiaca.find({
    usuario: req.usuarioId, fecha: { $gt: minFecha, $lt: maxFecha },
  });
  mediciones = mediciones.map((medicion) => ({
    valor: medicion.valor, fecha: formatearFecha(medicion.fecha), enReposo: medicion.enReposo,
  }));
  console.log(mediciones);
  return res.status(200).send(mediciones);
});

module.exports = routerMCV;
