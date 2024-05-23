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
                        TELEFONO 
                    FROM TBL_USUARIOS 
                    WHERE ID_ROL = 2;
        `;
        const result = await db.query(query);
        const data = result;

        res.json(data);
    } catch (error) {
        console.error('Error al mostrar hoteles:', error);
        res.status(500).json({ error: 'Error al mostrar hoteles' });
    }
};

// const listarClientes = async (req, res) => {
//     try {
//         const result = await db.query('SELECT ID_USUARIO, NOMBRE_USUARIO, DNI, CORREO, TELEFONO FROM TBL_USUARIOS WHERE ID_ROL = 2');
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error al obtener usuarios:', error);
//         res.status(500).json({ error: 'Error al obtener usuarios' });
//     }
// }


// const obtenerUsuarioporId = async (req, res) =>{
//     const values=[req.params.id_usario];
//     try{
//         const sql = 'SELECT ID_ROL, CORREO, NOMBRE_USUARIO, TELEFONO FROM TBL_USUARIOS WHERE ID_USUARIO = $1';
//         const result = await db.query(sql,values)
//         console.log(result.rows);
//         if(result.length==0){
//             res.json({
//                 message:'El usuario no existe'
//             })
//         }else{   
//             res.json(result.rows)
//         }
//     }catch(error){ 
//         console.error('Error al obtener usuarios:', error);
//         res.status(500).json({ error: 'Error al obtener usuarios' });
//     }
// }


const eliminarUsuario = async (req, res) => {
    const values=[req.params.id_usario];
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

const actualizarContrasenia = async (req, res) =>{
    const data={id_usuario, contrasenia, nueva_contrasenia}=req.body
    try {
        const sql ='SELECT CONTRASENIA FROM TBL_USUARIOS WHERE ID_USUARIO =$1'
        const getPass= await bd.query(sql,data.id_usuario);
        const passwordCorrect = await bcrypt.compare(req.contrasenia, getPass[0].contrasenia);
        if (!passwordCorrect) {
            res.json({
                msg: 'Contrasenia Incorrecta',
            });
            return;
        }else{
            const salt = await bcrypt.genSalt(15);
            const contraseniaHash = await bcrypt.hash(data.nueva_contrasenia, salt);
            const sql2='UPDATE TBL_USUARIOS SET CONTRASENIA = $2 WHERE ID_USUARIO = $1';
            const values=[data.id_usuario,contraseniaHash];
            const result = await bd.query(sql2, values);
            if(result.length==0){
                res.json({
                    msg: 'Error al cambiar la contrasenia',
                });
            }
            else{
                res.json({
                    msg: 'Contrasenia actualizada correctamente',
                });
            }
        }
    } catch (error) {
        console.error('Error al actualizar la contrasenia', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
}

export {
    registrarUsuario,
    eliminarUsuario,
    actualizarContrasenia,
    mostrarUsuarios
};
