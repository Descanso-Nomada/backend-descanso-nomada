import { db } from '../database/conn.js';


const obtenerDepartamentos = async (req, res) =>{
    try {
        const result = await db.query('SELECT * FROM TBL_DEPARTAMENTOS')
        res.json(result);
    } catch (error) {
        console.error('Error al obtener los departamentos:', error);
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};

export{
    obtenerDepartamentos
}