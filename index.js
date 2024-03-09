import  express  from "express";
const app = express();
import { apiUsuarios } from "./routes/apiUsuarios.js";

app.use(express.json());

app.use('/api/usuarios',apiUsuarios);
app.use(express.static('public'));
app.listen(3000, ()=>{

    console.log("Servidor en puerto 3000");

})