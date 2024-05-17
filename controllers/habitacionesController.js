import { db } from '../database/conn.js';

const registrarHabitacion = async (req, res) => {
    const { id_tipo_habitacion, capacidad, descripcion, caracteristicas, precio_noche } = req.body;
    const dataHabitacion = [req.idHotel, true, id_tipo_habitacion, capacidad, descripcion, false, caracteristicas, precio_noche];
    try {
        const sqlHabitacion = 'SELECT registrar_habitacion($1, $2, $3, $4, $5, $6, $7, $8) AS id_habitacion';
        const resultadoHabitacion = await db.query(sqlHabitacion, dataHabitacion);
        const id_habitacion = resultadoHabitacion[0].id_habitacion;
        if (req.file) {
            const { buffer, originalname, mimetype } = req.file;
            const dataImagen = [id_habitacion, buffer, originalname, mimetype];
            const sqlImagen = `INSERT INTO TBL_IMAGENES_HABITACIONES (ID_HABITACION, IMAGEN_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                               VALUES ($1, $2, $3, $4)`;
            const resultIMG= await db.query(sqlImagen, dataImagen);
        }

        res.status(200).json({
            mensaje: "Habitación registrada y imagen guardada exitosamente.",
            id_habitacion
        });
    } catch (error) {
        console.error("Error al registrar la habitación o al guardar la imagen: ", error);
        res.status(500).send({ mensaje: "Error al procesar la solicitud." });
    }
};

const actualizarHabitacion = async (req, res) => {
    const { id_habitacion } = req.params;
    const { id_tipo_habitacion, descripcion, rentada, precio_noche, caracteristicas, publicacion_activa } = req.body;
    
    const dataHabitacion = [id_tipo_habitacion, descripcion, rentada, precio_noche, caracteristicas, publicacion_activa, id_habitacion];
    const sqlHabitacion = `
        UPDATE TBL_HABITACIONES 
        SET 
            ID_TIPO_HABITACION = $1, 
            DESCRIPCION = $2, 
            RENTADA = $3, 
            PRECIO_NOCHE = $4, 
            CARACTERISTICAS = $5, 
            PUBLICACION_ACTIVA = $6
        WHERE 
            ID_HABITACION = $7
    `;

    try {
        await db.query(sqlHabitacion, dataHabitacion);

        if (req.file) {
            const { buffer, originalname, mimetype } = req.file;
            const dataImagen = [buffer, originalname, mimetype, id_habitacion];
            const sqlImagen = `
                INSERT INTO TBL_IMAGENES_HABITACIONES (IMAGEN_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO, ID_HABITACION)
                VALUES ($1, $2, $3, $4)
            `;
            await db.query(sqlImagen, dataImagen);
        }

        res.status(200).json({
            mensaje: "Habitación actualizada exitosamente.",
            id_habitacion
        });
    } catch (error) {
        console.error("Error al actualizar la habitación o al guardar la imagen: ", error);
        res.status(500).send({ mensaje: "Error al procesar la solicitud." });
    }
};


const listarHabitaciones = async(req, res) => {
    let id = req.idHotel || req.params.id;
    try {
        const sql = `
            SELECT h.*, th.NOMBRE_TIPO, th.ID_TIPO_HABITACION, i.ID_IMG_HABITACION, i.NOMBRE_ARCHIVO, i.EXTENSION_ARCHIVO, encode(i.IMAGEN_HABITACION, 'base64') as IMAGEN_HABITACION
            FROM TBL_HABITACIONES h
            LEFT JOIN TBL_TIPOS_HABITACION th ON h.ID_TIPO_HABITACION = th.ID_TIPO_HABITACION
            LEFT JOIN LATERAL (
                SELECT ID_IMG_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO, IMAGEN_HABITACION
                FROM TBL_IMAGENES_HABITACIONES
                WHERE ID_HABITACION = h.ID_HABITACION
                ORDER BY ID_IMG_HABITACION DESC
                LIMIT 1
            ) i ON true
            WHERE h.ID_HOTEL = $1
        `;
        const result = await db.query(sql, [id]);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener las habitaciones con tipos e imágenes: ", error);
        res.status(500).send({ mensaje: "Error al obtener las habitaciones con tipos e imágenes" });
    }
};


const listarHabitacionId = async(req, res) => {
    const params = [req.params.id];
    try {
        const sql = `
            SELECT h.*, th.NOMBRE_TIPO, th.ID_TIPO_HABITACION, i.ID_IMG_HABITACION, i.NOMBRE_ARCHIVO, i.EXTENSION_ARCHIVO, encode(i.IMAGEN_HABITACION, 'base64') as IMAGEN_HABITACION
            FROM TBL_HABITACIONES h
            LEFT JOIN TBL_TIPOS_HABITACION th ON h.ID_TIPO_HABITACION = th.ID_TIPO_HABITACION
            LEFT JOIN LATERAL (
                SELECT ID_IMG_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO, IMAGEN_HABITACION
                FROM TBL_IMAGENES_HABITACIONES
                WHERE ID_HABITACION = h.ID_HABITACION
                ORDER BY ID_IMG_HABITACION DESC
                LIMIT 1
            ) i ON true
            WHERE h.ID_HABITACION = $1
        `;
        const result = await db.query(sql, params);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener la habitacion con tipo e imágen: ", error);
        res.status(500).send({ mensaje: "Error al obtener la habitacion sdfasdf con tipo e imágen:" });
    }
};
const eliminarHabitacion = async (req, res) => {
    const id = req.params.id;
    try {
        const sql= "DELETE FROM TBL_HABICIONES WHERE  ID_HABITACION =$1"
        const result = await db.query(sql,id);
        res.json({
            message: 'Habitacion eliminada con exito',
            data: result[0]
        });
    } catch (error) {
      console.error('Error al eliminar la habitacion', error);
      res.status(500).json({ error: 'Error al eliminar la habitacion' });
    }
}

const tipoHabitaciones = async (req, res) =>{
    const sql=`
        SELECT * FROM TBL_TIPOS_HABITACION
    `
    try {
        const result = await db.query(sql);
        if(result > 0){
            res.json({
                message:'No se encontro ningun tipo de habitaciones'
            })
        }else{
            res.json({
                data:result,
                message:'Exito al obtener los tipos de habitaciones'
            })
        }
    } catch (error) {
        console.error('Error al obtener los tipos de habitacion', error);
        res.status(500).json({ error: 'Error al obtener los tipos de habitacion' });
    }
}

const cambiarEstadoHabitacion = async (req, res) =>{
    const params =[req.params.id, req.body.estado]
    const sql ='UPDATE TBL_HABITACIONES SET RENTADA = $2 WHERE ID_HABITACION = $1'
    try {
       const result = await db.query(sql, params)
        res.json({
            data:result,
            message: 'Estado actualizado exitosamente'
        })
    }catch (error) {
        console.error('Error al actualizar el estado de la habitacion', error);
        res.status(500).json({ error: 'Error al actualizar el estado de la habitacion' });
    }
}


export{
    registrarHabitacion,
    listarHabitaciones,
    eliminarHabitacion,
    tipoHabitaciones,
    cambiarEstadoHabitacion,
    listarHabitacionId, 
    actualizarHabitacion
}