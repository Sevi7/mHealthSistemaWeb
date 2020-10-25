# mHealth Sistema Web
Sistema Web para mHealth: _monitorización de actividad física y constantes vitales mediante Bluetooth_

## Funcionalidades

- Sistema web capaz de monitorizar la **frecuencia cardíaca**, **temperatura**, **presión arterial** y
**glucemia** utilizando dispositivos Bluetooth Low Energy disponibles en el mercado.
- Considera la situación del usuario en el momento en el que realiza la medición.
  - Si se encuentra haciendo ejercicio.
  - Si la medición ha sido tomada después de comer.
- Alerta al usuario de las mediciones cuyo valor se encuentra fuera del rango normal con una escala de gravedad.
- La aplicación web es multidispositivo y multiplataforma.
- Todos los datos son almacenados en una base de datos, pudiendo ver el usuario el histórico
de sus mediciones.
- Las mediciones son mostradas visualmente en una gráfica, diferenciando con una escala de
colores aquellas que se encuentran fuera del rango normal.
- Las mediciones pueden ser impresas o exportadas a diferentes formatos de archivo.
- Estas funciones, menos las dos últimas, pueden ser consumidas también a través de una API
REST.

## Capturas de pantalla

![Iniciar Sesion](https://raw.githubusercontent.com/Sevi7/mHealthSistemaWeb/master/screenshots/IniciarSesion.png)
---
![Desplegable Conectar](https://raw.githubusercontent.com/Sevi7/mHealthSistemaWeb/master/screenshots/DesplegableConectar.PNG)
---
![Pagina principal](https://raw.githubusercontent.com/Sevi7/mHealthSistemaWeb/master/screenshots/Calendario.PNG)
---
![Alertas](https://raw.githubusercontent.com/Sevi7/mHealthSistemaWeb/master/screenshots/Alertas.PNG)
---
![Registro Usuario validacion](https://raw.githubusercontent.com/Sevi7/mHealthSistemaWeb/master/screenshots/RegistroUsuarioError.PNG)

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
  - Valor (Ejemplo): 02-00-00-00-00-00-00-00-00-00-B0-53-00-00 equivale a 83 mg/dL
  
## Referencias

[Web Bluetooth API](https://webbluetoothcg.github.io/web-bluetooth/)
