import Express from 'express';
const apiHoteles = Express();
import { registrarHotel, borrarHotel, mostrarHoteles} from '../controllers/hotelesController.js';

//registrar un usuario nuevo

apiHoteles.get('', mostrarHoteles);
apiHoteles.post('', registrarHotel);
apiHoteles.delete('/:id', borrarHotel);

export { 
    apiHoteles
};