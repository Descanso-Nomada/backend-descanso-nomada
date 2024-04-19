import Express from 'express';
const apiHabitaciones = Express();
import multer from 'multer';
import { validarCookieHotel } from "../helpers/helpersCookie.js";
const storage = multer.memoryStorage();
const upload = multer({storage:storage});

import { registrarHabitacion, listarHabitaciones, eliminarHabitacion, tipoHabitaciones, cambiarEstadoHabitacion,listarHabitacionId } from '../controllers/habitacionesController.js';

apiHabitaciones.post('/registro',validarCookieHotel, upload.single('image'),registrarHabitacion);
apiHabitaciones.get('', validarCookieHotel, listarHabitaciones);
apiHabitaciones.get('/:id', validarCookieHotel,listarHabitacionId);
apiHabitaciones.get('/tipos', tipoHabitaciones);
apiHabitaciones.delete('/:id',validarCookieHotel,eliminarHabitacion);
apiHabitaciones.put('/:id',validarCookieHotel, cambiarEstadoHabitacion);

export{
    apiHabitaciones
}