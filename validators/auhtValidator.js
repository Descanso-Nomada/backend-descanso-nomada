import {check} from 'express-validator'
import { validateResult } from '../helpers/validateHelper.js'

const validateAuth =[
    check('correo')
    .exists()
    .isEmail(),
    check('contrasenia')
    .exists()
    .not()
    .isEmpty(),
    (req,res,next)=>{
        validateResult()
    }
]

export{
    validateAuth
}