# mHealth Sistema Web
_Sistema Web para mHealth: monitorización de actividad física y constantes vitales mediante Bluetooth_
## Instalación

Instalar **Node.js**

Instalar **Google Chrome Dev**. WebBluetooth API requiere que la conexión sea segura mediante HTTPS. Sin embargo, para pruebas locales permite usar este navegador con el protocólo HTTP.

Ejecutar en la carpeta raíz el comando:
``` 
npm install
```

Navegar a la carpeta _client_:
```
cd client
```

Ejecutar:
```
npm install
```

Volver a la carpeta raíz:
```
cd ..
```

Ejecutar:
```
npm run dev
```

Seleccione Google Chrome Dev para abrir el cliente o escriba en la barra de navegación de Google Chrome Dev:
```
http://localhost:3000/
```

Regístrese para comenzar a usar la aplicación web.

Puede crear dispositivos virtuales BLE de medición de constantes vitales con la aplicación Light Blue de PunchTrough.
- Frecuencia Cardíaca:
  - Servicio: Heart Rate
  - Característica: Heart Rate Measurement
  - Properties: Notify
- Temperatura:
  - Servicio: Health Thermometer
  - Característica: Temperature Measurement
  - Properties: Read
  - Valor (Ejemplo): 06-68-01-00-FF-E2-07-03-0A-15-34-00-02 equivale a 36°C
  
- Presión Arterial:
  - Servicio: Blood Pressure
  - Característica: Blood Pressure Measurement
  - Properties: Read
  - Valor (Ejemplo): 00-00-78-00-50-00-00-00-00-00-00-00-00 equivale a 120/80mmHg
   
- Glucemia:
  - Servicio: Glucose
  - Característica: 0x2A18 (Glucose Measurement)
  - Properties: Read
  - Valor (Ejemplo): 40-00-00-00-00-00-00-00-00-00-B0-53-00-00 equivale a 83 mg/dL
