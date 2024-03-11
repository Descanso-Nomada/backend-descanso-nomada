import bcrypt from 'bcrypt';
import { db } from '../database/conn.js';

const registrarUsuario = async (req, res) => {
    const { nombre_usuario, id_rol, dni, correo, telefono, fecha_nacimiento, contrasenia } = req.body;

    try {
        const salt = await bcrypt.genSalt(15);
        const contraseniaHash = await bcrypt.hash(contrasenia, salt);

        const sql = `CALL sp_registrar_usuario($1, $2, $3, $4, $5, $6, $7)`;

        const values = [nombre_usuario, id_rol, dni, correo, telefono, fecha_nacimiento, contraseniaHash];
        await db.query(sql, values);
        
        res.json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
}

export {
    registrarUsuario
};
