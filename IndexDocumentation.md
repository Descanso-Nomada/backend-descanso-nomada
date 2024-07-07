# Documentación del Servidor

## Índice

1. [Librerías Utilizadas](#librerías-utilizadas)
2. [Configuración del Servidor](#configuración-del-servidor)
3. [Rutas del API](#rutas-del-api)
4. [Configuración de CORS](#configuración-de-cors)
5. [Inicio del Cliente de WhatsApp](#inicio-del-cliente-de-whatsapp)
6. [Inicio del Servidor](#inicio-del-servidor)

## Librerías Utilizadas

### `express`

- **Descripción**: `express` es un framework web rápido y minimalista para Node.js.
- **Uso**: Se utiliza para configurar y manejar el servidor web.

### `cors`

- **Descripción**: `cors` es una librería para habilitar CORS (Cross-Origin Resource Sharing) en aplicaciones Express.
- **Uso**: Se utiliza para permitir o restringir solicitudes de diferentes dominios.

### `cookie-parser`

- **Descripción**: `cookie-parser` es una librería que analiza las cookies adjuntas a la solicitud del cliente.
- **Uso**: Se utiliza para analizar cookies y configurar valores de cookies en el servidor.

## Configuración del Servidor

El servidor se configura utilizando Express. Se configura para manejar JSON, análisis de cookies y servir archivos estáticos desde la carpeta `public`.

```javascript
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiUsuarios } from "./routes/apiUsuarios.js";
import { apiHoteles } from "./routes/apiHoteles.js";
import { apiAuth } from "./routes/apiAuth.js";
import { apiDepartamentos } from "./routes/apiDepartamentos.js";
import { apiMunicipios } from "./routes/apiMunicipios.js";
import { apiCiudades } from "./routes/apiCiudades.js";
import { apiHabitaciones } from "./routes/apiHabitaciones.js";
import { apiImagenes } from "./routes/apiImagenes.js";
import { apiReservaciones } from "./routes/apiReservaciones.js";
import { apiResetPass } from "./routes/apiResetPass.js";
import { apiDashboard } from "./routes/apiDashboard.js";
import { startClient } from './services/whatsapp.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));
```

## Rutas del API 

Se definen múltiples rutas para manejar diferentes partes de la aplicación, cada una importada desde su módulo correspondiente.

```javascript
app.use('/api/usuarios', apiUsuarios);
app.use('/api/hoteles', apiHoteles);
app.use('/api/auth', apiAuth);
app.use('/api/departamentos', apiDepartamentos);
app.use('/api/municipios', apiMunicipios);
app.use('/api/ciudades', apiCiudades);
app.use('/api/habitaciones', apiHabitaciones);
app.use('/api/imagenes', apiImagenes);
app.use('/api/reservaciones', apiReservaciones);
app.use('/api/reset-password', apiResetPass);
app.use('/api/dashboard', apiDashboard);
```
## Configuración de CORS

Se configura CORS para permitir solicitudes desde ciertos orígenes específicos.

```javascript

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175'
];

const corsOptions = {
  origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
};
app.use(cors(corsOptions));

```
## Inicio del Cliente de WhatsApp

Se inicia el cliente de WhatsApp utilizando venom-bot.
```javascript
startClient();
```

## Inicio del Servidor

El servidor se inicia en el puerto 3000.
```javascript
app.listen(3000, () => {
    console.log("Servidor en puerto 3000");
});
```
