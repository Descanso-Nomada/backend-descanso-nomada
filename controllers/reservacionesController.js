import {db} from "../database/conn.js";
import { enviarFactura } from '../helpers/sendEmail.js';

const crearReservacion = async (req, res) => {
    console.log('tamo zqui');
    try {

        const precioHabitacionQuery = `SELECT PRECIO_NOCHE FROM TBL_HABITACIONES WHERE ID_HABITACION = $1`;
        const precioHabitacionResult = await db.query(precioHabitacionQuery, [req.body.id_habitacion]);
        //console.log("Resultado de precioHabitacionQuery:", precioHabitacionResult);

        if (precioHabitacionResult.length === 0) {
            return res.status(404).json({ msg: 'Habitación no encontrada' });
        }

        const precioNoche = precioHabitacionResult[0].precio_noche;

        // Calcular el total
        const total = precioNoche * req.body.cant_noches;
        //console.log(`Precio por noche: ${precioNoche}, Cantidad de noches: ${req.body.cant_noches}, Total: ${total}`);

        // Obtener la información del usuario
        const usuarioQuery = `SELECT CORREO, nombre_usuario FROM TBL_USUARIOS WHERE ID_USUARIO = $1`;
        const usuarioResult = await db.query(usuarioQuery, [req.userid]);
        //console.log("Resultado de usuarioQuery:", usuarioResult);

        if (usuarioResult.length === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const usuarioCorreo = usuarioResult[0].correo;
        const usuarioNombre = usuarioResult[0].nombre_usuario;

        // Obtener la información de la habitación
        const habitacionQuery = `SELECT 
        A.ID_HABITACION,
        B.NOMBRE_TIPO,
        A.DESCRIPCION 
        FROM TBL_HABITACIONES A
        INNER JOIN TBL_TIPOS_HABITACION B
        ON A.ID_TIPO_HABITACION = B.ID_TIPO_HABITACION
        WHERE A.ID_HABITACION = $1`;

        const habitacionResult = await db.query(habitacionQuery, [req.body.id_habitacion]);

        if (habitacionResult.length === 0) {
            return res.status(404).json({ msg: 'Habitación no encontrada' });
        }

        const habitacionId = habitacionResult[0].id_habitacion;
        const habitacionDescripcion = habitacionResult[0].descripcion;
        const habitacionNombre_tipo = habitacionResult[0].nombre_tipo;

        // Insertar la reservación en la base de datos
        const params = [req.body.id_habitacion, req.userid, req.body.cant_noches, total, req.body.fecha_entrada, req.body.fecha_salida];
        const sql = `
            INSERT INTO TBL_RESERVACIONES
            (ID_HABITACION, ID_USUARIO, CANT_NOCHES, TOTAL, FECHA_ENTRADA, FECHA_SALIDA)
            VALUES($1, $2, $3, $4, $5, $6)
        `;
        await db.query(sql, params);

        // Enviar la factura
        enviarFactura(usuarioCorreo, usuarioNombre, habitacionNombre_tipo, habitacionDescripcion, precioNoche, req.body.cant_noches, total);

        // Enviar la respuesta
        res.json({
            message: 'Solicitud de reserva creada exitosamente',
            message2: 'Espere unos minutos mientras el hotel gestiona su solicitud'
        });
    } catch (error) {
        console.error("Error en el proceso de creación de reservación:", error);
        res.status(500).json({
            error: error.message,
            msg: 'Error al registrar la reservación'
        });
    }
};


const obtenerReservaciones = async (req, res) =>{
    const idHotel = req.idHotel;
    try {
        const sql=`
        SELECT
        r.*,
        u.NOMBRE_USUARIO,
        u.CORREO,
        u.TELEFONO,
        h.ID_HABITACION,
        h.ID_HOTEL,
        h.PUBLICACION_ACTIVA,
        j.ID_TIPO_HABITACION,
        j.NOMBRE_TIPO,
        h.CAPACIDAD,
        h.DESCRIPCION,
        h.RENTADA,
        h.CARACTERISTICAS,
        h.PRECIO_NOCHE
        FROM
            TBL_RESERVACIONES AS r
        JOIN
            TBL_HABITACIONES AS h ON r.ID_HABITACION = h.ID_HABITACION
        JOIN
            TBL_HOTELES AS t ON h.ID_HOTEL = t.ID_HOTEL
        JOIN 
            TBL_TIPOS_HABITACION AS j ON j.ID_TIPO_HABITACION = h.ID_TIPO_HABITACION
        JOIN
            TBL_USUARIOS AS u ON u.ID_USUARIO = r.ID_USUARIO
        WHERE
            t.ID_HOTEL = $1;
        `
        const result= await db.query(sql, idHotel);
        if (result.length >= 0) {
            res.json(result);
        } else {
            res.status(404).json({ message: "No hay reservaciones no revisadas para este hotel." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const reservacionesUsuario = async (req, res) =>{
    let userid= req.params.userid;
    const sql=`
        SELECT
        TBL_HOTELES.NOMBRE AS nombre_hotel,
        TBL_HABITACIONES.ID_HABITACION AS id_habitacion,
        TBL_HABITACIONES.CAPACIDAD AS capacidad_habitacion,
        TBL_HABITACIONES.DESCRIPCION AS descripcion_habitacion,
        TBL_HABITACIONES.PRECIO_NOCHE AS precio_noche,
        TBL_RESERVACIONES.ID_RESERVACION AS id_reservacion,
        TBL_RESERVACIONES.CANT_NOCHES AS cant_noches,
        TBL_RESERVACIONES.ESTADO AS estado_reservacion,
        TBL_RESERVACIONES.TOTAL AS total_reservacion,
        TBL_RESERVACIONES.FECHA_ENTRADA AS fecha_entrada,
        TBL_RESERVACIONES.FECHA_SALIDA AS fecha_salida
        FROM
            TBL_RESERVACIONES
        JOIN
            TBL_HABITACIONES ON TBL_RESERVACIONES.ID_HABITACION = TBL_HABITACIONES.ID_HABITACION
        JOIN
            TBL_HOTELES ON TBL_HABITACIONES.ID_HOTEL = TBL_HOTELES.ID_HOTEL
        WHERE
            TBL_RESERVACIONES.ID_USUARIO = $1;
    `
    try {
        const result = await db.query(sql,userid);
        if(result >=0){
            res.json({
                message:'Usted no tiene reservaciones'
            })
        }else{
            res.json(
                {
                    data:result,
                    message:'Consulta exitosa'
                }
            )
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const actualizarReservacion = async (req, res) => {
    let params = [req.body.estado, req.body.reservacionID];
    const sql = `
        UPDATE TBL_RESERVACIONES
        SET ESTADO = $1
        WHERE ID_RESERVACION = $2
        RETURNING *
    `;

    try {
        const result = await db.query(sql, params);
        console.log(result);
        if (result.length >= 0) {
            res.json({
                data: result,
                message: `Actualización exitosa: La reservación fue ${params[0]}`
            });
        } else {
            res.status(404).json({ message: "No se encontró la reservación para actualizar." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const eliminarReservacion = async (req, res) =>{
    const reservacionID =  req.params.id;
    const sql =`
        DELETE FROM TBL_RESERVACIONES 
        WHERE ID_RESERVACION = $1 
        AND ESTADO = 'NO REVISADO'
    `
    try {
        const result = await db.query(sql, reservacionID);
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ message: "No hay reservaciones no revisadas para este hotel." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export{
    crearReservacion,
    obtenerReservaciones,
    reservacionesUsuario,
    actualizarReservacion,
    eliminarReservacion
}