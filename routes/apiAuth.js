import  Express  from "express";
import { auth, validarCookieActiva, cerrarSesion } from "../controllers/authController.js";
import { validarCookie } from "../helpers/helpersCookie.js";
import { validateAuth } from "../validators/auhtValidator.js";

const apiAuth = Express();

apiAuth.post('',validateAuth, auth);
apiAuth.get('', validarCookie, validarCookieActiva );
apiAuth.get('/cerrarSesion', cerrarSesion );
export {apiAuth};