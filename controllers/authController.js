import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import bcrypt from 'bcrypt';

import { db } from '../database/conn.js';

const auth = async (req, res) => {
    let sql = `SELECT NOMBRE_USUARIO, CONTRASENIA, ID_ROL FROM TBL_USUARIOS WHERE correo = $1`;
    let params = [req.body.correo, req.body.contrasenia];

    try {
        let result = await db.query(sql, req.body.correo);
        if(result.length == 0){
            sql = `SELECT ID_HOTEL, CORREO, CONTRASENIA, AUTENTICADO FROM TBL_HOTELES WHERE CORREO = $1`;
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
                    idHotel: result[0].id_hotel,
                    correo: result[0].correo,
                    rolid:3,
                    autenticado: result[0].autenticado
                };
                generateTokenAndRespond(res, payload, 'Autenticación Exitosa para Hotel');
                return;
            }
        } else {
            console.log(result[0]);
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
                    userid: result[0].id_usuario
                };
                generateTokenAndRespond(res, payload, 'Autenticación Exitosa');
                return;
            }
        }
    } catch (error) {
        console.error("Error al autenticar: ", error);
        res.status(500).send({ mensaje: "Error al procesar la solicitud." });
    }
};

function generateTokenAndRespond(res, payload, message) {
    const token = jwt.sign(payload, 'secret', { expiresIn: '1d' });
    const tokenCookie = cookie.serialize('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60,
        path: '/'
    });

    res.setHeader('Set-Cookie', tokenCookie);
    res.json({
        msg: message,
        user: payload
    });
}



const validarCookieActiva = (req, res) => {
    res.json(req.user);
}

const cerrarSesion = (req, res)=>{

    res.clearCookie('token', {httpOnly:true, expires: new Date(0)} );

    res.json({mensaje : "Cerrar Sesion"});

}

export { auth, validarCookieActiva, cerrarSesion }