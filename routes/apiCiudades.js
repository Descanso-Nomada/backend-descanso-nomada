import  Express  from "express";
const apiCiudades = Express();
import { obtenerCiudades, ciudadesPorMunicipios, coloniasporCiudad } from "../controllers/ciudadesController.js";

apiCiudades.get('',obtenerCiudades);
apiCiudades.get('/:id',ciudadesPorMunicipios);
apiCiudades.get('/colonias/:id', coloniasporCiudad);


export{
    apiCiudades
}