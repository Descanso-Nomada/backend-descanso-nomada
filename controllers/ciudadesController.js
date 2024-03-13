import { db } from '../database/conn.js';

const obtenerCiudades = async (req, res) =>{
    try {
        const result = await db.query('SELECT * FROM TBL_CIUDADES')
        res.json(result)
    } catch (error) {
        console.error('Error al obtener los ciudades:', error);
        res.status(500).json({ error: 'Error al mostrar municipios' });
    }
}

const ciudadesPorMunicipios = async (req, res) =>{
    const id_municipio =req.params.id;
    const sql = 'SELECT * FROM TBL_CIUDADES WHERE ID_MUNICIPIO = $1';
    try {
        const result = await db.query(sql,id_municipio);
        res.json(result);
    } catch (error) {
        console.error('Error al obtener las ciudades:', error);
        res.status(500).json({ error: 'Error al mostrar ciudades' });
    }

}

export{
    obtenerCiudades,
    ciudadesPorMunicipios
}