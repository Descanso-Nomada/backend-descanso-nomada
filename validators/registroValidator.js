import { check } from 'express-validator';
import { validateResult } from '../helpers/validateHelper.js';

const validateRegistroUsuario = [
    check('nombre_usuario')
        .exists({ checkFalsy: true }).withMessage('El nombre de usuario es obligatorio.')
        .isLength({ max: 300 }).withMessage('El nombre de usuario no debe exceder los 300 caracteres.'),

    check('correo')
        .exists({ checkFalsy: true }).withMessage('El correo es obligatorio.')
        .isEmail().withMessage('Debe ser un correo electrónico válido.')
        .isLength({ max: 120 }).withMessage('El correo no debe exceder los 120 caracteres.'),

    check('contrasenia')
        .exists({ checkFalsy: true }).withMessage('La contraseña es obligatoria.')
        .isLength({ min: 6, max: 200 }).withMessage('La contraseña debe tener entre 6 y 200 caracteres.'),

    check('id_rol')
        .exists({ checkFalsy: true }).withMessage('El ID del rol es obligatorio.')
        .isInt().withMessage('El ID del rol debe ser un número entero.'),

    check('dni')
        .exists({ checkFalsy: true }).withMessage('El DNI es obligatorio.')
        .isLength({ max: 18 }).withMessage('El DNI no debe exceder los 18 caracteres.')
        .isAlphanumeric().withMessage('El DNI debe contener solo caracteres alfanuméricos.'),

    check('telefono')
        .exists({ nullable: true, checkFalsy: true })
        .isLength({ max: 9 }).withMessage('El teléfono no debe tener más de 9 dígitos.')
        .isNumeric().withMessage('El teléfono debe contener solo números.')
        .matches(/^[1-9]\d{8}$/).withMessage('El teléfono debe ser un número válido.'),

        check('fecha_nacimiento')
        .exists({ checkFalsy: true }).withMessage('La fecha de nacimiento es obligatoria.')
        .isISO8601().withMessage('La fecha de nacimiento debe ser una fecha válida en formato YYYY-MM-DD.'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];
const validateRegistroHotel = [
    check('ID_DIRECCION')
        .exists({ checkFalsy: true }).withMessage('El ID de dirección es obligatorio.')
        .isInt().withMessage('El ID de dirección debe ser un número entero.'),

    check('REFERENCIA_LOCAL')
        .exists({ checkFalsy: true }).withMessage('La referencia local es obligatoria.')
        .isLength({ max: 500 }).withMessage('La referencia local no debe exceder los 500 caracteres.'), // Asegúrate de que el tipo de datos y longitud sean adecuados para TEXT

    check('NOMBRE')
        .exists({ checkFalsy: true }).withMessage('El nombre es obligatorio.')
        .isLength({ max: 100 }).withMessage('El nombre no debe exceder los 100 caracteres.'),

    check('RTN')
        .exists({ checkFalsy: true }).withMessage('El RTN es obligatorio.')
        .isLength({ max: 18 }).withMessage('El RTN no debe exceder los 18 caracteres.')
        .isAlphanumeric().withMessage('El RTN debe contener solo caracteres alfanuméricos.'),

    check('NO_TELEFONO')
        .exists({ checkFalsy: true }).withMessage('El número de teléfono es obligatorio.')
        .isNumeric().withMessage('El número de teléfono debe ser numérico.')
        .isLength({ max: 9 }).withMessage('El número de teléfono no debe tener más de 9 dígitos.'),

    check('NO_WHATSAPP')
        .exists({ nullable: true, checkFalsy: true })
        .isNumeric().withMessage('El número de WhatsApp debe ser numérico.')
        .isLength({ max: 9 }).withMessage('El número de WhatsApp no debe tener más de 9 dígitos.'),

    check('CORREO')
        .exists({ checkFalsy: true }).withMessage('El correo es obligatorio.')
        .isEmail().withMessage('Debe ingresar un correo electrónico válido.')
        .isLength({ max: 100 }).withMessage('El correo no debe exceder los 100 caracteres.'),

    check('CONTRASENIA')
        .exists({ checkFalsy: true }).withMessage('La contraseña es obligatoria.')
        .isLength({ min: 6, max: 200 }).withMessage('La contraseña debe tener entre 6 y 200 caracteres.'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

export {
    validateRegistroUsuario,
    validateRegistroHotel
};
