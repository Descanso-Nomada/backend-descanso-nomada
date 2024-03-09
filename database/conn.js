import pg from 'pg-promise';
const pgp =pg();
import dotenv from 'dotenv';
dotenv.config();

const user = process.env.DB_USER;
const pass =  process.env.DB_PASSWORD;
const host =  process.env.DB_HOST;
const database =  process.env.DB_DATABASE;
const encodedPassword = encodeURIComponent(pass);
const conectionString = `postgres://${user}:${encodedPassword}@${host}:5432/${database}`

const db = pgp(conectionString);
db.connect()
    .then( ()=>{
        console.log("Conexion Exitosa");
    })
    .catch( (err)=>{
        console.log(`Error de Conexión ${err}`);
    })

export {
    db
};
