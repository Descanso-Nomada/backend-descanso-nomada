import { db } from '../database/conn.js';

const registrarHabitacion = async (req, res) => {
    const { id_tipo_habitacion, capacidad, descripcion, caracteristicas, precio_noche } = req.body;
    const dataHabitacion = [req.idHotel, true, id_tipo_habitacion, capacidad, descripcion, false, caracteristicas, precio_noche];
    

    try {
        const sqlHabitacion = 'SELECT registrar_habitacion($1, $2, $3, $4, $5, $6, $7, $8) AS id_habitacion';
        const resultadoHabitacion = await db.query(sqlHabitacion, dataHabitacion);
        const id_habitacion = resultadoHabitacion[0].id_habitacion;

        if (req.files && req.files.length === 5) {
            for (let file of req.files) {
                const { buffer, originalname, mimetype } = file;
                const dataImagen = [id_habitacion, buffer, originalname, mimetype];
                const sqlImagen = `INSERT INTO TBL_IMAGENES_HABITACIONES (ID_HABITACION, IMAGEN_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                                   VALUES ($1, $2, $3, $4)`;
                await db.query(sqlImagen, dataImagen);
            }
        } else {
            return res.status(400).json({ mensaje: "Debes subir exactamente 5 imágenes." });
        }

        res.status(200).json({
            mensaje: "Habitación registrada y imágenes guardadas exitosamente.",
            id_habitacion
        });
    } catch (error) {
        // console.error("Error al registrar la habitación o al guardar las imágenes: ", error);
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

        if (req.files && req.files.length > 0) {
            const sqlDeleteImagenes = `
                DELETE FROM TBL_IMAGENES_HABITACIONES
                WHERE ID_HABITACION = $1
            `;
            await db.query(sqlDeleteImagenes, [id_habitacion]);

            const sqlInsertImagen = `
                INSERT INTO TBL_IMAGENES_HABITACIONES (IMAGEN_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO, ID_HABITACION)
                VALUES ($1, $2, $3, $4)
            `;

            const promises = req.files.slice(0, 5).map(file => {
                const { buffer, originalname, mimetype } = file;
                const dataImagen = [buffer, originalname, mimetype, id_habitacion];
                return db.query(sqlInsertImagen, dataImagen);
            });

            await Promise.all(promises);
        }

        res.status(200).json({
            mensaje: "Habitación actualizada exitosamente.",
            id_habitacion
        });
    } catch (error) {
        // console.error("Error al actualizar la habitación o al guardar las imágenes: ", error);
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
        // console.error("Error al obtener las habitaciones con tipos e imágenes: ", error);
        res.status(500).send({ mensaje: "Error al obtener las habitaciones con tipos e imágenes" });
    }
};


const listarHabitacionId = async(req, res) => {
    const params = [req.params.id];
    try {
        const sql = `
        SELECT h.*, th.NOMBRE_TIPO, th.ID_TIPO_HABITACION, 
        array_agg(json_build_object(
             'ID_IMG_HABITACION', i.ID_IMG_HABITACION,
             'NOMBRE_ARCHIVO', i.NOMBRE_ARCHIVO,
             'EXTENSION_ARCHIVO', i.EXTENSION_ARCHIVO,
             'IMAGEN_HABITACION', encode(i.IMAGEN_HABITACION, 'base64')
         )) AS IMAGENES_HABITACION
        FROM TBL_HABITACIONES h
        LEFT JOIN TBL_TIPOS_HABITACION th ON h.ID_TIPO_HABITACION = th.ID_TIPO_HABITACION
        LEFT JOIN TBL_IMAGENES_HABITACIONES i ON h.ID_HABITACION = i.ID_HABITACION
        WHERE h.ID_HABITACION = $1
        GROUP BY h.ID_HABITACION, th.NOMBRE_TIPO, th.ID_TIPO_HABITACION;
        `;
        const result = await db.query(sql, params);
        res.json(result);
    } catch (error) {
        // console.error("Error al obtener la habitacion con tipo e imágen: ", error);
        res.status(500).send({ mensaje: "Error al obtener la habitacion sdfasdf con tipo e imágen:" });
    }
};
const eliminarHabitacion = async (req, res) => {
    const id = req.params.id;
    try {
        const sql= "DELETE FROM TBL_HABICIONES WHERE ID_HABITACION =$1"
        const result = await db.query(sql,id);
        res.json({
            message: 'Habitacion eliminada con exito',
            data: result[0]
        });
    } catch (error) {
    //   console.error('Error al eliminar la habitacion', error);
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
        // console.error('Error al obtener los tipos de habitacion', error);
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
        // console.error('Error al actualizar el estado de la habitacion', error);
        res.status(500).json({ error: 'Error al actualizar el estado de la habitacion' });
    }
}

const mostrarComentariosHabitacion = async (req, res) => {
    const { id } = req.params;
    try {
      const query = `
        SELECT A.id_comentario,
            A.id_habitacion,
            A.id_usuario,
            B.nombre_usuario,
            B.imagen_usuario,
            B.nombre_archivo,
            B.extension_archivo,
            A.fecha_comentario,
            A.comentario,
            A.calificacion
        FROM tbl_comentarios_habitacion A
        INNER JOIN tbl_usuarios B
        ON B.id_usuario = A.id_usuario
        WHERE id_habitacion = $1
      `;
      const result = await db.query(query, [id]);
  
      const data = result.map(row => ({
        ...row,
        imagen_usuario: row.imagen_usuario ? Buffer.from(row.imagen_usuario).toString('base64') : null,
      }));
  
      res.json(data);
    } catch (error) {
    //   console.error("Error al mostrar hoteles con imágenes:", error);
      res.status(500).json({ error: "Error al mostrar hoteles con imágenes" });
    }
  };
  

const guardarComentario = async (req, res) => {
    const id_usuario =req.userid;
    const { id_habitacion, fecha_comentario, comentario, calificacion } = req.body;
    // console.log(id_habitacion, id_usuario, fecha_comentario, comentario, calificacion);
    try {   
    const query = `
        INSERT INTO TBL_COMENTARIOS_HABITACION (ID_HABITACION, ID_USUARIO, FECHA_COMENTARIO, COMENTARIO, CALIFICACION) VALUES
        ($1, $2, $3, $4, $5);
        `;
    const result = await db.query(query, [id_habitacion, id_usuario, fecha_comentario, comentario, calificacion]);
    const data = result;
    res.json('Se agregó su comentario, Gracias por calificar nuestros servicios');
    } catch (error) {
        // console.error("Error al guardar comentario:", error);
        res.status(500).json({ error: "Error al guardar comentario" });
    }
}

export{
    registrarHabitacion,
    listarHabitaciones,
    eliminarHabitacion,
    tipoHabitaciones,
    cambiarEstadoHabitacion,
    listarHabitacionId, 
    actualizarHabitacion,
    mostrarComentariosHabitacion,
    guardarComentario
}