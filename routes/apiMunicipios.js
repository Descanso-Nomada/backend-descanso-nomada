import Express from 'express';
const apiMunicipios = Express()
import { obtenerMunicipios,municipiosPorDepartamento } from '../controllers/municipiosController.js';

apiMunicipios.get('', obtenerMunicipios);
apiMunicipios.get('/:id',municipiosPorDepartamento);

export{
    apiMunicipios
}