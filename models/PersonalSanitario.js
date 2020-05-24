const mongoose = require('mongoose');
var Schema = mongoose.Schema;
  
const PersonalSanitarioSchema = new Schema({
    nombre:{ type: String, required: true},
    apellidos: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    contraseña: { type: String, required: true},
    pacientes: [Number]
    });

mongoose.model('PersonalSanitario', PersonalSanitarioSchema);