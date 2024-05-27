import Express from 'express';
const apiResetPass = Express()
import { sendCode, changePass } from '../controllers/resetPassController.js';

apiResetPass.post('/sendCode', sendCode);
apiResetPass.post('/changePass', changePass);

export{
    apiResetPass
}