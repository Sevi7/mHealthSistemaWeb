const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const moment = require('moment');
const config = require('../config.js')

module.exports = (app) => {

    app.post(`/iniciarSesion`, async (req, res) => {
        let body = req.body;
        Usuario.findOne({ email: body.email }, (erro, usuarioDB)=>{
          if (erro) {
            return res.status(500).json({
               ok: false,
               err: erro
            })
         }
        // Verifica que exista un usuario con el mail escrita por el usuario.
        if (!usuarioDB) {
           return res.status(400).json({
             ok: false,
             err: {
                 message: "Usuario no dado de alta en el sitema"
             }
          })
        }
        // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
        if (! bcrypt.compareSync(body.contraseña, usuarioDB.contraseña)){
           return res.status(400).json({
              ok: false,
              err: {
                message: "Usuario o contraseña incorrectos"
              }
           });
        }
        // Genera el token de autenticación
        const payload = {
          usuarioId: usuarioDB.id,
          expiraFecha: moment().add(120,'minutes').unix()
          }
         let token = jwt.encode(payload, config.TOKEN_KEY);
         
         res.json({
             ok: true,
             usuarioId: usuarioDB.id,
             token: token,
             expiraEn: 7200
         })
      })
      })
      
}