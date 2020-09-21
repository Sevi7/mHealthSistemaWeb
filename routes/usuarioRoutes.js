const express = require('express');
const mongoose = require('mongoose');

const Usuario = mongoose.model('Usuario');
const MedicionConstanteVital = mongoose.model('MedicionConstanteVital');
const routerUsuario = express.Router();
const middleware = require('./middleware.js');

routerUsuario.use(middleware.comprobarToken);

routerUsuario.get('/', async (req, res) => {
  const { usuarioId } = req;
  const usuario = await Usuario.findById(usuarioId);

  const usuarioDatos = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    email: usuario.email,
    fechaNacimiento: usuario.fechaNacimiento,
    altura: usuario.altura,
    sexo: usuario.sexo,
    diabetes: usuario.diabetes,
  };
  return res.status(202).send({
    ok: true,
    usuarioDatos,
  });
});

routerUsuario.delete('/', async (req, res) => {
  const { usuarioId } = req;
  const usuario = await Usuario.findByIdAndDelete(usuarioId);

  await MedicionConstanteVital.deleteMany({ usuario: usuarioId });

  const usuarioDatos = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    email: usuario.email,
    fechaNacimiento: usuario.fechaNacimiento,
    altura: usuario.altura,
    sexo: usuario.sexo,
    diabetes: usuario.diabetes,
  };

  return res.status(202).send({
    ok: true,
    usuarioDatos,
  });
});

module.exports = routerUsuario;
