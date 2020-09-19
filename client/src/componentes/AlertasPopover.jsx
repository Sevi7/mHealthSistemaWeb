import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Icon } from '@iconify/react';
import thermometerIcon from '@iconify/icons-mdi/thermometer';
import bloodBag from '@iconify/icons-mdi/blood-bag';
import spoonSugar from '@iconify/icons-mdi/spoon-sugar';
import HeartRateIcon from '@material-ui/icons/Favorite';
import medicionConstanteVitalService from '../services/medicionConstanteVitalService';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
    display: 'inline',
  },
  noAlertasTitle: {
    padding: theme.spacing(2),
  },
  valorAlertaMedia: {
    color: 'orange',
  },
  valorAlertaGrave: {
    color: 'red',
  },
  hora: {
    color: 'grey',
  },
  checkboxSi: {
    color: 'dodgerBlue',
  },
  checkboxNo: {
    color: 'darkViolet',
  },
  gridItem: {
    textAlign: 'center',
  },
  gridItemBajo: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function AlertasPopover(props) {
  const { fechaAlertas } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [alertas, setAlertas] = useState([]);

  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    (async () => {
      const alertasAPI = await medicionConstanteVitalService.getAlertas(fechaAlertas);
      setAlertas(alertasAPI);
    })();
  }, [fechaAlertas, anchorEl]);

  const open = Boolean(anchorEl);
  const id = open ? 'alertas-popover' : undefined;

  const formatearAlerta = (alerta) => {
    if (alerta.tipoConstanteVital === 'FrecuenciaCardiaca') {
      return (
        <Paper>
          <Grid container spacing={2}>
            <Grid item xs={1} />
            <Grid item xs={1}>
              <HeartRateIcon />
            </Grid>
            <Grid item xs={2}>
              <Typography className={classes.typography}>
                Frecuencia Cardiaca
              </Typography>
            </Grid>
            {alerta.enReposo && (
              <Grid item xs={2} className={classes.gridItemBajo}>
                <Typography className={`${classes.typography} ${classes.checkboxSi}`}>
                  Reposo
                </Typography>
              </Grid>
            )}
            {!alerta.enReposo && (
              <Grid item xs={2} className={classes.gridItemBajo}>
                <Typography className={`${classes.typography} ${classes.checkboxNo}`}>
                  Ejercicio
                </Typography>
              </Grid>
            )}
            {alerta.alerta === 1 && (
              <Grid item xs={4} className={classes.gridItem}>
                <Typography className={`${classes.typography} ${classes.valorAlertaMedia}`}>
                  {`${alerta.valor} PPM`}
                </Typography>
              </Grid>
            )}
            {alerta.alerta === 2 && (
              <Grid item xs={4} className={classes.gridItem}>
                <Typography className={`${classes.typography} ${classes.valorAlertaGrave}`}>
                  {`${alerta.valor} PPM`}
                </Typography>
              </Grid>
            )}
            <Grid item xs={2}>
              <Typography className={`${classes.typography} ${classes.hora}`}>
                {alerta.fecha}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      );
    }
    if (alerta.tipoConstanteVital === 'Temperatura') {
      return (
        <Paper>
          <Grid container spacing={2}>
            <Grid item xs={1} />
            <Grid item xs={1}>
              <Icon icon={thermometerIcon} width="1.7em" height="1.7em" />
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.typography}>
                Temperatura
              </Typography>
            </Grid>
            {alerta.alerta === 1 && (
              <Grid item xs={4} className={classes.gridItem}>
                <Typography className={`${classes.typography} ${classes.valorAlertaMedia}`}>
                  {`${alerta.valor} °C`}
                </Typography>
              </Grid>
            )}
            {alerta.alerta === 2 && (
              <Grid item xs={4} className={classes.gridItem}>
                <Typography className={`${classes.typography} ${classes.valorAlertaGrave}`}>
                  {`${alerta.valor} °C`}
                </Typography>
              </Grid>
            )}
            <Grid item xs={2}>
              <Typography className={`${classes.typography} ${classes.hora}`}>
                {alerta.fecha}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      );
    }
    if (alerta.tipoConstanteVital === 'PresionArterial') {
      return (
        <Paper>
          <Grid container spacing={2}>
            <Grid item xs={1} />
            <Grid item xs={1}>
              <Icon icon={bloodBag} width="1.7em" height="1.7em" />
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.typography}>
                Presion Arterial
              </Typography>
            </Grid>
            {alerta.alerta === 1 && (
              <Grid item xs={4} className={classes.gridItem}>
                <Typography className={`${classes.typography} ${classes.valorAlertaMedia}`}>
                  {`${alerta.valor}/${alerta.diastolica} mmHg`}
                </Typography>
              </Grid>
            )}
            {alerta.alerta === 2 && (
              <Grid item xs={4} className={classes.gridItem}>
                <Typography className={`${classes.typography} ${classes.valorAlertaGrave}`}>
                  {`${alerta.valor}/${alerta.diastolica} mmHg`}
                </Typography>
              </Grid>
            )}
            <Grid item xs={2}>
              <Typography className={`${classes.typography} ${classes.hora}`}>
                {alerta.fecha}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      );
    }
    if (alerta.tipoConstanteVital === 'Glucemia') {
      return (
        <Paper>
          <Grid container spacing={2}>
            <Grid item xs={1} />
            <Grid item xs={1}>
              <Icon icon={spoonSugar} width="1.8em" height="1.8em" />
            </Grid>
            <Grid item xs={2}>
              <Typography className={classes.typography}>
                Glucemia
              </Typography>
            </Grid>
            {alerta.postprandial && (
              <Grid item xs={2} className={classes.gridItem}>
                <Typography className={`${classes.typography} ${classes.checkboxSi}`}>
                  Postprandial
                </Typography>
              </Grid>
            )}
            {!alerta.postprandial && (
              <Grid item xs={2} className={classes.gridItem}>
                <Typography className={`${classes.typography} ${classes.checkboxNo}`}>
                  Ayuno
                </Typography>
              </Grid>
            )}
            {alerta.alerta === 1 && (
              <Grid item xs={4} className={classes.gridItem}>
                <Typography className={`${classes.typography} ${classes.valorAlertaMedia}`}>
                  {`${alerta.valor} mg/dL`}
                </Typography>
              </Grid>
            )}
            {alerta.alerta === 2 && (
              <Grid item xs={4} className={classes.gridItem}>
                <Typography className={`${classes.typography} ${classes.valorAlertaGrave}`}>
                  {`${alerta.valor} mg/dL`}
                </Typography>
              </Grid>
            )}
            <Grid item xs={2}>
              <Typography className={`${classes.typography} ${classes.hora}`}>
                {alerta.fecha}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      );
    }
    return null;
  };

  return (
    <div>
      <IconButton color="inherit" aria-describedby={id} onClick={handleClick} size="small">
        <Badge badgeContent={alertas.length} color="secondary">
          <NotificationsIcon />
          Alertas
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        className={classes.popover}
      >
        {alertas.length === 0 && (
          <Typography className={classes.noAlertasTitle}>
            Genial! No tienes alertas de salud en el día seleccionado.
          </Typography>
        )}
        {alertas.length > 0 && (
          <Grid container spacing={3} direction="column">
            <Grid item />
            {alertas.map((alerta) => (
              <Grid item xs={14}>
                {formatearAlerta(alerta)}
              </Grid>
            ))}
          </Grid>
        )}
      </Popover>
    </div>
  );
}

AlertasPopover.propTypes = {
  fechaAlertas: PropTypes.string.isRequired,
};
