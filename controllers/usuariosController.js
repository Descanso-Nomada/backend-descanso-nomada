import bcrypt from 'bcrypt';
import { db } from '../database/conn.js';

const registrarUsuario = async (req, res) =>{
    const {nombre_usuario, id_rol, dni,correo,telefono,fecha_nacimiento, contrasenia} =req.body;
    
    try{
        const salt = await bcrypt.genSalt(15);
        const contraseniaHash = await bcrypt.hash(contrasenia, salt);

        const sql = `INSERT INTO TBL_USUARIOS (nombre_usuario, id_rol, dni,correo,telefono,fecha_nacimiento, contrasenia)
                    VALUES($1,$2,$3,$4,$5,$6,$7)`;
        
        const values=[nombre_usuario, id_rol, dni,correo,telefono,fecha_nacimiento,contraseniaHash];
        await db.query(sql, values);
        res.json({ message: 'Usuario registrado con éxito' });           
    }catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario'});
    }
}

export{
    registrarUsuario
};