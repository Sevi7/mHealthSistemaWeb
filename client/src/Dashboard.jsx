/* eslint-disable no-shadow */
/* eslint-disable prefer-template */
/* eslint-disable class-methods-use-this */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import { Icon } from '@iconify/react';
import thermometerIcon from '@iconify/icons-mdi/thermometer';
import bloodBag from '@iconify/icons-mdi/blood-bag';
import spoonSugar from '@iconify/icons-mdi/spoon-sugar';
import HomeIcon from '@material-ui/icons/Home';
import HeartRateIcon from '@material-ui/icons/Favorite';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BluetoothIcon from '@material-ui/icons/Bluetooth';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import PropTypes from 'prop-types';
import GraficoSpline from './componentes/GraficoSpline.jsx';
import FrecuenciaCardiacaBluetooth from './componentes/webBluetooth/FrecuenciaCardiacaBluetooth.jsx';
import TemperaturaBluetooth from './componentes/webBluetooth/TemperaturaBluetooth.jsx';
import PresionArterialBluetooth from './componentes/webBluetooth/PresionArterialBluetooth.jsx';
import GlucemiaBluetooth from './componentes/webBluetooth/GlucemiaBluetooth.jsx';
import constantesVitales from './utils/constantesVitales';
import medicionConstanteVitalService from './services/medicionConstanteVitalService';
import Common from './utils/Common';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  eliminarButton: {
    color: 'red',
  },
}));

const añadirCeroCuandoMenorADiez = (tiempo) => (tiempo < 10 ? `0${tiempo}` : tiempo);

const formatearFecha = (fecha) => {
  const fechaObjeto = new Date(fecha);
  return añadirCeroCuandoMenorADiez(fechaObjeto.getHours())
    + ':' + añadirCeroCuandoMenorADiez(fechaObjeto.getMinutes())
    + ':' + añadirCeroCuandoMenorADiez(fechaObjeto.getSeconds());
};

const calcularEdad = (fechaNacimiento) => {
  const fechaNacimientoPartes = fechaNacimiento.split('T')[0].split('-');
  const fechaNacimientoObj = new Date(
    fechaNacimientoPartes[0], fechaNacimientoPartes[2] - 1, fechaNacimientoPartes[1],
  );
  const edadDifMs = Date.now() - fechaNacimientoObj.getTime();
  const edadFecha = new Date(edadDifMs);
  return Math.abs(edadFecha.getUTCFullYear() - 1970);
};

const getValoresCriticosFrecuenciaCardiacaEnEjercicio = (edad, sexo) => (
  sexo === 'masculino'
    ? {
      minimoCritico: 60,
      minimo: (220 - edad) * 0.5,
      maximo: (220 - edad) * 0.85,
      maximoCritico: 220 - edad,
    }
    : {
      minimoCritico: 60,
      minimo: (226 - edad) * 0.5,
      maximo: (226 - edad) * 0.85,
      maximoCritico: 226 - edad,
    }
);

class LocalizedUtils extends MomentUtils {
  getDatePickerHeaderText(date) {
    return moment(date).format('DD/MM/YYYY');
  }
}

const Dashboard = (props) => {
  const { fechaHoy, usuarioDatos } = props;
  const [constanteVital, setConstanteVital] = useState(constantesVitales.nombre.default);
  const [mediciones, setMediciones] = useState([]);
  const [fechaMediciones, setFechaMediciones] = useState(fechaHoy);
  const [titulo, setTitulo] = useState(null);
  const [usuarioHizoClick, setUsuarioHizoClick] = useState(false);
  const [tituloGrafico, setTituloGrafico] = useState(null);
  const [rangoVisual, setRangoVisual] = useState([null, null]);
  const [dataFormat, setDataFormat] = useState([]);
  const [checkbox, setCheckbox] = useState(false);
  const [open, setOpen] = useState(true);

  const edad = calcularEdad(usuarioDatos.fechaNacimiento);

  const classes = useStyles();

  const handleMenuAbrir = () => {
    setOpen(true);
  };
  const handleMenuCerrar = () => {
    setOpen(false);
  };

  const handleInicio = () => {
    setConstanteVital(constantesVitales.nombre.default);
  };

  const handleFrecuenciaCardiaca = () => {
    setConstanteVital(constantesVitales.nombre.frecuenciaCardiaca);
  };

  const handleTemperatura = () => {
    setConstanteVital(constantesVitales.nombre.temperatura);
  };

  const handlePresionArterial = () => {
    setConstanteVital(constantesVitales.nombre.presionArterial);
  };

  const handleGlucemia = () => {
    setConstanteVital(constantesVitales.nombre.glucemia);
  };

  const handleCheckbox = (event) => {
    setCheckbox(event.target.checked);
  };

  const handleCerrarSesion = () => {
    Common.eliminarSesionUsuario();
    window.location.replace('/');
  };

  const handleEliminar = () => {
    (async () => {
      await medicionConstanteVitalService.deleteMedicionConstanteVital(
        constanteVital, fechaMediciones,
      );
      setMediciones([]);
    })();
  };

  const handleConectar = () => {
    setUsuarioHizoClick(true);
  };

  const resetearBotonConectar = () => {
    setUsuarioHizoClick(false);
  };

  const refrescarFrecuenciaCardiacaMediciones = (nuevasMediciones) => {
    const nuevasMedicionesFormateadas = nuevasMediciones.map((medicion) => ({
      valor: medicion.valor,
      fecha: formatearFecha(medicion.fecha),
      enReposo: medicion.enReposo,
    }));
    setMediciones((mediciones) => [
      ...mediciones,
      ...nuevasMedicionesFormateadas,
    ]);
  };

  const refrescarTemperaturaMediciones = (nuevasMediciones) => {
    const nuevasMedicionesFormateadas = nuevasMediciones.map((medicion) => ({
      valor: medicion.valor,
      fecha: formatearFecha(medicion.fecha),
    }));
    setMediciones((mediciones) => [
      ...mediciones,
      ...nuevasMedicionesFormateadas,
    ]);
  };

  const refrescarPresionArterialMediciones = (nuevasMediciones) => {
    const nuevasMedicionesFormateadas = nuevasMediciones.map((medicion) => ({
      valor: medicion.valor,
      diastolica: medicion.diastolica,
      fecha: formatearFecha(medicion.fecha),
    }));
    setMediciones((mediciones) => [
      ...mediciones,
      ...nuevasMedicionesFormateadas,
    ]);
  };

  const refrescarGlucemiaMediciones = (nuevasMediciones) => {
    const nuevasMedicionesFormateadas = nuevasMediciones.map((medicion) => ({
      valor: medicion.valor,
      fecha: formatearFecha(medicion.fecha),
      postprandial: medicion.postprandial,
    }));
    setMediciones((mediciones) => [
      ...mediciones,
      ...nuevasMedicionesFormateadas,
    ]);
  };

  const personalizarValoresCriticos = () => {
    if (constanteVital === constantesVitales.nombre.temperatura
      || constanteVital === constantesVitales.nombre.presionArterial) {
      return constantesVitales.valoresCriticos[constanteVital];
    }

    if (constanteVital === constantesVitales.nombre.frecuenciaCardiaca) {
      return {
        filterTrue: constantesVitales.valoresCriticos[constanteVital].enReposo,
        filterFalse: getValoresCriticosFrecuenciaCardiacaEnEjercicio(edad, usuarioDatos.sexo),
      };
    }

    if (constanteVital === constantesVitales.nombre.glucemia) {
      return usuarioDatos.diabetes
        ? {
          filterTrue: constantesVitales.valoresCriticos[constanteVital].diabetes.postprandial,
          filterFalse: constantesVitales.valoresCriticos[constanteVital].diabetes.ayuno,
        }
        : {
          filterTrue: constantesVitales.valoresCriticos[constanteVital].noDiabetes.postprandial,
          filterFalse: constantesVitales.valoresCriticos[constanteVital].noDiabetes.ayuno,
        };
    }

    return {};
  };

  useEffect(() => {
    let medicionesAPI = [];
    (async () => {
      if (constanteVital === constantesVitales.nombre.frecuenciaCardiaca) {
        medicionesAPI = await medicionConstanteVitalService.getFrecuenciaCardiaca(fechaMediciones);
      } else if (constanteVital === constantesVitales.nombre.temperatura) {
        medicionesAPI = await medicionConstanteVitalService.getTemperatura(fechaMediciones);
      } else if (constanteVital === constantesVitales.nombre.presionArterial) {
        medicionesAPI = await medicionConstanteVitalService.getPresionArterial(fechaMediciones);
      } else if (constanteVital === constantesVitales.nombre.glucemia) {
        medicionesAPI = await medicionConstanteVitalService.getGlucemia(fechaMediciones);
      }
      setMediciones(medicionesAPI);
    })();
  }, [constanteVital, fechaMediciones]);

  useEffect(() => {
    setTitulo(constantesVitales.titulo[constanteVital]);
    setTituloGrafico(constantesVitales.tituloGrafico[constanteVital]);
    setRangoVisual(constantesVitales.rangoVisual[constanteVital]);
    setDataFormat(constantesVitales.dataFormat[constanteVital]);
  }, [constanteVital]);

  useEffect(() => {
  }, [usuarioHizoClick]);

  const getComponenteBluetooth = () => {
    if (constanteVital === constantesVitales.nombre.frecuenciaCardiaca) {
      return (
        <FrecuenciaCardiacaBluetooth
          refrescarFrecuenciaCardiacaMediciones={refrescarFrecuenciaCardiacaMediciones}
          resetearBotonConectar={resetearBotonConectar}
          checkbox={checkbox}
        />
      );
    }
    if (constanteVital === constantesVitales.nombre.temperatura) {
      return (
        <TemperaturaBluetooth
          refrescarTemperaturaMediciones={refrescarTemperaturaMediciones}
          resetearBotonConectar={resetearBotonConectar}
        />
      );
    }
    if (constanteVital === constantesVitales.nombre.presionArterial) {
      return (
        <PresionArterialBluetooth
          refrescarPresionArterialMediciones={refrescarPresionArterialMediciones}
          resetearBotonConectar={resetearBotonConectar}
        />
      );
    }
    if (constanteVital === constantesVitales.nombre.glucemia) {
      return (
        <GlucemiaBluetooth
          refrescarGlucemiaMediciones={refrescarGlucemiaMediciones}
          resetearBotonConectar={resetearBotonConectar}
          checkbox={checkbox}
        />
      );
    }

    return null;
  };

  const mainListItems = (
    <div>
      <ListItem button onClick={handleInicio}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Inicio" />
      </ListItem>
      <ListItem button onClick={handleFrecuenciaCardiaca}>
        <ListItemIcon>
          <HeartRateIcon />
        </ListItemIcon>
        <ListItemText primary="Frecuencia Cardiaca" />
      </ListItem>
      <ListItem button onClick={handleTemperatura}>
        <ListItemIcon>
          <Icon icon={thermometerIcon} width="1.8em" height="1.8em" />
        </ListItemIcon>
        <ListItemText primary="Temperatura" />
      </ListItem>
      <ListItem button onClick={handlePresionArterial}>
        <ListItemIcon>
          <Icon icon={bloodBag} width="1.8em" height="1.8em" />
        </ListItemIcon>
        <ListItemText primary="Presion Arterial" />
      </ListItem>
      <ListItem button onClick={handleGlucemia}>
        <ListItemIcon>
          <Icon icon={spoonSugar} width="1.8em" height="1.8em" />
        </ListItemIcon>
        <ListItemText primary="Glucemia" />
      </ListItem>
    </div>
  );

  const secondaryListItems = (
    <div>
      <ListItem button onClick={handleCerrarSesion}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Cerrar Sesión" />
      </ListItem>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleMenuAbrir}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {titulo}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={0} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleMenuCerrar}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {constanteVital === constantesVitales.nombre.default
            && (
              <Box>
                <Typography align="center" component="h1" variant="h5" color="inherit" noWrap className={classes.title}>
                  Bienvenido a mHealth Sistema Web
                </Typography>
                <Box fontStyle="italic">
                  <Typography align="center">
                    Seleccione una constante vital en el menu lateral
                  </Typography>
                </Box>
              </Box>
            )}
          {constanteVital !== constantesVitales.nombre.default
            && (
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        autoOk="true"
                        openTo="year"
                        format="DD/MM/YYYY"
                        margin="normal"
                        label="Fecha Mediciones"
                        value={moment(fechaMediciones, 'DD/MM/YYYY')}
                        input={fechaMediciones}
                        onChange={(date) => setFechaMediciones(date.format('DD/MM/YYYY'))}
                      />
                    </MuiPickersUtilsProvider>
                  </Paper>
                </Grid>
                <Grid item xs={9}>
                  <Grid container spacing={2} direction="column">
                    <Grid item xs={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        startIcon={<DeleteIcon />}
                        className={classes.eliminarButton}
                        onClick={handleEliminar}
                      >
                        Eliminar
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      {fechaMediciones === fechaHoy
                        && (
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<BluetoothIcon />}
                            onClick={handleConectar}
                          >
                            Conectar
                          </Button>
                        )}
                    </Grid>
                    {usuarioHizoClick
                      && getComponenteBluetooth()}
                    <Grid item xs={3}>
                      {fechaMediciones === fechaHoy && constantesVitales.checkbox[constanteVital]
                        && (
                          <FormControlLabel
                            control={(
                              <Checkbox
                                checked={checkbox}
                                onChange={handleCheckbox}
                                name="checkedB"
                                color="secondary"
                              />
                            )}
                            label={constantesVitales.checkbox[constanteVital]}
                          />
                        )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <GraficoSpline
                      data={mediciones}
                      dataFormat={dataFormat}
                      titulo={tituloGrafico}
                      rangoVisual={rangoVisual}
                      valoresCriticos={personalizarValoresCriticos()}
                    />
                  </Paper>
                </Grid>
              </Grid>
            )}
        </Container>
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  fechaHoy: PropTypes.string.isRequired,
  usuarioDatos: PropTypes.shape({
    fechaNacimiento: PropTypes.string,
    altura: PropTypes.number,
    sexo: PropTypes.string,
    diabetes: PropTypes.bool,
  }).isRequired,
};

export default Dashboard;
