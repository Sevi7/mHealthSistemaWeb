const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var options = {discriminatorKey: 'tipoConstanteVital'};

const medicionConstanteVitalSchema = new Schema({
    valor: {type: Number, required: true},
    usuario: {type: String, required: true}}
    , options);

const MedicionConstanteVital = mongoose.model('MedicionConstanteVital', medicionConstanteVitalSchema);


const Temperatura = MedicionConstanteVital.discriminator('Temperatura', 
    new Schema({}),
    options);

MedicionConstanteVital.discriminator('Peso', 
    new Schema({
        grasaCorporal: Number,
        masaMuscular: Number,
        grasaVisceral: Number,
        masaOsea: Number,
        aguaCorporal: Number,
        proteinas: Number,
        metabolismo: Number
    },
    options));

MedicionConstanteVital.discriminator('PresionArterial', 
    new Schema({
        diastolica: Number
    }, 
    options));

MedicionConstanteVital.discriminator('FrecuenciaCardiaca', 
    new Schema({
        enReposo: Boolean
    },
    options));

 MedicionConstanteVital.discriminator('Glucemia',  
    new Schema({
        postprandial: Boolean
    },
    options));

MedicionConstanteVital.discriminator('SaturacionOxigeno', 
    new Schema({}),
    options);

