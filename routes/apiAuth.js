import  Express  from "express";
import { auth, validarCookieActiva, verificarSesion, cerrarSesion } from "../controllers/authController.js";
import { validarCookie, validarCookieCombinado  } from "../helpers/helpersCookie.js";
import { validateAuth } from "../validators/auhtValidator.js";

const apiAuth = Express();

apiAuth.post('',validateAuth, auth);
apiAuth.get('', validarCookie, validarCookieActiva );
apiAuth.get('/verify',validarCookieCombinado, verificarSesion)
apiAuth.get('/logout', cerrarSesion );
export {apiAuth};