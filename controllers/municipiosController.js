import { db } from '../database/conn.js';

// Obtener todos los municipios
const obtenerMunicipios = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM TBL_MUNICIPIOS');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar municipios' });
    }
};

// Obtener municipios por ID de departamento
const municipiosPorDepartamento = async (req, res) => {
    const id_departamento = req.params.id;
    const sql = 'SELECT * FROM TBL_MUNICIPIOS WHERE ID_DEPTO = $1';
    try {
        const result = await db.query(sql, [id_departamento]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar municipios' });
    }
};

export {
    obtenerMunicipios,
    municipiosPorDepartamento
};
