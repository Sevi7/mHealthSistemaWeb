const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('./models/MedicionConstanteVital');
require('./models/Usuario');

const app = express();

mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mHealthDatabase', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/iniciarSesionRoutes')(app);
require('./routes/registroUsuarioRoutes')(app);
require('./routes/middleware');

const usuarioRoutes = require('./routes/usuarioRoutes');
const medicionConstanteVitalRoutes = require('./routes/medicionConstanteVitalRoutes');

app.use('/usuario', usuarioRoutes);
app.use('/medicionConstanteVital', medicionConstanteVitalRoutes);

module.exports = app;
