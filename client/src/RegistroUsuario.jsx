/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import axios from 'axios';
import moment from 'moment';
import Common from './utils/Common';

class LocalizedUtils extends MomentUtils {
  getDatePickerHeaderText(date) {
    return moment(date).format('DD/MM/YYYY');
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  errmsg: {
    color: 'red',
    textAlign: 'center',
  },
}));

export default function RegistroUsuario() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [repetirContraseña, setRepetirContraseña] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [altura, setAltura] = useState('');
  const [sexo, setSexo] = useState('');
  const [diabetes, setDiabetes] = useState('');
  const [mensaje, setMensaje] = useState();
  const [errors, setErrors] = useState({});

  const classes = useStyles();

  const validarEmail = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
    return re.test(String(email).toLowerCase());
  };

  const validacionDatosRegistro = () => {
    const erroresValidacion = {};
    if (nombre === '') erroresValidacion.nombre = 'Este campo no puede estar vacío';
    if (apellidos === '') erroresValidacion.apellidos = 'Este campo no puede estar vacío';
    if (email === '') erroresValidacion.email = 'Este campo no puede estar vacío';
    else if (!validarEmail()) erroresValidacion.email = 'El valor introducido en el campo Email no tiene un formato válido';
    if (contraseña === '') erroresValidacion.contraseña = 'Este campo no puede estar vacío';
    if (repetirContraseña === '') erroresValidacion.repetirContraseña = 'Este campo no puede estar vacío';
    if (contraseña !== repetirContraseña) { erroresValidacion.contraseña = 'Las contraseñas no coinciden'; erroresValidacion.repetirContraseña = 'Las contraseñas no coinciden'; }
    if (fechaNacimiento === null) erroresValidacion.fechaNacimiento = 'Este campo no puede estar vacío';
    else if (!fechaNacimiento._isValid) erroresValidacion.fechaNacimiento = 'El valor introducido no es válido';
    if (altura === '') erroresValidacion.altura = 'Este campo no puede estar vacío';
    else if (altura < 1 || altura > 2.5) erroresValidacion.altura = 'El valor introducido no es válido';
    if (sexo === '') erroresValidacion.sexo = 'Este campo no puede estar vacío';
    return erroresValidacion;
  };

  const handleSubmit = async (event) => {
    event.persist();
    event.preventDefault();
    const erroresValidacion = await validacionDatosRegistro();
    if (Object.keys(erroresValidacion).length !== 0) {
      setErrors(erroresValidacion);
    } else {
      try {
        const fechaNacimientoString = fechaNacimiento.format('DD/MM/YYYY');
        const res = await axios.post('/registroUsuario', {
          nombre, apellidos, email, contraseña, fechaNacimiento: fechaNacimientoString, altura, sexo, diabetes,
        });
        Common.setSesionUsuario(
          res.data.usuarioId, res.data.token, res.data.expiraEn, res.data.usuarioDatos,
        );
        window.location.replace('/dashboard');
      } catch (err) {
        console.log(err);
        if (err.response.status === 400 && err.response.data.err.email === 'El email introducido ya está dado de alta en el sistema') {
          setErrors({});
          setMensaje(err.response.data.err.email);
        } else {
          setMensaje('Algo fue mal. Por favor intentelo de nuevo más tarde');
        }
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registro Usuario
        </Typography>
        <Typography component="h5" variant="h6" className={classes.errmsg}>
          {mensaje}
        </Typography>

        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="nombre"
                variant="outlined"
                fullWidth
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoFocus
                error={errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Apellidos"
                name="apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                autoComplete="family-name"
                error={errors.apellidos}
                helperText={errors.apellidos}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                error={errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="contraseña"
                label="Contraseña"
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                autoComplete="current-password"
                error={errors.contraseña}
                helperText={errors.contraseña}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="repetirContraseña"
                label="Repetir Contraseña"
                type="password"
                value={repetirContraseña}
                onChange={(e) => setRepetirContraseña(e.target.value)}
                autoComplete="current-password"
                error={errors.repetirContraseña}
                helperText={errors.repetirContraseña}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MuiPickersUtilsProvider utils={LocalizedUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  autoOk="true"
                  openTo="year"
                  format="DD/MM/YYYY"
                  margin="normal"
                  label="Fecha Nacimiento"
                  value={fechaNacimiento}
                  onChange={setFechaNacimiento}
                  autoComplete="bday"
                  error={errors.fechaNacimiento}
                  helperText={errors.fechaNacimiento}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="altura"
                variant="outlined"
                type="number"
                fullWidth
                label="Altura (m)"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                error={errors.altura}
                helperText={errors.altura}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel id="demo-simple-select-label">Sexo</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  name="sexo"
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  error={errors.sexo}
                >
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="femenino">Femenino</MenuItem>
                </Select>
                <FormHelperText>{errors.sexo}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox name="diabetes" value="si" color="primary" />}
                label="Diabetes"
                value={diabetes}
                onChange={(e) => setDiabetes(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Registrarse
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
