import Express from 'express';
const apiHoteles = Express();
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage:storage});
import { registrarHotel, borrarHotel, mostrarHoteles,hotelesInactivos,cambiarEstadoHotel} from '../controllers/hotelesController.js';
import { validateRegistroHotel } from '../validators/registroValidator.js';

apiHoteles.get('', mostrarHoteles);
apiHoteles.get('/inactivos', hotelesInactivos);
apiHoteles.post('', upload.single('image'),validateRegistroHotel, registrarHotel);
apiHoteles.put('/estado/:id', cambiarEstadoHotel);
apiHoteles.delete('/:id', borrarHotel);

export { 
    apiHoteles
};