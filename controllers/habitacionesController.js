import { db } from '../database/conn.js';

const registrarHabitacion = async (req, res) => {
    const { id_tipo_habitacion, capacidad, descripcion, caracteristicas, precio_noche } = req.body;
    const dataHabitacion = [req.idHotel, true, id_tipo_habitacion, capacidad, descripcion, false, caracteristicas, precio_noche];
        console.log(dataHabitacion);
    try {
        const sqlHabitacion = 'SELECT registrar_habitacion($1, $2, $3, $4, $5, $6, $7, $8) AS id_habitacion';
        const resultadoHabitacion = await db.query(sqlHabitacion, dataHabitacion);
        const id_habitacion = resultadoHabitacion.rows[0].id_habitacion;

        if (req.file) {
            const { buffer, originalname, mimetype } = req.file;
            const dataImagen = [id_habitacion, buffer, originalname, mimetype];
            const sqlImagen = `INSERT INTO TBL_IMAGENES_HABITACIONES (ID_HABITACION, IMAGEN_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                               VALUES ($1, $2, $3, $4)`;
            await db.query(sqlImagen, dataImagen);
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



const listarHabitaciones = async(req,res) =>{
    const id =req.params.id
    try {
        const result = await db.query('SELECT * FROM TBL_HABITACIONES WHERE ID_HOTEL ==$1');
        res.json(result)
    } catch (error) {
        console.error("Error al obtener las habitaciones: ", error);
        res.status(500).send({ mensaje: "Error al obtener las habitaciones" });
    }
}

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


export{
    registrarHabitacion,
    listarHabitaciones,
    eliminarHabitacion,
    tipoHabitaciones
}