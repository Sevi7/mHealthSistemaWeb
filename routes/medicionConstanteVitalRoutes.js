const express = require('express');
const mongoose = require('mongoose');
const MedicionConstanteVital = mongoose.model('MedicionConstanteVital');
const Temperatura = mongoose.model('Temperatura');
const Peso = mongoose.model('Peso');
const routerMCV = express.Router();
const middleware = require('./middleware.js')

routerMCV.use(middleware.comprobarToken);

routerMCV.get(`/`, async (req, res) => {
  let mediciones = await MedicionConstanteVital.find({ usuario: req.usuarioId });
  return res.status(200).send(mediciones);
});

routerMCV.post(`/`, async (req, res) => {
  let medicion = await MedicionConstanteVital.create({ usuario: req.usuarioId, valor: req.body.valor });
  return res.status(201).send({
    error: false,
    medicion
  })
})

routerMCV.put(`/:id`, async (req, res) => {
  const { id } = req.params;

  let medicion = await Medicion.findByIdAndUpdate(id, req.body);

  return res.status(202).send({
    error: false,
    medicion
  })

});

routerMCV.delete(`/:id`, async (req, res) => {
  const { id } = req.params;

  let medicion = await MedicionConstanteVital.findByIdAndDelete(id);

  return res.status(202).send({
    error: false,
    medicion
  })

})

routerMCV.post(`/temperatura`, async (req, res) => {
  let temperatura = await Temperatura.create({ usuario: req.usuarioId, valor: req.body.valor });
  return res.status(201).send({
    error: false,
    temperatura
  })

})

routerMCV.post(`/peso`, async (req, res) => {
  let peso = await Peso.create({ usuario: req.usuarioId, valor: req.body.valor });
  return res.status(201).send({
    error: false,
    peso
  })

})

module.exports = routerMCV;