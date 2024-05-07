import Express from 'express';
const apiUsuarios = Express();
import { validateRegistroUsuario } from '../validators/registroValidator.js';
import {registrarUsuario, eliminarUsuario, actualizarContrasenia, mostrarUsuarios } from '../controllers/usuariosController.js';
import { validarCookie } from '../helpers/helpersCookie.js';


apiUsuarios.post('/registro',validateRegistroUsuario, registrarUsuario);
// apiUsuarios.get('/:id',obtenerUsuarioporId);
apiUsuarios.get('/clientes',mostrarUsuarios);
apiUsuarios.put('',actualizarContrasenia);
apiUsuarios.delete('/:id',eliminarUsuario);
export { 
    apiUsuarios 
};