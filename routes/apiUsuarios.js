import Express from 'express';
const apiUsuarios = Express();
import { registrarUsuario } from '../controllers/usuariosController.js';

//registrar un usuario nuevo
apiUsuarios.post('', registrarUsuario);
export { 
    apiUsuarios 
};