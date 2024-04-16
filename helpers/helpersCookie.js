import jwt from 'jsonwebtoken';

const validarCookie = async (req, res, next) => {
  const info = {
    operacion: false,
    payload: "Token no valido"
  }

  try {
    const payload = jwt.verify(req.cookies.token, 'secret');
    info.operacion = true;
    info.payload = payload;
    req.user = payload;
    next();

  } catch (error) {
    res.status(404).json(error);
  }
}
const validarCookieHotel = async (req, res, next) => {
  const info = {
    operacion: false,
    payload: "Token no valido"
  }

  try {
    const payload = jwt.verify(req.cookies.token, 'secret');
    info.operacion = true;
    info.payload = payload;
    req.idHotel = decoded.idHotel; 
    next();

  } catch (error) {
    res.status(404).json(error);
  }
}
export {
    validarCookie,
    validarCookieHotel
  }