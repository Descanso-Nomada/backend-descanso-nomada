import { validationResult } from 'express-validator';

// Middleware para validar los resultados de las validaciones de express-validator
const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array({ onlyFirstError: true })
        });
    }
    next();
};

export {
    validateResult
};
