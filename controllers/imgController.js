import { db } from '../database/conn.js';

// Insertar imagen de hotel
const insertImgHotel = async (req, res) => {
    const data = [req.body.id_hotel, req.file.buffer, req.file.originalname, req.file.mimetype];
    const sql = `INSERT INTO TBL_IMAGENES_HOTELES (ID_HOTEL, IMAGEN_HOTEL, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                VALUES ($1, $2, $3, $4)`;
    try {
        const result = await db.query(sql, data);
        res.status(200).json({
            msg: 'Imagen guardada con éxito',
            statusCode: 200,
            result
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            statusCode: 500,
            result: [],
        });
    }
};

// Insertar imagen de habitación
const insertImgHabitacion = async (req, res) => {
    const data = [req.body.id_habitacion, req.file.buffer, req.file.originalname, req.file.mimetype];
    const sql = `INSERT INTO TBL_IMAGENES_HABITACIONES (ID_HABITACION, IMAGEN_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                VALUES ($1, $2, $3, $4)`;
    try {
        const result = await db.query(sql, data);
        res.status(200).json({
            msg: 'Imagen guardada con éxito',
            statusCode: 200,
            result
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            statusCode: 500,
            result: [],
        });
    }
};

// Obtener imágenes de hotel por ID
const imagenesHotel = async (req, res) => {
    const id = req.body.hotel_id;
    try {
        const sql = `SELECT ID_IMG_HOTEL, encode(IMAGEN_HOTEL, 'base64') IMAGEN_HOTEL, 
                    NOMBRE_ARCHIVO, EXTENSION_ARCHIVO FROM TBL_IMAGENES_HOTELES WHERE ID_HOTEL = $1`;
        const result = await db.query(sql, [id]);
        res.status(200).json({
            msg: 'Imágenes obtenidas con éxito',
            statusCode: 200,
            result
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            statusCode: 500,
            result: [],
        });
    }
};

// Obtener imágenes de habitación por ID
const imagenesHabitacion = async (req, res) => {
    const id = req.body.hotel_id;
    try {
        const sql = `SELECT ID_IMG_HABITACION, encode(IMAGEN_HABITACION, 'base64') IMAGEN_HABITACION, 
                    NOMBRE_ARCHIVO, EXTENSION_ARCHIVO FROM TBL_IMAGENES_HABITACIONES WHERE ID_HABITACION = $1`;
        const result = await db.query(sql, [id]);
        res.status(200).json({
            msg: 'Imágenes obtenidas con éxito',
            statusCode: 200,
            result
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
            statusCode: 500,
            result: [],
        });
    }
};

// Eliminar imagen de habitación por ID
const eliminarImgHabitacion = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('DELETE FROM TBL_IMAGENES_HABITACIONES WHERE ID_HABITACION = $1', [id]);
        res.json({
            message: 'Imagen eliminada con éxito',
            data: result[0]
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
};

// Eliminar imagen de hotel por ID
const eliminarImgHotel = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('DELETE FROM TBL_IMAGENES_HOTELES WHERE ID_HOTEL = $1', [id]);
        res.json({
            message: 'Imagen eliminada con éxito',
            data: result[0]
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
};

export {
    insertImgHotel,
    insertImgHabitacion,
    imagenesHotel,
    imagenesHabitacion,
    eliminarImgHabitacion,
    eliminarImgHotel
};
