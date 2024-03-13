import  express  from "express";
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiUsuarios } from "./routes/apiUsuarios.js";
import { apiHoteles } from "./routes/apiHoteles.js";
import { apiAuth } from "./routes/apiAuth.js";
import { apiDepartamentos } from "./routes/apiDepartamentos.js";
import { apiMunicipios } from "./routes/apiMunicipios.js";
import { apiCiudades } from "./routes/apiCiudades.js";

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, 
};
app.use(cors(corsOptions));

app.use('/api/usuarios',apiUsuarios);
app.use('/api/hoteles',apiHoteles);
app.use('/api/auth',apiAuth);
app.use('/api/departamentos',apiDepartamentos);
app.use('/api/municipios',apiMunicipios)
app.use('/api/ciudades', apiCiudades);
app.use(express.static('public'));

app.listen(3000, ()=>{

console.log("Servidor en puerto 3000");

})