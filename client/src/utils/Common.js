/* eslint-disable no-underscore-dangle */
const moment = require('moment');

const setSesionUsuario = (usuarioID, token, expiraEn, usuarioDatos) => {
  sessionStorage.setItem('usuarioID', usuarioID);
  sessionStorage.setItem('token', token);
  const expiraFecha = moment().local().add(expiraEn, 'seconds');
  sessionStorage.setItem('expiraFecha', expiraFecha);
  sessionStorage.setItem('usuarioDatos', JSON.stringify(usuarioDatos));
};

const getUsuarioID = () => sessionStorage.getItem('usuarioID') || null;

const getUsuarioDatos = () => {
  const usuarioDatosStr = sessionStorage.getItem('usuarioDatos');
  return usuarioDatosStr ? JSON.parse(usuarioDatosStr) : null;
};

const getToken = () => sessionStorage.getItem('token') || null;

const eliminarSesionUsuario = () => {
  sessionStorage.removeItem('usarioID');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('expiraFecha');
  sessionStorage.removeItem('usuarioDatos');
};

const getExpiraFecha = () => {
  const expiraFecha = sessionStorage.getItem('expiraFecha');
  return moment(expiraFecha, 'ddd MMM DD YYYY HH:mm:ss Z');
};

const sesionIniciada = () => moment().local().isBefore(getExpiraFecha());

const getFechaHoy = () => moment().local().format('DD/MM/YYYY');

module.exports = {
  setSesionUsuario,
  getUsuarioID,
  getUsuarioDatos,
  getToken,
  eliminarSesionUsuario,
  sesionIniciada,
  getFechaHoy,
};
