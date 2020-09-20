/* eslint-disable consistent-return */
const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config.js');

const comprobarToken = (req, res, next) => {
  if (!req.headers.user_token) {
    return res.status(401).json({
      ok: false,
      err: 'Cabecera no incluida en la petición',
    });
  }
  const token = req.headers.user_token;
  let payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_KEY);
  } catch (err) {
    return res.status(401).json({
      ok: false,
      err: 'Token inválido',
    });
  }
  if (moment().local().unix() > payload.expiraFecha) {
    return res.status(401).json({
      ok: false,
      err: 'Token expirado',
    });
  }
  req.usuarioId = payload.usuarioId;
  next();
};
module.exports = {
  comprobarToken,
};
