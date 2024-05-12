import { check } from 'express-validator';
import { validateResult } from '../helpers/validateHelper.js';

const validateReservacion= [
    check('id_habitacion')
        .exists({ checkFalsy: true }).withMessage('El id de la habitacion es obligatorio.')
        .isInt().withMessage('La id debe ser un número entero.'),

    check('cant_noches')
        .exists({ checkFalsy: true }).withMessage('La cantidad de noches es obligatorio.')
        .isInt().withMessage('La cantidad de noches debe ser un número entero.'),

    check('fecha_entrada')
        .exists({ checkFalsy: true }).withMessage('La fecha de entrada es obligatoria.')
        .isISO8601().withMessage('La fecha de entrada debe ser una fecha válida en formato YYYY-MM-DD.'),,

    check('fecha_salida')
        .exists({ checkFalsy: true }).withMessage('La fecha de salida es obligatoria.')
        .isISO8601().withMessage('La fecha de salida debe ser una fecha válida en formato YYYY-MM-DD.'),

    (req, res, next) => {
        validateResult(req, res, next);
    }
];
export{
    validateReservacion
}