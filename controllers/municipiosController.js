import { db } from '../database/conn.js';

const obtenerMunicipios = async (req, res) =>{
    try {
        const result = await db.query('SELECT * FROM TBL_MUNICIPIOS')
        res.json(result);
    } catch (error) {
        // console.error('Error al obtener los municipios:', error);
        res.status(500).json({ error: 'Error al mostrar municipios' });
    }
};

const municipiosPorDepartamento = async (req, res) =>{
    const id_departamento =req.params.id;
    const sql = 'SELECT * FROM TBL_MUNICIPIOS WHERE ID_DEPTO =$1';
    try {
        const result = await db.query(sql,id_departamento);
        res.json(result);
    } catch (error) {
        // console.error('Error al obtener los municipios:', error);
        res.status(500).json({ error: 'Error al mostrar municipios' });
    }

}


export{
    obtenerMunicipios,
    municipiosPorDepartamento
}