const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config.js')
//const cors = require('cors');


// IMPORT MODELS
require('./models/MedicionConstanteVital');
require('./models/Usuario');

const app = express();
//app.use(cors());
/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/mHealthDatabase`, {useNewUrlParser: true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* CON ESTO NO PUEDO USAR MIDDLEWARE
app.use(express.static(__dirname + '/public'));
app.get('*', (req,res) => res.sendFile(path.join(__dirname+'/public/index.html')))
*/

//IMPORT ROUTES
require('./routes/iniciarSesionRoutes')(app);
require('./routes/registroUsuarioRoutes')(app);
require('./routes/middleware');

var usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/usuario', usuarioRoutes); 

var medicionConstanteVitalRoutes = require('./routes/medicionConstanteVitalRoutes');
app.use('/medicionConstanteVital', medicionConstanteVitalRoutes); 

/*
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })

}
*/
app.listen(config.PORT, () => {
  console.log(`app running on port ${config.PORT}`)
});



