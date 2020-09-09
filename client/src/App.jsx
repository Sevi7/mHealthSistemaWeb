import React from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import IniciarSesion from './IniciarSesion.jsx';
import RegistroUsuario from './RegistroUsuario.jsx';
import Common from './utils/Common';
import Dashboard from './Dashboard.jsx';

axios.defaults.headers.common = { user_token: `${Common.getToken()}` };

export default function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            {Common.sesionIniciada() ? <Dashboard fechaHoy={Common.getFechaHoy()} /> : <IniciarSesion />}
          </Route>
          <Route path="/registroUsuario" component={RegistroUsuario} />
          <Route path="/iniciarSesion" component={IniciarSesion} />
          <Route exact path="/dashboard">
            {Common.sesionIniciada() ? <Dashboard fechaHoy={Common.getFechaHoy()} /> : <Redirect to="/" />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
