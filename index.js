import  express  from "express";
const app = express();
import { apiUsuarios } from "./routes/apiUsuarios.js";
import { apiHoteles } from "./routes/apiHoteles.js";
import { apiAuth } from "./routes/apiAuth.js";

app.use(express.json());

app.use('/api/usuarios',apiUsuarios);
app.use('/api/hoteles',apiHoteles);
app.use('/api/auth',apiAuth)
app.use(express.static('public'));
app.listen(3000, ()=>{

console.log("Servidor en puerto 3000");

})