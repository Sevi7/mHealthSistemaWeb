const express = require('express');
const mongoose = require('mongoose');

const Usuario = mongoose.model('Usuario');
const routerUsuario = express.Router();
const middleware = require('./middleware.js');

routerUsuario.use(middleware.comprobarToken);

routerUsuario.put('/', async (req, res) => {
  const usuario = await Usuario.findByIdAndUpdate(req.usuarioId, req.body);

  return res.status(202).send({
    ok: true,
    usuario,
  });
});

routerUsuario.delete('/', async (req, res) => {
  const usuario = await Usuario.findByIdAndDelete(req.usuarioId);

  return res.status(202).send({
    ok: true,
    usuario,
  });
});

module.exports = routerUsuario;
