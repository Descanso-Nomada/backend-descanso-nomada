import bcrypt from 'bcrypt';
import { db } from '../database/conn.js';

const registrarHotel = async (req, res) =>{
    const {ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP , CORREO, CONTRASENIA, AUTENTICADO} =req.body;
    
    try{
        const salt = await bcrypt.genSalt(15);
        const contraseniaHash = await bcrypt.hash(CONTRASENIA, salt);

        const sql = `INSERT INTO TBL_HOTELES (ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP , CORREO, CONTRASENIA, AUTENTICADO)
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
        
        const values=[ID_DIRECCION, REFERENCIA_LOCAL, NOMBRE, RTN, NO_TELEFONO, NO_WHATSAPP , CORREO, contraseniaHash, AUTENTICADO];
        await db.query(sql, values);
        res.json({ message: 'Hotel registrado con éxito' });           
    }catch (error) {
        res.status(500).json({ error: 'Error al registrar el Hotel'});
    }
}

export{
    registrarHotel
};