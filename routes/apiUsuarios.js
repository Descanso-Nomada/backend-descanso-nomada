import Express from 'express';
const apiUsuarios = Express();
import {registrarUsuario, obtenerUsuarioporId, eliminarUsuario, actualizarContrasenia, listarClientes } from '../controllers/usuariosController.js';
import { validarCookie } from '../helpers/helpersCookie.js';

//registrar un usuario nuevo
apiUsuarios.post('/registro', registrarUsuario);
apiUsuarios.get('/:id',obtenerUsuarioporId);
apiUsuarios.get('/clientes',listarClientes);
apiUsuarios.put('',actualizarContrasenia);
apiUsuarios.delete('/:id',eliminarUsuario);
export { 
    apiUsuarios 
};