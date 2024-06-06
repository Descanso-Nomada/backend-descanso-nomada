import { db } from '../database/conn.js';

const habitaciones_rentadaXnorentada = async (req, res) => {
    try {
        const query = `
            SELECT
                COUNT(*) FILTER (WHERE rentada = TRUE) AS habitaciones_rentadas,
                COUNT(*) FILTER (WHERE rentada = FALSE) AS habitaciones_no_rentadas
            FROM
                tbl_habitaciones;
        `;
        const result = await db.query(query);
        const data = result;
        const { habitaciones_rentadas, habitaciones_no_rentadas } = data[0];
        res.json({ habitaciones_rentadas, habitaciones_no_rentadas });
    } catch (error) {
        console.error('Error al mostrar resultados de habitaciones no rentadas vr. rentadas:', error);
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};

const usuarios_registradosXcategoria = async (req, res) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM TBL_USUARIOS WHERE id_rol = 1) AS administradores,
                (SELECT COUNT(*) FROM TBL_USUARIOS WHERE id_rol = 2) AS usuarios,
                (SELECT COUNT(*) FROM tbl_hoteles) AS hoteles;
        `;
        const result = await db.query(query);
        const data = result;
        const { administradores, usuarios, hoteles } = data[0];
        res.json({ administradores, usuarios, hoteles });
    } catch (error) {
        console.error('Error al mostrar resultados de habitaciones no rentadas vr. rentadas:', error);
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};

export {
    habitaciones_rentadaXnorentada,
    usuarios_registradosXcategoria
};