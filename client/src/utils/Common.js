const moment = require('moment');

const setSesionUsuario = (usuarioID, token, expiraEn) => {
  sessionStorage.setItem('usuarioID', usuarioID);
  sessionStorage.setItem('token', token);
  const expiraFecha = moment().local().add(expiraEn, 'seconds');
  sessionStorage.setItem('expiraFecha', expiraFecha);
};

/* para obtener el usuario en vez del usuarioID
  const userStr = sessionStorage.getItem('usuario');
  if (userStr) return JSON.parse(userStr);
  else return null; */
const getUsuarioID = () => sessionStorage.getItem('usuarioID') || null;

const getToken = () => sessionStorage.getItem('token') || null;

const eliminarSesionUsuario = () => {
  sessionStorage.removeItem('usarioID');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('expiraFecha');
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
  getToken,
  eliminarSesionUsuario,
  sesionIniciada,
  getFechaHoy,
};
