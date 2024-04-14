import Express from 'express';
const apiHabitaciones = Express();
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage:storage});

import { registrarHabitacion, listarHabitaciones, eliminarHabitacion } from '../controllers/habitacionesController.js';

apiHabitaciones.post('', upload.single('image'),registrarHabitacion);
apiHabitaciones.get('', listarHabitaciones);
apiHabitaciones.delete('/:id',eliminarHabitacion);

export{
    apiHabitaciones
}