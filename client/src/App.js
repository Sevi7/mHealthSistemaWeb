import React from "react";
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import IniciarSesion from './IniciarSesion.js';
import RegistroUsuario from './RegistroUsuario.js';
import Common from './utils/Common.js';
import Inicio from './Inicio.js';

axios.defaults.headers.common = {'user_token' : `${Common.getToken()}`};

export default function App() {
  return (
    <Router>
      <div className="App">
      <Switch>
        <Route exact path="/">
          {Common.sesionIniciada() ? <Inicio/> : <IniciarSesion/>}
        </Route>        
        <Route path="/registroUsuario" component={RegistroUsuario}/>
        <Route path="/iniciarSesion" component={IniciarSesion}/>
        <Route exact path="/inicio">
          {Common.sesionIniciada() ? <Inicio/> : <Redirect to="/" />}
        </Route>
      </Switch>
    </div>
    </Router>
  );
}
