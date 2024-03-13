import  Express  from "express";
const apiCiudades = Express();
import { obtenerCiudades, ciudadesPorMunicipios } from "../controllers/ciudadesController.js";

apiCiudades.get('',obtenerCiudades);
apiCiudades.get('/:id',ciudadesPorMunicipios);


export{
    apiCiudades
}