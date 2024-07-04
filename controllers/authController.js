import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import bcrypt from 'bcrypt';
import { db } from '../database/conn.js';

// Función de autenticación para usuarios y hoteles
const auth = async (req, res) => {
    let sql = `SELECT NOMBRE_USUARIO, CONTRASENIA, ID_ROL, ID_USUARIO, CORREO, IMAGEN_USUARIO, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO FROM TBL_USUARIOS WHERE CORREO = $1`;
    let params = [req.body.correo, req.body.contrasenia];

    try {
        // Consulta en la tabla de usuarios
        let result = await db.query(sql, req.body.correo);
        if (result.length == 0) {
            // Si no se encuentra el usuario, se consulta en la tabla de hoteles
            sql = `
            SELECT 
              h.ID_HOTEL, 
              h.NOMBRE, 
              h.CORREO, 
              h.CONTRASENIA, 
              h.AUTENTICADO, 
              i.IMAGEN_HOTEL AS IMAGEN_USUARIO, 
              i.NOMBRE_ARCHIVO, 
              i.EXTENSION_ARCHIVO 
            FROM 
              TBL_HOTELES h
            LEFT JOIN 
              TBL_IMAGENES_HOTELES i
            ON 
              h.ID_HOTEL = i.ID_HOTEL 
            WHERE 
              h.CORREO = $1
          `;
          
            result = await db.query(sql, params);
            if (result.length == 0) {
                // Si no se encuentra el hotel, se responde con un mensaje de error
                res.json({
                    msg: 'El hotel no existe'
                });
                return;
            } else {
                // Verificación de la contraseña del hotel
                const passwordCorrect = await bcrypt.compare(req.body.contrasenia, result[0].contrasenia);
                if (!passwordCorrect) {
                    res.json({
                        msg: 'Credenciales incorrectas',
                    });
                    return;
                }
                // Creación del payload para el token JWT
                const payload = {
                    hotel_name: result[0].nombre,
                    idHotel: result[0].id_hotel,
                    correo: result[0].correo,
                    rolid: 3,
                    autenticado: result[0].autenticado
                };
                generateTokenAndRespond(res, payload, 'Autenticación Exitosa para Hotel', result);
                return;
            }
        } else {
            // Verificación de la contraseña del usuario
            const passwordCorrect = await bcrypt.compare(req.body.contrasenia, result[0].contrasenia);
            if (!passwordCorrect) {
                res.json({
                    msg: 'Credenciales incorrectas',
                });
                return;
            } else {
                // Creación del payload para el token JWT
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
        // Manejo de errores en la autenticación
        res.status(500).send({ mensaje: "Error al procesar la solicitud." });
    }
};

// Genera un token JWT y responde al cliente con los datos de autenticación
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
    if (result[0].id_hotel == null) {
        // Datos para usuarios
        data = {
            username: result[0].nombre_usuario,
            rolid: result[0].id_rol,
            userid: result[0].id_usuario,
            extension_archivo: result[0].extension_archivo,
            imagen_usuario: result[0].imagen_usuario,
            nombre_archivo: result[0].nombre_archivo,
            correo: result[0].correo
        };
    } else {
        // Datos para hoteles
        data = {
            rolid: 3,
            id_hotel: result[0].id_hotel,
            hotel_name: result[0].nombre,
            correo: result[0].correo,
            extension_archivo: result[0].extension_archivo,
            imagen_usuario: result[0].imagen_usuario,
            nombre_archivo: result[0].nombre_archivo
        };
    }

    res.setHeader('Set-Cookie', tokenCookie);
    res.json({
        msg: message,
        user: data,
    });
}

// Valida si la cookie activa es válida y responde con los datos del usuario
const validarCookieActiva = (req, res) => {
    res.json(req.user);
}

// Cierra la sesión del usuario eliminando la cookie
const cerrarSesion = (req, res) => {
    res.clearCookie('token', { httpOnly: true, expires: new Date(0) });
    res.json({ mensaje: "Cerrar Sesion" });
}

// Verifica si la sesión del usuario es válida y responde con los datos del usuario
const verificarSesion = (req, res) => {
    if (req.user || req.hotel) {
        res.json({ user: req.user || req.hotel });
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
