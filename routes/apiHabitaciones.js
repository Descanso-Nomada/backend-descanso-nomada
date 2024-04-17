import Express from 'express';
const apiHabitaciones = Express();
import multer from 'multer';
import { validarCookieHotel } from "../helpers/helpersCookie.js";
const storage = multer.memoryStorage();
const upload = multer({storage:storage});

import { registrarHabitacion, listarHabitaciones, eliminarHabitacion, tipoHabitaciones } from '../controllers/habitacionesController.js';

apiHabitaciones.post('/registro',validarCookieHotel, upload.single('image'),registrarHabitacion);
apiHabitaciones.get('', validarCookieHotel, listarHabitaciones);
apiHabitaciones.get('/tipos', tipoHabitaciones);
apiHabitaciones.delete('/:id',eliminarHabitacion);

export{
    apiHabitaciones
}