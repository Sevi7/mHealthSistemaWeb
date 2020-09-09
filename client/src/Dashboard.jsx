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
import scaleBathroomIcon from '@iconify/icons-mdi/scale-bathroom';
import HomeIcon from '@material-ui/icons/Home';
import HeartRateIcon from '@material-ui/icons/Favorite';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BluetoothIcon from '@material-ui/icons/Bluetooth';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
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
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import PropTypes from 'prop-types';
import GraficoSpline from './componentes/GraficoSpline.jsx';
import FrecuenciaCardiacaBluetooth from './componentes/webBluetooth/FrecuenciaCardiacaBluetooth.jsx';
import constantesVitales from './utils/constantesVitales';
import medicionConstanteVitalService from './services/medicionConstanteVitalService';

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
}));

class LocalizedUtils extends MomentUtils {
  getDatePickerHeaderText(date) {
    return moment(date).format('DD/MM/YYYY');
  }
}

const Dashboard = (props) => {
  const { fechaHoy } = props;
  const [constanteVital, setConstanteVital] = useState(constantesVitales.nombre.default);
  const [mediciones, setMediciones] = useState([]);
  const [fechaMediciones, setFechaMediciones] = useState(fechaHoy);
  const [titulo, setTitulo] = useState(null);
  const [usuarioHizoClick, setUsuarioHizoClick] = useState(false);
  const [open, setOpen] = React.useState(true);
  const [tituloGrafico, setTituloGrafico] = useState(null);
  const [rangoVisual, setRangoVisual] = useState([null, null]);

  const classes = useStyles();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const conectarBluetooth = () => {
    setUsuarioHizoClick(true);
  };

  const resetearBotonConectar = () => {
    setUsuarioHizoClick(false);
  };

  const añadirCeroCuandoMenorADiez = (tiempo) => (tiempo < 10 ? `0${tiempo}` : tiempo);

  const formatearFecha = (fecha) => {
    const fechaObjeto = new Date(fecha);
    return añadirCeroCuandoMenorADiez(fechaObjeto.getHours())
      + ':' + añadirCeroCuandoMenorADiez(fechaObjeto.getMinutes())
      + ':' + añadirCeroCuandoMenorADiez(fechaObjeto.getSeconds());
  };

  const refrescarFrecuenciaCardiacaMediciones = (nuevasMediciones) => {
    const nuevasMedicionesFormateadas = nuevasMediciones.map((medicion) => ({
      valor: medicion.valor,
      fecha: formatearFecha(medicion.fecha),
      enReposo: true,
    }));
    setMediciones((mediciones) => [
      ...mediciones,
      ...nuevasMedicionesFormateadas,
    ]);
  };

  const handleFrecuenciaCardiaca = () => {
    setConstanteVital(constantesVitales.nombre.frecuenciaCardiaca);
  };
  const handleInicio = () => {
    setConstanteVital(constantesVitales.nombre.default);
  };

  useEffect(() => {
    let medicionesAPI = [];
    (async () => {
      if (constanteVital === constantesVitales.nombre.frecuenciaCardiaca) {
        medicionesAPI = await medicionConstanteVitalService.getFrecuenciaCardiaca(fechaMediciones);
      }
      setMediciones(medicionesAPI);
    })();
  }, [constanteVital, fechaMediciones]);

  useEffect(() => {
    setTitulo(constantesVitales.titulo[constanteVital]);
    setTituloGrafico(constantesVitales.tituloGrafico[constanteVital]);
    setRangoVisual(constantesVitales.rangoVisual[constanteVital]);
  }, [constanteVital]);

  useEffect(() => {}, [usuarioHizoClick]);

  const getComponenteBluetooth = () => {
    if (constanteVital === constantesVitales.nombre.frecuenciaCardiaca) {
      return (
        <FrecuenciaCardiacaBluetooth
          refrescarFrecuenciaCardiacaMediciones={refrescarFrecuenciaCardiacaMediciones}
          resetearBotonConectar={resetearBotonConectar}
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
      <ListItem button>
        <ListItemIcon>
          <Icon icon={thermometerIcon} width="1.8em" height="1.8em" />
        </ListItemIcon>
        <ListItemText primary="Temperatura" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Icon icon={scaleBathroomIcon} width="1.8em" height="1.8em" />
        </ListItemIcon>
        <ListItemText primary="Peso" />
      </ListItem>
    </div>
  );

  const secondaryListItems = (
    <div>
      <ListItem button>
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
            onClick={handleDrawerOpen}
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
          <IconButton onClick={handleDrawerClose}>
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
                <Grid item xs={3}>
                  {fechaMediciones === fechaHoy
                    && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<BluetoothIcon />}
                        onClick={conectarBluetooth}
                      >
                        Conectar
                      </Button>
                    )}
                  {usuarioHizoClick
                    && getComponenteBluetooth()}
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <GraficoSpline
                      data={mediciones}
                      titulo={tituloGrafico}
                      rangoVisual={rangoVisual}
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
};

export default Dashboard;
