import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import bcrypt from 'bcrypt';

import { db } from '../database/conn.js';

const auth = async (req, res) => {
    const params = [
        req.correo,
        req.contrasenia
    ]

    const sql =`SELECT NOMBRE_USUARIO, CONTRASENIA, ID_ROL FROM TBL_USUARIOS
                WHERE CORREO =$1`;

    const result = await db.query(sql, params);
    if(result.length == 0){
        res.json({
            msg: 'El usuario no existe'
        });
        return;
    }

    const passwordCorrect = await bcrypt.compare(params.contrasenia, result[0].contrasenia);

    if (!passwordCorrect) {
        res.json({
            msg: 'Credenciales incorrectas',
        });
        return;
    }

    const payload = {
        username: result[0].nombre_usuario,
        rolid: result[0].id_rol
    };

    const token = jwt.sign(payload, 'secret', { expiresIn: '1d' });
    const tokenCookie = cookie.serialize('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: (60 * 60),
        path: '/'
    });

    res.setHeader('Set-Cookie', tokenCookie);
    res.json({
        msg: 'Autenticación Exitosa',
        user: {
        nombre_usuario: result[0].nombre_usuario,
        rolid: result[0].id_rol,
        }
    });
}

const validarCookieActiva = (req, res) => {
    res.json(req.user);
}

const cerrarSesion = (req, res)=>{

    res.clearCookie('token', {httpOnly:true, expires: new Date(0)} );

    res.json({mensaje : "Cerrar Sesion"});

}

export { auth, validarCookieActiva,cerrarSesion }