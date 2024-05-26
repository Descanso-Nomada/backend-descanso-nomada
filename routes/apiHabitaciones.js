import Express from 'express';
const apiHabitaciones = Express();
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { validarCookieHotel } from "../helpers/helpersCookie.js";
import { registrarHabitacion, actualizarHabitacion, listarHabitaciones, eliminarHabitacion, tipoHabitaciones, cambiarEstadoHabitacion, listarHabitacionId } from '../controllers/habitacionesController.js';

apiHabitaciones.post('/registro', validarCookieHotel, upload.array('images', 5), registrarHabitacion);
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
