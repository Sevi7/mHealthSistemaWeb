const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const moment = require('moment');

const Usuario = mongoose.model('Usuario');
const config = require('../config.js');

module.exports = (app) => {
  app.post('/iniciarSesion', async (req, res) => {
    const { email, contraseña } = req.body;
    Usuario.findOne({ email }, (erro, usuarioDB) => {
      if (erro) {
        return res.status(500).json({
          ok: false,
          err: erro,
        });
      }

      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usuario no dado de alta en el sitema',
          },
        });
      }

      if (!bcrypt.compareSync(contraseña, usuarioDB.contraseña)) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usuario o contraseña incorrectos',
          },
        });
      }

      const payload = {
        usuarioId: usuarioDB.id,
        expiraFecha: moment().local().add(120, 'minutes').unix(),
      };
      const token = jwt.encode(payload, config.TOKEN_KEY);

      const usuarioDatos = {
        fechaNacimiento: usuarioDB.fechaNacimiento,
        altura: usuarioDB.altura,
        sexo: usuarioDB.sexo,
        diabetes: usuarioDB.diabetes,
      };

      return res.json({
        ok: true,
        usuarioId: usuarioDB.id,
        token,
        expiraEn: 7200,
        usuarioDatos,
      });
    });
  });
};
