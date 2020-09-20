const mongoose = require('mongoose');

const { Schema } = mongoose;

const Sexo = Object.freeze({
  Masculino: 'masculino',
  Femenino: 'femenino',
});

const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  altura: Number,
  sexo: {
    type: String,
    enum: Object.values(Sexo),
  },
  diabetes: Boolean,
  temperaturaMin: Number,
  temperaturaMax: Number,
  pesoMin: Number,
  pesoMax: Number,
  sistolicaMin: Number,
  sistolicaMax: Number,
  diastolicaMin: Number,
  diastolicaMax: Number,
  frecuenciaCardiacaReposoMin: Number,
  frecuenciaCardiacaReposoMax: Number,
  frecuenciaCardiacaEjercioMin: Number,
  frecuenciaCardiacaEjercioMax: Number,
  glucemiaMin: Number,
  glucemiaMax: Number,
  glucemiaPostprandialMin: Number,
  glucemiaPostrandialMax: Number,
  saturacionOxigenoMin: Number,
  saturacionOxigenoMax: Number,
});

mongoose.model('Usuario', UsuarioSchema);
