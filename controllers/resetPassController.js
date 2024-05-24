import { db } from '../database/conn.js';
import bcrypt from 'bcrypt';

const sendCode = async (req, res) => {
    const { email, securityCode, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({
            res: false,
            message: 'Las contraseñas no coinciden',
        });
    }

    try {
        console.log(email, securityCode, password, confirmPassword);

        const userQuery = `
            SELECT * FROM TBL_USUARIOS WHERE CORREO_ELECTRONICO = $1
        `;
        const userResult = await db.query(userQuery, [email, securityCode]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({
                res: false,
                message: 'Código de seguridad o correo electrónico incorrecto',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updateQuery = `
            UPDATE TBL_USUARIOS SET CONTRASENA = $1 WHERE CORREO_ELECTRONICO = $2
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
    sendCode
};
