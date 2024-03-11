import Express from 'express';
const apiHoteles = Express();
import { registrarHotel} from '../controllers/hotelesController.js';

//registrar un usuario nuevo
apiHoteles.post('', registrarHotel);

export { 
    apiHoteles
};