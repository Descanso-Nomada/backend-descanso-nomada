import bcrypt from 'bcrypt';
import { db } from '../database/conn.js';
import { json } from 'express';


const registrarHotel = async (req, res) =>{
    const {ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP , CORREO, CONTRASENIA} =req.body;
    
    try{
        const salt = await bcrypt.genSalt(15);
        const contraseniaHash = await bcrypt.hash(CONTRASENIA, salt);

        const sql = `CALL sp_registrar_hotel($1, $2, $3, $4, $5, $6, $7, $8)`;
        
        const values=[ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP , CORREO, contraseniaHash, false];
        console.log(values);
        await db.query(sql, values);
        res.json({ message: 'Hotel registrado con éxito' });           
    }catch (error) {
        res.status(500).json({ 
            error: error, 
            msg: 'Error al registrar el Hotel'
        });
    }
}


const borrarHotel = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('CALL sp_borrar_hotel($1)', [id]);
        
        res.json({ message: 'Hotel borrado exitosamente' });
    } catch (error) {
        console.error('Error al borrar el hotel:', error);
        res.status(500).json({ error: 'Error al borrar el hotel' });
    }
}

const hotelesInactivos = async (req, res) =>{
    try {
        const sql =`SELECT * FROM TBL_HOTELES WHERE AUTENTICADO == FALSE`;
        const result = await db.query(sql);
        res.json(result)
    } catch (error) {
        console.error('Error al listar los hoteles:', error);
        res.status(500).json({ error: 'Error al listar los hoteles' });
    }
}

const cambiarEstadoHotel = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = 'SELECT * FROM cambiarEstadoHotel($1)';
        const result = await client.query(sql, [id]);

        if (result.length > 0) {
            res.send({
                mensaje: "Estado del hotel actualizado exitosamente.",
                datos: result[0]
            });
        } else {
            res.status(404).send({ mensaje: "Hotel no encontrado." });
        }
    } catch (error) {
        console.error("Error al cambiar el estado de autenticado del hotel: ", error);
        res.status(500).send({ mensaje: "Error al procesar la solicitud." });
    }
};


const mostrarHoteles = async (req, res) => {
    try {
        const query = `
                    SELECT  A.ID_HOTEL, 
                    A.ID_DIRECCION, 
                    CONCAT(B.NOMBRE_COLONIA, ', ', C.NOMBRE_CIUDAD, ', ', D.NOMBRE_MUNICIPIO, ', ', E.NOMBRE_DEPTO) AS DIRECCION_COMPLETA,
                    A.REFERENCIA_LOCAL,
                    A.NOMBRE, 
                    A.RTN, 
                    A.NO_TELEFONO, 
                    A.NO_WHATSAPP , 
                    A.CORREO 
            FROM TBL_HOTELES AS A
            INNER JOIN TBL_COLONIAS AS B ON A.ID_DIRECCION = B.ID_COLONIA
            INNER JOIN TBL_CIUDADES AS C ON C.ID_CIUDAD = B.ID_CIUDAD
            INNER JOIN TBL_MUNICIPIOS AS D ON D.ID_MUNICIPIO = C.ID_MUNICIPIO
            INNER JOIN TBL_DEPARTAMENTOS AS E ON E.ID_DEPTO = D.ID_DEPTO;
        `;
        const result = await db.query(query);

        const data = result;

        res.json(data);
    } catch (error) {
        console.error('Error al mostrar hoteles:', error);
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};


export{
    registrarHotel,
    borrarHotel,
    mostrarHoteles,
    hotelesInactivos,
    cambiarEstadoHotel

};