import Express from 'express';
const apiUsuarios = Express();
import {registrarUsuario, eliminarUsuario, actualizarContrasenia, mostrarUsuarios } from '../controllers/usuariosController.js';
import { validarCookie } from '../helpers/helpersCookie.js';

//registrar un usuario nuevo
apiUsuarios.post('/registro', registrarUsuario);
// apiUsuarios.get('/:id',obtenerUsuarioporId);
apiUsuarios.get('/clientes',mostrarUsuarios);
apiUsuarios.put('',actualizarContrasenia);
apiUsuarios.delete('/:id',eliminarUsuario);
export { 
    apiUsuarios 
};