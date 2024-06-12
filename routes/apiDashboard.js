import Express from 'express';
const apiDashboard= Express();
import { habitaciones_rentadaXnorentada, usuarios_registradosXcategoria, hotelesMasValorados } from '../controllers/dashboardController.js';
import { validarCookie } from '../helpers/helpersCookie.js';


apiDashboard.get('/chartBar', habitaciones_rentadaXnorentada);
apiDashboard.get('/doughnut', usuarios_registradosXcategoria);
apiDashboard.get('/red', hotelesMasValorados);

export { 
    apiDashboard 
};