import Express from 'express';
const apiDepartamentos = Express()
import { obtenerDepartamentos } from '../controllers/departamentosController.js';

apiDepartamentos.get('',obtenerDepartamentos);

export{
    apiDepartamentos
}