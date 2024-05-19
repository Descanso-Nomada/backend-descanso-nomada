import Express from 'express';
const apiHoteles = Express();
import multer from 'multer';
import { validarCookie } from '../helpers/helpersCookie.js';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { registrarHotel, borrarHotel, mostrarHoteles, mostrarHotel, hotelesInactivos, cambiarEstadoHotel } from '../controllers/hotelesController.js';
import { validateRegistroHotel } from '../validators/registroValidator.js';

apiHoteles.get('/inactivos', validarCookie, hotelesInactivos);
apiHoteles.get('/:id', mostrarHotel);
apiHoteles.get('', mostrarHoteles);
apiHoteles.post('', upload.single('image'), validateRegistroHotel, registrarHotel);
apiHoteles.put('/estado/:id', cambiarEstadoHotel);
apiHoteles.delete('/:id', borrarHotel);

export {
    apiHoteles
};
