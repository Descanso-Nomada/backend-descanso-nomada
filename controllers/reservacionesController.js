import { db } from '../database/conn.js';

const obtenerReservaciones = (req, res) =>{
    const idHotel = req.params.idHotel;
    try {
        const sql=`
            SELECT r.*
            FROM TBL_RESERVACIONES AS r
            JOIN TBL_HABITACIONES AS h ON r.ID_HABITACION = h.ID_HABITACION
            JOIN TBL_HOTELES AS t ON h.ID_HOTEL = t.ID_HOTEL
            WHERE t.ID_HOTEL = $1 AND r.ESTADO = 'NO REVISADO';
        `
        const result= db.query(sql, idHotel);
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ message: "No hay reservaciones no revisadas para este hotel." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const actualizarReservacion = (req, res) =>{
    let params = [req.body.estado, req.body.reservacionID];
    const sql= `
        UPDATE TBL_RESERVACIONES
        SET ESTADO = $1
        WHERE ID_RESERVACION = $2
    `
    try {
        const result= db.query(sql, params);
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ message: "No hay reservaciones no revisadas para este hotel." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const eliminarReservacion = (req, res) =>{
    const reservacionID =  req.params.id;
    const sql =`
        DELETE FROM TBL_RESERVACIONES 
        WHERE ID_RESERVACION = $1 
        AND ESTADO = 'NO REVISADO'
    `
    try {
        
    } catch (error) {
        
    }
}

export{

    obtenerReservaciones,
    actualizarReservacion,
    eliminarReservacion
}