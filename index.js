import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiUsuarios } from './routes/apiUsuarios.js';
import { apiHoteles } from './routes/apiHoteles.js';
import { apiAuth } from './routes/apiAuth.js';
import { apiDepartamentos } from './routes/apiDepartamentos.js';
import { apiMunicipios } from './routes/apiMunicipios.js';
import { apiCiudades } from './routes/apiCiudades.js';
import { apiHabitaciones } from './routes/apiHabitaciones.js';
import { apiImagenes } from './routes/apiImagenes.js';
import { apiReservaciones } from './routes/apiReservaciones.js';
import { apiResetPass } from './routes/apiResetPass.js';
import { whatsapp} from './services/whatsapp.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

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

app.use(express.static('public'));

whatsapp.then(client => {
  console.log('WhatsApp client initialized');
}).catch(err => {
  console.error('Error initializing WhatsApp client:', err);
});

app.listen(3000, () => {
    console.log("Servidor en puerto 3000");
});
