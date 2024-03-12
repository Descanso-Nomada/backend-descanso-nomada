import Express from 'express';
const apiUsuarios = Express();
import {registrarUsuario, obtenerUsuarioporId, eliminarUsuario, actualizarContrasenia } from '../controllers/usuariosController.js';
import { validarCookie } from '../helpers/helpersCookie.js';

//registrar un usuario nuevo
apiUsuarios.post('/registro', registrarUsuario);
apiUsuarios.get('/:id',validarCookie,obtenerUsuarioporId);
apiUsuarios.put('',validarCookie,actualizarContrasenia);
apiUsuarios.delete('/:id',validarCookie,eliminarUsuario);
export { 
    apiUsuarios 
};