import { check } from 'express-validator';
import { validateResult } from '../helpers/validateHelper.js';

const validateAuth = [
    check('correo')
        .exists({ checkFalsy: true }).withMessage('El correo es obligatorio')
        .isEmail().withMessage('Debe ingresar un correo electrónico válido'),

    check('contrasenia')
        .exists({ checkFalsy: true }).withMessage('La contraseña es obligatoria')
        .not().isEmpty().withMessage('La contraseña no puede estar vacía'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];

export {
    validateAuth
};
