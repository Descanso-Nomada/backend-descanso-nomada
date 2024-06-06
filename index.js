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
import { initializeWhatsApp, sendMessage } from './services/whatsapp.js';  // Importar el módulo de WhatsApp

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
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

// Inicializar WhatsApp
initializeWhatsApp();

app.post('/send-message', (req, res) => {
    const { number, message } = req.body;
    try {
        sendMessage(number, message);
        res.status(200).send('Mensaje enviado');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.log("Servidor en puerto 3000");
});
