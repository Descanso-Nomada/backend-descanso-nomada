import Express from 'express';
const apiHoteles = Express();
import { registrarHotel, borrarHotel, mostrarHoteles,hotelesInactivos,cambiarEstadoHotel} from '../controllers/hotelesController.js';

//registrar un usuario nuevo

apiHoteles.get('', mostrarHoteles);
apiHoteles.get('/inactivos', hotelesInactivos);
apiHoteles.post('', registrarHotel);
apiHoteles.put('/estado/:id', cambiarEstadoHotel);
apiHoteles.delete('/:id', borrarHotel);

export { 
    apiHoteles
};