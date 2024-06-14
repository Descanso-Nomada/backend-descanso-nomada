import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import bcrypt from 'bcrypt';

import { db } from '../database/conn.js';

const auth = async (req, res) => {
    let sql = `SELECT NOMBRE_USUARIO, CONTRASENIA, ID_ROL, ID_USUARIO, CORREO, IMAGEN_USUARIO, NOMBRE_ARCHIVO,EXTENSION_ARCHIVO FROM TBL_USUARIOS WHERE CORREO = $1`;
    let params = [req.body.correo, req.body.contrasenia];

    try {
        let result = await db.query(sql, req.body.correo);
        if(result.length == 0){
            sql = `SELECT ID_HOTEL, NOMBRE, CORREO, CONTRASENIA, AUTENTICADO FROM TBL_HOTELES WHERE CORREO = $1`;
            result = await db.query(sql, params);
            if(result.length == 0) {
                res.json({
                    msg: 'El hotel no existe'
                });
                return;
            } else {
                const passwordCorrect = await bcrypt.compare(req.body.contrasenia, result[0].contrasenia);
                if (!passwordCorrect) {
                    res.json({
                        msg: 'Credenciales incorrectas',
                    });
                    return;
                }
                const payload = {
                    hotel_name:result[0].nombre,
                    idHotel: result[0].id_hotel,
                    correo: result[0].correo,
                    rolid:3,
                    autenticado: result[0].autenticado
                };
                generateTokenAndRespond(res, payload, 'Autenticación Exitosa para Hotel', result);
                return;
            }
        } else {
            const passwordCorrect = await bcrypt.compare(req.body.contrasenia, result[0].contrasenia);
            if (!passwordCorrect) {
                res.json({
                    msg: 'Credenciales incorrectas',
                });
                return;
            }else{
                const payload = {
                    username: result[0].nombre_usuario,
                    rolid: result[0].id_rol,
                    userid: result[0].id_usuario,
                    correo: result[0].correo
                };
                generateTokenAndRespond(res, payload, 'Autenticación Exitosa', result);
                return;
            }
        }
    } catch (error) {
        // console.error("Error al autenticar: ", error);
        res.status(500).send({ mensaje: "Error al procesar la solicitud." });
    }
};

function generateTokenAndRespond(res, payload, message, result) {
    const token = jwt.sign(payload, 'secret', { expiresIn: '1d' });
    const tokenCookie = cookie.serialize('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60,
        path: '/'
    });
    let data;
    if(result[0].id_hotel==null){
        data={
            username: result[0].nombre_usuario,
            rolid: result[0].id_rol,
            userid: result[0].id_usuario,
            extension_archivo: result[0].extension_archivo,
            imagen_usuario:result[0].imagen_usuario,
            nombre_archivo:result[0].nombre_archivo,
            correo : result[0].correo
        }
    }else{
        data={
            rolid:3,
            id_hotel: result[0].id_hotel,
            hotel_name: result[0].nombre,
            correo : result[0].correo
        }
    }

    res.setHeader('Set-Cookie', tokenCookie);
    res.json({
        msg: message,
        user:data,
    });
}



const validarCookieActiva = (req, res) => {
    res.json(req.user);
}

const cerrarSesion = (req, res)=>{
    res.clearCookie('token', {httpOnly:true, expires: new Date(0)} );
    res.json({mensaje : "Cerrar Sesion"});
}
 
const verificarSesion = (req, res) =>{
    if (req.user ||req.hotel) {
        res.json({ user: req.user||req.hotel });
    } else {
        res.status(401).json({ msg: 'No autorizado' });
    }
}

export { 
    auth, 
    validarCookieActiva, 
    verificarSesion,
    cerrarSesion 
}