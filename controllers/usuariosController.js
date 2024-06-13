import bcrypt from 'bcrypt';
import { db } from '../database/conn.js';

const registrarUsuario = async (req, res) => {
    const { nombre_usuario, id_rol, dni, correo, telefono, fecha_nacimiento, contrasenia } = req.body;
    const imagen_usuario = req.file.buffer;
    const nombre_archivo = req.file.originalname;
    const extension_archivo = req.file.mimetype;
    try {
        const salt = await bcrypt.genSalt(15);
        const contraseniaHash = await bcrypt.hash(contrasenia, salt);
        const sql = `CALL sp_registrar_usuario($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        const values = [nombre_usuario, id_rol, dni, correo, telefono, fecha_nacimiento, contraseniaHash, imagen_usuario, nombre_archivo, extension_archivo];
        await db.query(sql, values);
        res.json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ msg: 'Error al registrar el usuario', error });
    }
}

const mostrarUsuarios = async (req, res) => {
    try {
      const query = `
        SELECT 
            ID_USUARIO, 
            NOMBRE_USUARIO, 
            DNI, 
            CORREO, 
            TELEFONO,
            IMAGEN_USUARIO,
            NOMBRE_ARCHIVO,
            EXTENSION_ARCHIVO 
        FROM TBL_USUARIOS 
        WHERE ID_ROL = 2;
      `;
      const result = await db.query(query);
  
      const data = result.map(row => ({
        ...row,
        imagen_usuario: row.imagen_usuario ? Buffer.from(row.imagen_usuario).toString('base64') : null,
      }));
  
      res.json(data);
    } catch (error) {
      console.error('Error al mostrar usuarios:', error);
      res.status(500).json({ error: 'Error al mostrar usuarios' });
    }
  };
  

const eliminarUsuario = async (req, res) => {
    const values=[req.params.id];
    try {
    const sql = 'DELETE FROM TBL_USUARIOS WHERE ID_USUARIO = $1 RETURNING *';
    const result = await db.query(sql,values);

    if (result.length == 0) {
        res.json({ error: 'El usuario no existe'});
    } else {
        res.json({
            message: 'Usuario eliminado con exito',
            data: result[0] 
        });
    }

    } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
    };

    const actualizarContrasenia = async (req, res) => {
        const { correo, contrasenia, nueva_contrasenia } = req.body;
        const params = [req.userid, correo, contrasenia, nueva_contrasenia];
        try {
            const sql = 'SELECT CONTRASENIA FROM TBL_USUARIOS WHERE ID_USUARIO = $1';
            const getPass = await db.query(sql, [params[0]]);
            const passwordCorrect = await bcrypt.compare(params[2], getPass[0].contrasenia);
            if (!passwordCorrect) {
                res.status(201).json({ msg: 'Contraseña Incorrecta' });
                return;
            } else {
                const salt = await bcrypt.genSalt(15);
                const contraseniaHash = await bcrypt.hash(params[3], salt);
                const sql2 = 'UPDATE TBL_USUARIOS SET CONTRASENIA = $2 WHERE ID_USUARIO = $1';
                const values = [params[0], contraseniaHash];
                await db.query(sql2, values);
    
                if (req.file) {
                    const { buffer, originalname, mimetype } = req.file;
                    const imageSql = 'UPDATE TBL_USUARIOS SET IMAGEN_USUARIO = $2, NOMBRE_ARCHIVO = $3, EXTENSION_ARCHIVO = $4 WHERE ID_USUARIO = $1';
                    const imageValues = [params[0], buffer, originalname, mimetype];
                    await db.query(imageSql, imageValues);
                }
    
                res.json({ msg: 'Contraseña e imagen actualizadas correctamente' });
            }
        } catch (error) {
            console.error('Error al actualizar la contraseña', error);
            res.status(500).json({ error: 'Error al actualizar la contraseña' });
        }
    }
export {
    registrarUsuario,
    eliminarUsuario,
    actualizarContrasenia,
    mostrarUsuarios
};
