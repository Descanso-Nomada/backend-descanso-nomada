import { db } from '../database/conn.js';

const registrarHabitacion = async (req, res) => {
    const { id_hotel, id_tipo_habitacion, capacidad, descripcion, caracteristicas, precio_noche } = req.body;
    const data = [id_hotel, true, id_tipo_habitacion, capacidad, descripcion, false, caracteristicas, precio_noche];

    try {
        const sql = 'SELECT registrar_habitacion($1, $2, $3, $4, $5, $6, $7, $8) AS id_habitacion';
        const result = await db.query(sql, data);
        res.json({
            mensaje: "Habitación registrada exitosamente.",
            id_habitacion: result[0].id_habitacion
        });
    } catch (error) {
        console.error("Error al registrar la habitación: ", error);
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
export{
    registrarHabitacion,
    listarHabitaciones,
    eliminarHabitacion
}