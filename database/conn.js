import pg from 'pg-promise';
const pgp =pg();
import dotenv from 'dotenv';
dotenv.config();

//Definicion de constantes utilizadas para almacenar los datos de la base de datos extraida desde el archivo .env
const user = process.env.DB_USER;
const pass =  process.env.DB_PASSWORD;
const host =  process.env.DB_HOST;
const database =  process.env.DB_DATABASE;
const encodedPassword = encodeURIComponent(pass);
const conectionString = `postgres://${user}:${encodedPassword}@${host}:5432/${database}`


//Creacion de la constante db la cual es utilizada para la conexion a la base de datos
const db = pgp(conectionString);
db.connect()
    .then( ()=>{
        console.log("Conexion Exitosa");
    })
    .catch( (err)=>{
        console.log(`Error de Conexión ${err}`);
    })

//Exportacion de la constante db para poder ser requerida en los controladores y poder realizar las consultas a la base de datos
export{
    db
};
