import Express from 'express';
const apiHoteles = Express();
import multer from 'multer';
import { validarCookie,validarCookieHotel } from '../helpers/helpersCookie.js';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { registrarHotel, borrarHotel, mostrarHoteles, mostrarHotel, hotelesInactivos, cambiarEstadoHotel,actualizarContrasenia, mostrarCalificacionHotel } from '../controllers/hotelesController.js';
import { validateRegistroHotel } from '../validators/registroValidator.js';

apiHoteles.get('/inactivos', validarCookie, hotelesInactivos);
apiHoteles.get('/:id', mostrarHotel);
apiHoteles.get('', mostrarHoteles);
apiHoteles.post('', upload.single('image'), validateRegistroHotel, registrarHotel);
apiHoteles.put('/estado/:id', cambiarEstadoHotel);
apiHoteles.put('',validarCookieHotel, actualizarContrasenia);
apiHoteles.delete('/:id', borrarHotel);
apiHoteles.get('/calificacion/:id', mostrarCalificacionHotel);


export {
    apiHoteles
};
