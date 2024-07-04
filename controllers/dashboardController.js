import { db } from '../database/conn.js';

// Obtener el conteo de habitaciones rentadas y no rentadas
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
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};

// Obtener el conteo de usuarios registrados por categoría
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
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};

// Obtener el conteo de hoteles más valorados por calificación promedio
const hotelesMasValorados = async (_req, res) => {
    try {
        const query = `
            WITH HotelRatings AS (
                SELECT 
                    A.ID_HOTEL,
                    A.NOMBRE,
                    ROUND(AVG(B.CALIFICACION)) AS CALIFICACION_PROMEDIO,
                    COUNT(B.ID_CALIFICACION_HOTEL) AS NUMERO_COMENTARIOS
                FROM 
                    TBL_HOTELES A
                LEFT JOIN 
                    TBL_CALIFICAR_HOTEL B ON A.ID_HOTEL = B.ID_HOTEL
                GROUP BY 
                    A.ID_HOTEL, A.NOMBRE
            )
            SELECT 
                CALIFICACION_PROMEDIO,
                COUNT(*) AS NUMERO_DE_HOTELES
            FROM 
                HotelRatings
            GROUP BY 
                CALIFICACION_PROMEDIO
            ORDER BY 
                CALIFICACION_PROMEDIO;
        `;
        const result = await db.query(query);
        const data = result;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};

export {
    habitaciones_rentadaXnorentada,
    usuarios_registradosXcategoria,
    hotelesMasValorados
};
