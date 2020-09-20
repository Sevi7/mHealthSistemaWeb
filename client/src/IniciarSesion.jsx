import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import loginImage from './loginImage.jpeg';
import Common from './utils/Common';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${loginImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'left',
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  grid: {
    textAlign: 'center',
  },
  errmsg: {
    color: 'red',
    textAlign: 'center',
  },
}));

export default function App() {
  const [mensaje, setMensaje] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errors, setErrors] = useState({});

  const classes = useStyles();

  const validarEmail = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
    return re.test(String(email).toLowerCase());
  };

  const validacionDatosInicioSesion = () => {
    const errorsValidation = {};
    if (email === '') errorsValidation.email = 'Este campo no puede estar vacío';
    else if (!validarEmail()) errorsValidation.email = 'El valor introducido en el campo Email no tiene un formato válido';
    if (contraseña === '') errorsValidation.contraseña = 'Este campo no puede estar vacío';
    return errorsValidation;
  };

  const handleSubmit = async (event) => {
    event.persist();
    event.preventDefault();
    const errorsValidation = await validacionDatosInicioSesion();
    if (Object.keys(errorsValidation).length !== 0) {
      setErrors(errorsValidation);
    } else {
      try {
        const res = await axios.post('/iniciarSesion', { email, contraseña });
        Common.setSesionUsuario(
          res.data.usuarioId, res.data.token, res.data.expiraEn, res.data.usuarioDatos,
        );
        window.location.replace('/dashboard');
      } catch (err) {
        if (err.response.status === 400) {
          setErrors({});
          setMensaje(err.response.data.err.message);
        } else {
          console.log(err);
          setErrors({});
          setMensaje('Algo fue mal. Por favor intentelo de nuevo más tarde');
        }
      }
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar Sesión
          </Typography>
          <Typography component="h5" variant="h6" className={classes.errmsg}>
            {mensaje}
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              helperText={errors.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="contraseña"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              error={errors.contraseña}
              helperText={errors.contraseña}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Iniciar Sesión
            </Button>
            <br />
            <br />
            <Grid container spacing={3} className={classes.grid}>
              <Grid item xs={12}>
                <Link href="/registroUsuario" variant="body2">
                  Registro Usuario
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
