import { db } from '../database/conn.js';

// Obtener todos los departamentos
const obtenerDepartamentos = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM TBL_DEPARTAMENTOS');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};

export {
    obtenerDepartamentos
}
