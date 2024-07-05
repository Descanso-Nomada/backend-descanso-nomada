import { db } from '../database/conn.js';
import { enviarCodigo } from '../helpers/sendEmail.js';
import bcrypt from 'bcrypt';
let codigoSeguridad = '';

// Enviar código de seguridad al correo del usuario
const sendCode = async (req, res) => {
    const { email } = req.body;

    try {
        const userQuery = `
            SELECT * FROM TBL_USUARIOS WHERE CORREO = $1
        `;
        const userResult = await db.any(userQuery, [email]);

        if (userResult.length === 0) {
            return res.status(200).json({
                res: false,
                message: 'El correo electrónico no es válido',
            });
        } else {
            const generateSecurityCode = () => {
                return Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos
            };
            codigoSeguridad = generateSecurityCode();
            enviarCodigo(email, userResult[0].nombre_usuario, codigoSeguridad);
            return res.status(200).json({
                res: true,
                message: 'Se envió el código de seguridad a: ' + email,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: 'Error al verificar el correo electrónico',
        });
    }
};

// Cambiar la contraseña del usuario
const changePass = async (req, res) => {
    const { email, securityCode, password } = req.body;
    
    try {
        const userQuery = `
            SELECT * FROM TBL_USUARIOS WHERE CORREO = $1
        `;
        const userResult = await db.query(userQuery, [email]);

        if (userResult.length === 0 || securityCode !== codigoSeguridad) {
            return res.status(400).json({
                res: false,
                message: 'Código de seguridad o correo electrónico incorrecto',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updateQuery = `
            UPDATE TBL_USUARIOS SET CONTRASENIA = $1 WHERE CORREO = $2
        `;
        await db.query(updateQuery, [hashedPassword, email]);

        res.json({
            res: true,
            message: 'Contraseña actualizada exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: 'Error al actualizar la contraseña',
        });
    }
};

export { 
    sendCode, 
    changePass 
};
