import Express from 'express';
const apiHabitaciones = Express();
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { validarCookie, validarCookieHotel } from "../helpers/helpersCookie.js";
import { registrarHabitacion, actualizarHabitacion, listarHabitaciones, eliminarHabitacion, tipoHabitaciones, cambiarEstadoHabitacion, listarHabitacionId, mostrarComentariosHabitacion, guardarComentario} from '../controllers/habitacionesController.js';

apiHabitaciones.post('/registro', validarCookieHotel, upload.array('images', 5), registrarHabitacion);
apiHabitaciones.post('/comentario', validarCookie,guardarComentario);
apiHabitaciones.get('/comentarios/:id', mostrarComentariosHabitacion);
apiHabitaciones.get('', validarCookieHotel, listarHabitaciones);
apiHabitaciones.get('/usuarios/:id', listarHabitaciones);
apiHabitaciones.get('/tipos', tipoHabitaciones);
apiHabitaciones.get('/:id', listarHabitacionId);
apiHabitaciones.delete('/:id', validarCookieHotel, eliminarHabitacion);
apiHabitaciones.put('/:id', validarCookieHotel, cambiarEstadoHabitacion);
apiHabitaciones.put('/actualizar/:id_habitacion', validarCookieHotel, upload.array('images', 5), actualizarHabitacion);

export {
    apiHabitaciones
};
