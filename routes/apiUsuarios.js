import Express from 'express';
const apiUsuarios = Express();
import { validateRegistroUsuario } from '../validators/registroValidator.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage:storage});
import {registrarUsuario, eliminarUsuario, actualizarContrasenia, mostrarUsuarios } from '../controllers/usuariosController.js';
import { obtenerHistorial } from '../controllers/historialController.js';
import { validarCookie } from '../helpers/helpersCookie.js';


apiUsuarios.post('/registro', upload.single('image'), validateRegistroUsuario, registrarUsuario);
apiUsuarios.get('/clientes',validarCookie,mostrarUsuarios);
apiUsuarios.get('/historial', validarCookie, obtenerHistorial)
apiUsuarios.put('',validarCookie, upload.single('image'), actualizarContrasenia);
apiUsuarios.delete('/:id',validarCookie,eliminarUsuario);
export { 
    apiUsuarios 
};