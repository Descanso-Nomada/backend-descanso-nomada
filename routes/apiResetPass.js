import Express from 'express';
const apiResetPass = Express()
import { sendCode, } from '../controllers/resetPassController.js';

apiResetPass.post('/sendCode', sendCode);

export{
    apiResetPass
}