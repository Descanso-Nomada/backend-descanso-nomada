import { db } from '../database/conn.js';

const obtenerHistorial = async (req, res) => {
    const userId = req.userid;
    const sql = 'SELECT * FROM TBL_RESERVACIONES_DETALLE WHERE ID_USUARIO = $1';
    try {
        const result = await db.query(sql, [userId]);
        if(result.length >0){
            res.json({
                data: result
            });
        }
        else{
            res.json({
                data:'Usted no ha realizada ninguna reservación aún'
            })
        }
      
    } catch (error) {
        // console.log('Error al realizar la consulta', error);
        res.status(500).json({ error: 'Error al realizar la consulta' });
    }
}

export {
    obtenerHistorial
}
