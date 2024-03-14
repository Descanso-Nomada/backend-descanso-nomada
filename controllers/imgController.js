import { db } from '../database/conn.js';

const insertImgHotel = async (req,res) =>{
    const data=[req.body.id_hotel, req.file.buffer, req.file.originalname, req.file.mimetype];
    const sql =`INSERT INTO TBL_IMAGENES_HOTELES (ID_HOTEL, IMAGEN_HOTEL, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                VALUES ($1,$2,$3,$4)
                `
    try {
        const result = await db.query(sql,data);
        res.status(200).json({
            msg: 'Img guardada con exito',
            statusCode: 200, 
            result 
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
          msg: error.message,
          statusCode: 500,
          result: [],
        });
    }
}

const insertImgHabitacion = async (req,res) =>{
    const data=[req.body.id_habitacion, req.file.buffer, req.file.originalname, req.file.mimetype];
    const sql =`INSERT INTO TBL_IMAGENES_HABITACIONES (ID_HABITACION, IMAGEN_HABITACION, NOMBRE_ARCHIVO, EXTENSION_ARCHIVO)
                VALUES ($1,$2,$3,$4)
                `
    try {
        const result = await db.query(sql,data);
        res.status(200).json({
            msg: 'Img guardada con exito',
            statusCode: 200, 
            result 
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
          msg: error.message,
          statusCode: 500,
          result: [],
        });
    }
}

const imagenesHotel = async(req, res) =>{
    const id= req.body.hotel_id;
    try {
        const sql=`SELECT ID_IMG_HOTEL, encode(IMAGEN_HOTEL, 'base64') IMAGEN_HOTEL, 
                    NOMBRE_ARCHIVO, EXTENSION_ARCHIVO FROM TBL_IMAGENES_HOTELES WHERE ID_HOTEL =$1
                    `
        const result = db.query(sql, id);
        res.status(200).json({
            msg: 'Imagenes obtenidas con exito',
            statusCode: 200, 
            result 
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
          msg: error.message,
          statusCode: 500,
          result: [],
        });
    }

}
const imagenesHabitacion = async(req, res) =>{
    const id= req.body.hotel_id;
    try {
        const sql=`SELECT ID_IMG_HABITACION, encode(IMAGEN_HABITACION, 'base64') IMAGEN_HABITACION, 
                    NOMBRE_ARCHIVO, EXTENSION_ARCHIVO FROM TBL_IMAGENES_HABITACIONES WHERE ID_HABITACION =$1
                    `
        const result = db.query(sql, id);
        res.status(200).json({
            msg: 'Imagenes obtenidas con exito',
            statusCode: 200, 
            result 
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
          msg: error.message,
          statusCode: 500,
          result: [],
        });
    }

}

const eliminarImgHabitacion = async () =>{
    const id= req.params.id;
    try {
        const result = await db.query('DELETE FROM TBL_IMAGENES_HABITACIONES WHERE ID_HABITACION =$1',id);
        res.json({
            message: 'Imagen eliminada con exito',
            data: result[0] 
        });
  
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
}

const eliminarImgHotel = async () =>{
    const id= req.params.id;
    try {
        const result = await db.query('DELETE FROM TBL_IMAGENES_HOTELES WHERE ID_HOTEL =$1',id);
        res.json({
            message: 'Imagen eliminada con exito',
            data: result[0] 
        });
  
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
}


export{
    insertImgHotel,
    insertImgHabitacion,
    imagenesHotel,
    imagenesHabitacion,
    eliminarImgHabitacion,
    eliminarImgHotel
}