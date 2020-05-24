import React, { useState, useEffect } from "react";

// SERVICES
import medicionConstanteVitalService from './services/medicionConstanteVitalService';

function Home() {
  const [mediciones, setMediciones] = useState(null);

  useEffect(() => {
    if(!mediciones) {
      getMediciones();
    }
  })

  const getMediciones = async () => {
    let res = await medicionConstanteVitalService.getAll();
    console.log(res);
    setMediciones(res);
  }

  const renderMedicionConstanteVital = medicion => {
    return (
      <li key={medicion._id}>
      <h3>{medicion.tipoConstanteVital}</h3>
      <p>{medicion.valor}</p>
    </li>
    );
    };

  return (
    <div className="App">
      <ul className="list">
        {(mediciones && mediciones.length > 0) ? (
          mediciones.map(medicion => renderMedicionConstanteVital(medicion))
        ) : (
          <p>No se encontraron mediciones de constante vitales</p>
        )}
      </ul>
    </div>
  );
}

export default Home;
