import { validationResult } from 'express-validator';

const validateResult = (req, res, next)=>{
    try {
        validateResult(req).throw()
    } catch (error) {
        req.status(403)
        res.send({ errors : error.array() })
    }
}

export{
    validateResult
}