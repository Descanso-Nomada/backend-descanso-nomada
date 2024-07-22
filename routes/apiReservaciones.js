import Express from 'express';
const apiReservaciones = Express();
import {crearReservacion, obtenerReservaciones, obtenerTodasLasResevaciones, reservacionesUsuario, actualizarReservacion, eliminarReservacion} from '../controllers/reservacionesController.js';
import { validarCookie, validarCookieHotel } from '../helpers/helpersCookie.js';

apiReservaciones.post('/reservar',validarCookie, crearReservacion);
apiReservaciones.get('/reservaciones-admin',validarCookie, obtenerTodasLasResevaciones)
apiReservaciones.get('/reservaciones-hoteles', validarCookieHotel, obtenerReservaciones);
apiReservaciones.get('/reservaciones-usuarios', validarCookie, reservacionesUsuario)
apiReservaciones.put('/actualizarReservacion', validarCookieHotel, actualizarReservacion);
apiReservaciones.delete('/eliminar', validarCookie, eliminarReservacion);

export{
    apiReservaciones
}