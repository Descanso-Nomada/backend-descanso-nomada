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

const coloniasporCiudad = async(req,res) =>{
    const id_ciudad =req.params.id;
    const sql = `
        SELECT * FROM TBL_COLONIAS
        WHERE id_ciudad =$1
    `
    try {
        const result = await db.query(sql, [id_ciudad]);
        res.json([{
            msg:`Colonias de la ciudad con id:${id_ciudad}`,
            data:result
        }])
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar las colonias' });
    }
}

export{
    obtenerCiudades,
    ciudadesPorMunicipios,
    coloniasporCiudad
}