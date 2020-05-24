const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const moment = require('moment');
const config = require('../config.js')

module.exports = (app) => {
    
    app.post('/registroUsuario', async (req, res) => {
        let body = req.body;
        let { nombre, apellidos, email, contraseña, fechaNacimiento, altura, sexo, diabetes } = body;

        if (altura !== undefined) { altura = altura.replace(/,/g, '.'); }
        let erroresValidacion = await validacionDatosRegistro(nombre, apellidos, email, contraseña, fechaNacimiento, altura, sexo, diabetes)

        if (Object.keys(erroresValidacion).length !== 0) {
            return res.status(400).json({
                ok: false,
                err: erroresValidacion
            });
        } else {
            const saltRounds = 10;
            diabetes === 'si' ? diabetes = true : diabetes = false
            //En Javascript los meses son 0-11 en vez de 1-12 y el constructor es Date(YYYY/MM/DD)
            let fechaPartes = fechaNacimiento.split("/");
            fechaNacimiento = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0]);
            //Hay que eliminar el offset de la zona horaria para obtener el valor que ha introducido el usuario
            fechaNacimiento = new Date(fechaNacimiento.getTime() + Math.abs(fechaNacimiento.getTimezoneOffset() * 60000))

            try {
                contraseña = await bcrypt.hash(contraseña, saltRounds)
            } catch (erro) {
                return res.status(500).json({
                    ok: false,
                    err: erro
                })
            }

            let usuario = new Usuario({
                nombre,
                apellidos,
                email,
                contraseña,
                fechaNacimiento,
                altura,
                sexo,
                diabetes
            });

            await usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: err
                    });
                }

                // Genera el token de autenticación
                const payload = {
                    usuarioId: usuarioDB.id,
                    expiraFecha: moment().add(120, 'minutes').unix()
                }
                let token = jwt.encode(payload, config.TOKEN_KEY);

                res.json({
                    ok: true,
                    usuarioId: usuarioDB.id,
                    token: token,
                    expiraEn: 7200
                });
            })
        }
    });

    const validarEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const emailYaExiste = async (email) => {
        return await Usuario.exists({ email: email });
    }

    const validarFechaNacimiento = (fechaNacimiento) => {
        var fechaTest = moment(fechaNacimiento, "DD/MM/YYYY")
        return fechaTest.isValid();
    }

    const validacionDatosRegistro = async (nombre, apellidos, email, contraseña, fechaNacimiento, altura, sexo, diabetes) => {
        let erroresValidacion = {}
        if (nombre === undefined || nombre === '') erroresValidacion.nombre = 'El campo Nombre no puede estar vacío'
        if (apellidos === undefined || apellidos === '') erroresValidacion.apellidos = 'El campo Apellidos no puede estar vacío'
        if (email === undefined || email === '') erroresValidacion.email = 'El campo Email no puede estar vacío'
        else if (!validarEmail(email)) erroresValidacion.email = 'El valor introducido en el campo Email no tiene un formato válido'
        else if (await emailYaExiste(email)) erroresValidacion.email = 'El email introducido ya está dado de alta en el sistema'
        if (contraseña === undefined || contraseña === '') erroresValidacion.contraseña = 'El campo Contraseña no puede estar vacío'
        if (fechaNacimiento === undefined || fechaNacimiento === null) erroresValidacion.fechaNacimiento = 'El campo Fecha de Nacimiento no puede estar vacío'
        else if (!validarFechaNacimiento(fechaNacimiento)) erroresValidacion.fechaNacimiento = 'El valor introducido en el campo Fecha Nacimiento no tiene un formato válido (DD/MM/AAAA)'
        if (altura === undefined || altura === '') erroresValidacion.altura = 'El campo Altura no puede estar vacío'
        else if (altura < 1 || altura > 2.5) erroresValidacion.altura = 'El valor introducido en el campo Altura no es válido'
        if (sexo === undefined || sexo === '') erroresValidacion.sexo = 'El campo Sexo no puede estar vacío'
        else if (!(sexo === 'masculino' || sexo === 'femenino')) erroresValidacion.sexo = 'El valor introducido en el campo Sexo debe ser masculino o femenino'
        if (diabetes === undefined || (diabetes !== '' && diabetes !== 'si' && diabetes !== 'no')) erroresValidacion.diabetes = 'El valor introducido en el campo Diabetes no tiene un formato válido (si/no)'
        return erroresValidacion;
    }
}
