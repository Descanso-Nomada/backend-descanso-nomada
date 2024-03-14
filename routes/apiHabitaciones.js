import Express from 'express';
const apiHabitaciones = Express();

import { registrarHabitacion, listarHabitaciones, eliminarHabitacion } from '../controllers/habitacionesController.js';

apiHabitaciones.post('',registrarHabitacion);
apiHabitaciones.get('', listarHabitaciones);
apiHabitaciones.delete('/:id',eliminarHabitacion);

export{
    apiHabitaciones
}