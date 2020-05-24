const moment = require('moment');
  
  const setSesionUsuario = (usuarioID, token, expiraEn) => {
    sessionStorage.setItem('usuarioID', usuarioID);
    sessionStorage.setItem('token', token);
    const expiraFecha = moment().add(expiraEn,'second');
    sessionStorage.setItem('expiraFecha', expiraFecha);
  }
 
  const getUsuarioID = () => {
    return sessionStorage.getItem('usuarioID') || null;
    /*para obtener el usuario en vez del usuarioID
    const userStr = sessionStorage.getItem('usuario');
    if (userStr) return JSON.parse(userStr);
    else return null;*/    
  }
 
  const getToken = () => {
    return sessionStorage.getItem('token') || null;
  }

  const eliminarSesionUsuario = () => {
    sessionStorage.removeItem('usarioID');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expiraFecha')
  }
  
  const getExpiraFecha = () => {
    const expiraFecha = sessionStorage.getItem('expiraFecha');
    return moment(expiraFecha);
  }

  const sesionIniciada = () => {
    return moment().isBefore(getExpiraFecha());
  }

  module.exports = {
    setSesionUsuario: setSesionUsuario,
    getUsuarioID: getUsuarioID,
    getToken: getToken,
    eliminarSesionUsuario: eliminarSesionUsuario,
    sesionIniciada: sesionIniciada
}

  