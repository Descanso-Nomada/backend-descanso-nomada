import Express from 'express';
const apiReservaciones = Express();
import {crearReservacion, obtenerReservaciones, reservacionesUsuario, actualizarReservacion, eliminarReservacion} from '../controllers/reservacionesController.js';
import { validateReservacion } from '../validators/reservacioneValidator.js';
import { validarCookie } from '../helpers/helpersCookie.js';

apiReservaciones.post('/reservar',validateReservacion, validarCookie, crearReservacion);
apiReservaciones.get('/reservaciones-hoteles', validarCookie, obtenerReservaciones);
apiReservaciones.get('/reservaciones-usuarios', validarCookie, reservacionesUsuario)
apiReservaciones.put('/actualizarReservacion', validarCookie, actualizarReservacion);
apiReservaciones.delete('/eliminar', validarCookie, eliminarReservacion);

export{
    apiReservaciones
}